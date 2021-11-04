//passport 설정 파일
const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
    passport.serializeUser((user, done) => {      //req.login의 첫 인자(user)가 들어옴.
        done(null, user.id);  //세션에 로그인 유저에 대한 정보를 다 들고 있으면 서버의 메모리가 다 차서 터져버림. 따라서 id값만 저장.
    });

    passport.deserializeUser(async (id, done) => {  //저장했던 id값으로 db에서 사용자를 찾아 사용자 정보 가져옴.
        try {
            console.log("성공부분")
            const user = await User.findOne({ where: { id } });
            done(null, user);   //일단 시리얼라이즈한 후에는 id값으로 user정보를 찾아서 req.user에 담김. 
        } catch (error) {
            console.log("에러부분")
            console.error(error);
            done(error);
        }
    });

    local();
};