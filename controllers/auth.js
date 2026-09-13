const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
const logger = require('../logger');

exports.join = async(req, res, next)=>{
    const {email, nick, password} = req.body;
    try{
        const exUser = await User.findOne({where : {email}});
        if(exUser){
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password : hash,
        });
        return res.redirect('/');
    }catch(err){
        logger.error(err.stack || err);
        return next(err);
    }
};

exports.login = (req, res, next)=>{
    passport.authenticate('local', (authError, user, info)=>{
        if(authError){
            logger.error(authError.stack || authError);
            return next(authError);
        }
        if(!user){
            return res.redirect(`/?error=${info.message}`);
        }
        return req.login(user, (loginError)=>{
            if(loginError){
                logger.error(loginError.stack || loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req,res, next);
};

exports.logout = (req,res, next)=>{
    req.logout(()=>{
        res.redirect('/');
    });
};