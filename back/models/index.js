const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {}

//시퀄라이즈가 노드랑 mysql을 연결해줌.
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Comment = require('./comment')(sequelize, Sequelize);    //시퀄라이즈가 함수 형태이므로 불러와서 바로 실행 시키는 것.
db.User = require('./user')(sequelize, Sequelize);
db.Image = require('./image')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
/*
class 방식일 때는

cons comment = require('./comment');

db.Comment = comment;

이후 아래 추가
Object.keys(db).forEach(modelName => {
  db[modelName].init(sequelize);
})
*/

//각 파일의 시퀄라이즈에서 설정한 associate들을 반복문 돌며 모두 실행하는 것. 이를 통해 관계 설정
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
