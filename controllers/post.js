const { Op } = require('sequelize');
const {Post, Hashtag, User, Comment} = require('../models');
const logger = require('../logger');

const PAGE_SIZE = 10;

exports.afterUploadImage = (req, res)=>{
    res.json({url:`img/${req.file.filename}`});
};

exports.uploadPost = async(req, res, next)=>{
    try{
        const post = await Post.create({
            content : req.body.content,
            img : req.body.url,
            UserId : req.user.id,  
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if(hashtags){
            const result = await Promise.all(
                hashtags.map(tag=>{
                    return Hashtag.findOrCreate({
                        where : {title : tag.slice(1).toLowerCase()},
                    })
                }),
            );
            await post.addHashtags(result.map(r=>r[0]));
        }
        res.redirect('/');
    }catch(error){
        logger.error(error.stack || error);
        next(error);
    }
};

exports.loadMorePosts = async (req, res, next) => {
    const lastId = parseInt(req.query.lastId, 10) || 0;
    const include = [
        { model: User, attributes: ['id', 'nick'] },
        { model: Comment, include: [{ model: User, attributes: ['id', 'nick'] }] },
    ];
    try {
        let twits;
        if (req.query.hashtag) {
            const hashtag = await Hashtag.findOne({ where: { title: req.query.hashtag } });
            twits = hashtag
                ? await hashtag.getPosts({
                    where: { id: { [Op.lt]: lastId } },
                    include,
                    order: [['createdAt', 'DESC']],
                    limit: PAGE_SIZE,
                })
                : [];
        } else {
            twits = await Post.findAll({
                where: { id: { [Op.lt]: lastId } },
                include,
                order: [['createdAt', 'DESC']],
                limit: PAGE_SIZE,
            });
        }
        const followingIdList = req.user?.Followings?.map((f) => f.id) || [];
        res.render('_twits.html', { twits, user: req.user, followingIdList });
    } catch (error) {
        logger.error(error.stack || error);
        next(error);
    }
};