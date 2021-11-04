module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {     //테이블명을 지정한 거. MYSQL에는 소문자화 + 복수형이 되어서 저장 (users)
        //id는 기본으로 들어감.
        email: {
            type: DataTypes.STRING(30),
            allowNull: false,   //필수
            unique: true,   //고유한 값
        },
        nickname: {
            type: DataTypes.STRING(30),
            allowNull: false,   //필수
        },
        password: {
            type: DataTypes.STRING(100),    //비밀번호는 암호화하면 길이가 많이 늘어나므로 넉넉히 100자
            allowNull: false,   //필수
        },
    }, {    //두번째 객체는 모델에 대한 세팅
        charset: 'utf8',
        collate: 'utf8_general_ci',  //한글 사용 위한 세팅
    });
    User.associate = (db) => {
        db.User.hasMany(db.Post);   //1대N 관계 설정
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post, {through: 'Like', as: 'Liked' }); //through로 중간 테이블의 이름을 지어줄 수 있음. 양쪽 다 설정해줘야 함.
        //1대1일 때는 hasOne, belongsTo로 설정. belongsTo가 들어가는 애가 FK가 생기는 것.
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' });  //같은 테이블에서의 관계 설정.
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollwerId' });   //foreignKey는 컬럼명 설정.
        //같은 테이블에서 belongsToMany를 하면 중간 테이블에 Id가 구분이 안됨.(둘다 UserId, UserId가 됨.) 따라서 foreignKey를 설정해 구분을 해줌.
        //as는 자바스크립트에서 접근할 때 쓰일 이름, foreignKey는 컬러명. 또한 as랑 foreignKey는 서로 반대되는 테이블을 가리키고 있음.
    };
    return User;
}