//커스텀 미들웨어

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();     //인자를 안넣고 그냥 쓰면 다음 미들웨어로 넘어감. 인자가 있으면 에러처리 부분으로 감.
    } else {
        res.status(401).send('로그인 상태가 아닙니다.');
    }
}

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();     //인자를 안넣고 그냥 쓰면 다음 미들웨어로 넘어감. 인자가 있으면 에러처리 부분으로 감.
    } else {
        res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
    }
}