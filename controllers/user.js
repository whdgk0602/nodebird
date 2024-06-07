const User = require('../models/user');
const follow = require('../services/user');

exports.follow = async (req, res, next) => {
  try {
    const result = await follow(req.user.id, req.params.id);
    // const user = await User.findOne({ where: { id: req.user.id } });
    // if (user) { // req.user.id가 followerId, req.params.id가 followingId
    //   await user.addFollowing(parseInt(req.params.id, 10));
    //   res.send('success');
    // } else {
    //   res.status(404).send('no user');
    // } 11강 강의 참고
    if(result === 'ok'){
      res.send('success');
    }else if (result === 'no user'){
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
