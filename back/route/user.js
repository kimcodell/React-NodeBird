const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');

const { User, Post, Image, Comment } = require('../models');   //이게 db를 export하기 때문에 구조분해할당
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {   //GET /user
    try {
        if (req.user) {
            const fullUserWithoutPassword = await User.findOne({
                where: { id: req.user.id }, //만약 로그인 안 했으면 req.user가 없으므로 여기서 에러가 남. 따라서 if로 분기
                attributes: {
                    exclude: ['password'],
                },
                include: [{
                    model: Post,
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }],
            });
            res.status(200).json(fullUserWithoutPassword);
        } else {
            res.status(200).json(null);
        }
    } catch (error) {
        console.log(error);
        next(error);    //next(인자)인 경우 에러처리 미들웨어로 전해짐.
    }
});

router.get('/:userId/posts', async (req, res, next) => {
    try {
        let where = { UserId: req.params.userId };
        if (parseInt(req.query.lastId, 10)) {   //초기 로딩이 아닐 때. 초기 로딩 때는 lastId가 0임.
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }  //[Op.lt]하면 lastId보다 작은 것
        }
        const posts = await Post.findAll({  //findOne 말고 전부다 가져오기
            where,
            limit: 10,
            // offset: 100, //101~110. offset부터 limit개수씩 불러옴. but 단점이 있음. 중간에 글이 추가되거나 삭제되면 순서가 꼬여 버림.
            //따라서 임의로 lastId를 정해주고 여기부터 가져옴.
            order: [
                ['createdAt', 'DESC'],
            ], //이차원 배열인 이유는 여러 정렬 방식을 설정할 수 있기 때문
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }]
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }],
            },],
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST /user/login
router.post('/login', isNotLoggedIn, (req, res, next) => {     //미들웨어 확장 방법.
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (info) {
            return res.status(401).send(info.reason);
        }
        return req.login(user, async (loginErr) => {    //login은 passport에서 나온 거
            if (loginErr) {
                console.error(loginErr);
                return next(loginErr);  //여기는 passport에서 에러 나는 것 대비. 보통은 에러 거의 안나지만 혹시 모르니
            }
            const fullUserWithoutPassword = await User.findOne({
                where: { id: user.id },
                // attributes: ['id', 'nickname', 'email'],     //default는 모든 컬럼을 보내주지만, 원하는 것만 받아 올 수 있음. 지금은 비번 필요없고, 가져오면 보안에 취약하므로 비번만 제외
                attributes: {       //이렇게 제외를 할 수도 있음.
                    exclude: ['password'],
                },
                include: [{     //관계가 있는 다른 테이블을 join해서 가져오기
                    model: Post,     //hasmany 관계이기 때문에 Post가 복수형이 되어 me.Posts가 됨.
                    attributes: ['id'], //id만 알아도 본인 게시글, 팔로워, 팔로잉 수 알 수 있으므로 데이터 용량 줄이기 위해 id만 받아오게 설정.
                }, {
                    model: User,
                    as: 'Followings',   //as 설정해준 경우는 as에 쓴 값 그대로 가져와야 함.
                    attributes: ['id'],
                }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                }],
            });
            return res.status(200).json(fullUserWithoutPassword);
        });
    })(req, res, next);
});  //done에 쓴 게 인자로 전달됨.

router.post('/logout', isLoggedIn, (req, res, next) => {
    req.logout();   //login처럼 logout도 있음.
    req.session.destroy();  //로그인 정보 없애는 거.
    res.status(200).send('ok');
})

router.post('/', isNotLoggedIn, async (req, res, next) => {    // POST /user/
    try {
        const exUser = await User.findOne({
            where: {
                email: req.body.email,
            }
        });
        if (exUser) {
            return res.status(403).send('이미 사용 중인 이메일입니다.');    //return 안쓰면 send가 2번 되므로 에러남. return으로 끊어줘야 함.
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);    //숫자는 주로 10~13을 사용. 숫자가 높을 수록 보안에 안전하지만 시간이 좀 더 오래 걸림.
        await User.create({     //create 함수가 비동기이기 때문에 await으로 처리한 후 뒤에 send 등 처리하도록 하는 것.
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword,
        });
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060');  //2번째는 허용할 주소. '*'은 모두 허용. CORS를 해결하는 방법1
        //CORS를 해결하는 방법2: 브라우저 측에서 발생하는 것이고 서버 간 요청에는 발생하지 않으므로 브라우저와 같은 포트를 쓰는 프론트 서버에 요청을 보내고
        //프론트 서버가 백 서버에 요청을 보내는 방식으로 해결할 수 있음. 이것이 proxy
        res.status(201).send('ok');
    } catch (error) {
        console.error(error);
        next(error)
    }
});

router.patch('/nickname', isLoggedIn, async (req, res, next) => { //PATCH /user/nickname
    try {
        await User.update({     //첫 객체에 수정 내용, 두번째 객체에 수정할 타겟
            nickname: req.body.nickname,
        }, {
            where: { id: req.user.id },
        });
        res.status(200).json({ nickname: req.body.nickname });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => { //PATCH /user/1/follow
    try {
        const user = await User.findOne({ where: { id: req.params.userId }});
        if (!user) {
            return res.status(403).send('존재하지 않는 사용자입니다.');
        }
        await user.addFollowers(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {    //DELETE /user/1/follow
    try {
        const user = await User.findOne({ where: { id: req.params.userId }});
        if (!user) {
            return res.status(403).send('존재하지 않는 사용자입니다.');
        }
        await user.removeFollowers(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/followers', isLoggedIn, async (req, res, next) => {      //GET /user/followers
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (!user) {
            return res.status(403).send('존재하지 않는 사용자입니다. followers');
        }
        const followers = await user.getFollowers({
            limit: parseInt(req.query.limit),
        });
        res.status(200).json(followers);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/followings', isLoggedIn, async (req, res, next) => {      //GET /user/followings
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (!user) {
            return res.status(403).send('존재하지 않는 사용자입니다. followings');
        }
        const followings = await user.getFollowings({
            limit: parseInt(req.query.limit),
        });
        res.status(200).json(followings);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {    //DELETE /user/follower/1
    try {
        const user = await User.findOne({ where: { id: req.params.userId }});
        if (!user) {
            return res.status(403).send('팔로워가 아닙니다.');
        }
        await user.removeFollowings(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/:userId', async (req, res, next) => {   //GET /user/1
    try {
        const fullUserWithoutPassword = await User.findOne({
            where: { id: req.params.userId },
            attributes: {
                exclude: ['password'],
            },
            include: [{
                model: Post,
                attributes: ['id'],
            }, {
                model: User,
                as: 'Followings',
                attributes: ['id'],
            }, {
                model: User,
                as: 'Followers',
                attributes: ['id'],
            }],
        });
        // console.log(fullUserWithoutPassword)
        if (fullUserWithoutPassword) {
            const data = fullUserWithoutPassword.toJSON();
            data.Posts = data.Posts.length;     //그냥 그대로 정보를 보내기보단 정보를 최소화해서 개인정보 보호를 함.
            data.Followers = data.Followers.length;
            data.Followings = data.Followings.length;
            res.status(200).json(fullUserWithoutPassword);
        } else {
            res.status(404).json("존재하지 않는 사용자입니다. get /:userId");
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;