const passport = require('passport');
const { Strategy: LocalStrategy} = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',     //여기가 아이디 칸. req.body에서 받아오는 것의 이름. 만약 id이면 id로 이름 바꿔야 함.
        passwordField: 'password',  //여기가 비밀번호 칸.
    }, async (email, password, done) => {
        try {
            const user = await User.findOne ({
                where: { email }
            });
            if (!user) {
                return done(null, false, { reason: '존재하지 않는 이메일입니다.' })   //passport는 응답을 보내진 않고 done으로 처리. 1번 자리: 서버 에러, 2번 자리: 성공 여부, 3번 자리: 클라이언트 에러
            }
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                return done(null, user);
            }
            return done(null, false, { reason: '비밀번호가 일치하지 않습니다.' });
        } catch (error) {
            console.error(error);
            return done(error);
        }
    }));
};