// const http = require('http');

// const server = http.createServer((req, res) => {
//     console.log(req.url, req.method);
//     res.end('hello node');
// });

// server.listen(3000, () => console.log('서버 실행! 3000포트'));
const path = require('path');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');

const postRouter = require('./route/post');
const postsRouter = require('./route/posts');
const userRouter = require('./route/user');
const hashtagRouter = require('./route/hashtag');
const db = require('./models')
const passportConfig = require('./passport');

dotenv.config();

const app = express();

//만든 시퀄라이즈를 연결.
db.sequelize.sync()     //Promise임.
    .then(() => {
        console.log('DB 연결 성공');
    })
    .catch(console.error);

passportConfig();

app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,     //꼭 써줘야 함. 기본값은 false인데 true로 해줘야 함.
}));  //CORS를 해결하는 방법3. 인자를 비워두면 모두 허용. 근데 보안적으로 안 좋으므로 특정 도메인 주소만 허용하도록 할 수 있음. 
//{origin: 'https://nodebird.com'}
//{origin: true} 로 해두면 *대신 보낸 곳의 주소가 자동으로 들어가 편리함.

app.use('/', express.static(path.join(__dirname, 'uploads')));  //첫 인자에 /를 써주면 loacalhost:8000/가 됨. /images로 하면 localhost:800/images가 됨.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('hello express!');
})

app.get('/api/posts', (req, res) => {
    res.json([
        {id: 1, content: 'hello1'},
        {id: 2, content: 'hello2'},
        {id: 3, content: 'hello3'},
        {id: 4, content: 'hello4'}
    ]);
})

app.use('/post', postRouter);   //post는 접두어. postRouter 파일에 공통적으로 post가 들어가는 거.
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

// app.use((err, req, res, next) => {  //기본적으로 에러 처리 미들웨어가 있지만 직접 커스터마이징 할 수 있음.

// });

app.listen(8000, () => {
    console.log('서버 실행 중...');
});