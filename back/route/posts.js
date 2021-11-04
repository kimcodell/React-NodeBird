const express = require('express');
const { Op } = require('sequelize');

const { Post, User, Image, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        let where = {};
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
                [Comment, 'createdAt', 'DESC'],
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

module.exports = router;
