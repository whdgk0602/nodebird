const { Comment, User } = require('../models');
const logger = require('../logger');

exports.create = async (req, res, next) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      UserId: req.user.id,
      PostId: req.params.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{ model: User, attributes: ['id', 'nick'] }],
    });
    res.json(fullComment);
  } catch (error) {
    logger.error(error.stack || error);
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({ where: { id: req.params.commentId } });
    if (!comment) {
      return res.status(404).send('no comment');
    }
    if (comment.UserId !== req.user.id) {
      return res.status(403).send('forbidden');
    }
    await comment.destroy();
    res.send('success');
  } catch (error) {
    logger.error(error.stack || error);
    next(error);
  }
};
