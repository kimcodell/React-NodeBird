const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Comment, Image, User, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try{
    fs.accessSync('uploads');   //uploads 폴더가 있는지 검사. 없으면 에러나서 catch로 감.
} catch (error) {
    console.log('uploads 폴더가 없으므로 생성합니다.');
    fs.mkdirSync('uploads');
}

//웬만하면 이미지, 영상은 우리 서버를 거치지 않는 게 좋음. 그냥 프론트에서 직접 클라우드로 보내는 것이 좋음.
//multer는 app.use로 설정해줄 수도 있긴하지만 보통은 라우터마다 설정해줌. 각 폼마다 업로드할 미디어 파일의 개수가 다를 수 있기 때문.
const upload = multer({     //옵션 설정
    storage: multer.diskStorage({   //diskStorage는 컴퓨터 하드. 보통은 aws의 s3롤 바꿈.
        destination(req, file, done) {
            done(null, 'uploads');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);    //확장자 추출(.jpg, .png 등등)
            const basename = path.basename(file.originalname, ext);     //파일명 추출
            done(null, basename + '_' + new Date().getTime() + ext);  //노드는 파일명이 같으면 그냥 덮어 씌워버림. 그걸 막기 위해 업로드 시간에 대한 정보를 파일명에 포함시키는 것.
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, //20MB로 파일 크기 제한
}); 
//만약 한 개만 올릴거면 upload.single(), 아무것도 안 올릴 때는 upload.none(), 인풋창에 2개 이상이어서 합쳐야 하는 경우 upload.fills()
router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {      //POST /post/images
    //이 안쪽은 이미지 업로드(upload) 후에 실행. req에 이미지 정보 들어있음.
    try {
        console.log(req.files);
        res.json(req.files.map((v) => v.filename));
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {    //POST /post
    try {
        const hashtag = req.body.content.match(/#[^\s#]+/g);
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,    //로그인하고 나면 디시리얼라이즈가 매번 실행되는데 거기에 user가 있음.
        });

        if (hashtag) {
            //findOrCreate는 만약 없으면 생성, 있으면 불러오기. where 필요. 
            const result = await Promise.all(Array.from(new Set(hashtag)).map((tag) => Hashtag.findOrCreate({ 
                where: { name: tag.slice(1).toLowerCase() },
            })));   //result 모양 = [[노드,  true], [익스프레스, true]]    true, false는 생성한건지 불러온건지
            await post.addHashtags(result.map((v) => v[0]));    //result가 이차원 배열이므로 이렇게 add 하는 거.
        }

        if (req.body.image){ //multer는 image 같은 것들은 req.file 또는 req.files에 들어가지만 그 외 나머지는 req.body에 들어있음.
            if (Array.isArray(req.body.image)) {    //이미지를 여러 개 올리면 image가 배열( image: [~~.png, !!.jpg] )이 되고
                const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image }))); //비동기인데 여러 개 올리므로 Promise.all()
                //참고로 DB의 Image 테이블에는 이미지 파일에 접근하기 위해 이미지 파일명(파일 주소)만 들어감. 실제 이미지 파일은 uploads 폴더에 있음.
                await post.addImages(images);
            } else {    //이미지 한 개면 그냥 객체 ( image: ~~.png )
                const image = await Image.create({ src: req.body.image});
                await post.addImages(image);
            }
        
        }
            const fullPost = await Post.findOne({
            where: {id: post.id},
            include:[{
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,    //댓글 작성자
                    attributes: ['id', 'nickname'],
                }],
            }, {
                model: User,    //게시글 작성자
                attributes: ['id', 'nickname'],
            }, {
                model: User,    //좋아요 누른 사람
                as: 'Likers',
                attributes: ['id'],
            }],
        });
        res.status(201).json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {    //POST /post/{id}/comment
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId }
        });
        if (!post) {
            return res.status(403).send('존재하지 않는 게시물입니다.');
        }
        const comment = await Comment.create({
            content: req.body.content,
            PostId: parseInt(req.params.postId, 10),
            UserId: req.user.id,
        });
        const fullComment = await Comment.findOne({
            where: { id: comment.id },
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }],
        })
        res.status(201).json(fullComment);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {    //POST /post/{id}/retweet
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
            include: [{
                model: Post,
                as: 'Retweet',
            }],
        });
        if (!post) {
            return res.status(403).send('존재하지 않는 게시물입니다.');
        }
        //자기 게시글 리트윗 막기 + 자기 게시글 리트윗한거 리트윗 막기
        if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
            return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
        }
        const retweetTargetId = post.RetweetId || post.id;  //리트윗 하려는 게 이미 리트윗 게시물이면 원본 아이디. 아니면 그 게시글 아이디 받기
        const exPost = await Post.findOne({
            where: { 
                UserId: req.user.id,
                RetweetId: retweetTargetId,
            },
        });
        if (exPost) {
            return res.status(403).send('이미 리트윗한 게시글입니다.');
        }
        const retweet = await Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,
            content: 'retweet',
        });
        //이렇게 include가 복잡해지면 속도가 매우 떨어짐. 이럴 때는 라우트를 쪼개서 댓글 같은 건 나중에 불러오거나 댓글창 열 때 불러오는 식으로 할 수 있음.
        const retweetWithPrevPost = await Post.findOne({
            where: { id: retweet.id },
            include: [{
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }],
            }, {
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }],
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id'],
            }],
        })
        res.status(201).json(retweetWithPrevPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/:postId', async (req, res, next) => {    //POST /post/{id}
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });
        if (!post) {
            return res.status(404).send('존재하지 않는 게시물입니다.');
        }
        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [{
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }],
            }, {
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }],
            }],
        })
        res.status(200).json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {     //PATCH /post/1/like
    try {
        const post = await Post.findOne({ where: {id: req.params.postId }});
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니다.');
        }
        await post.addLikers(req.user.id);
        res.status(200).json({ PostId: post.id, UserId: req.user.id });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {    //DELETE /post/1/like
    try {
        const post = await Post.findOne({ where: {id: req.params.postId }});
        if (!post) {
            return res.status(403).send('게시글이 존재하지 않습니다.');
        }
        await post.removeLikers(req.user.id);
        res.status(200).json({ PostId: post.id, UserId: req.user.id });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => {  //DELETE /post/1
    try {
        await Post.destroy({    //제거할 땐 destroy()
            where: { 
                id: req.params.postId,
                UserId: req.user.id,
            },
        });
        res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;