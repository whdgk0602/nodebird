const { User, Post, Hashtag, Comment } = require('../models');
const logger = require('../logger');

const PAGE_SIZE = 10;
const postIncludes = [
  { model: User, attributes: ['id', 'nick'] },
  { model: Comment, include: [{ model: User, attributes: ['id', 'nick'] }] },
];

exports.renderProfile = (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
};

exports.renderJoin = (req, res) => {
  res.render('join', { title: '회원가입 - NodeBird' });
};

exports.renderMain = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: postIncludes,
      order: [['createdAt', 'DESC']],
      limit: PAGE_SIZE,
    });
    res.render('main', {
      title: 'NodeBird',
      twits: posts,
    });
  } catch (err) {
    logger.error(err.stack || err);
    next(err);
  }
}

exports.renderHashtag = async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({
        include: postIncludes,
        order: [['createdAt', 'DESC']],
        limit: PAGE_SIZE,
      });
    }

    return res.render('main', {
      title: `${query} | NodeBird`,
      twits: posts,
      hashtag: query,
    });
  } catch (error) {
    logger.error(error.stack || error);
    return next(error);
  }
};