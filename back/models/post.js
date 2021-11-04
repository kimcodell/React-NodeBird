module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        //PostId => RetweetId       as: 'Retweet' 하면 이렇게 바뀜.
    }, {
        charset: 'utf8mb4',     //이모티콘 사용 가능
        collate: 'utf8mb4_general_ci',
    });
    Post.associate = (db) => {
        db.Post.belongsTo(db.User);
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });  //N대N 관계. N대N 관계는 중간 테이블이 자동으로 생김.
        //belongsToMany는 through 옵션 필수...? AssociationError 뜸.
        db.Post.belongsToMany(db.User, {through: 'Like', as: 'Likers' });   //as로 위에 belongsTo(db.User)와 구분(별칭).
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);
        db.Post.belongsTo(db.Post, { as: 'Retweet' });
        //관계를 지정해주면 관계 메서드가 생김. belongsTo면 단수, Many면 복수. add, get, set, remove
        /* 위부터 순서대로
            post.addUser, post.removeUser, post.getUser, post.setUser
            post.addHashtags, post.removeHashtags, post.getHashtags, post.setHashtags
            post.addLikers, post.removeLikers, post.getLikers, post.setLikers
            post.addComments, post.removeComments, post.getComments, post.setComments
            post.addImages, post.removeImages, post.getImages, post.setImages
            post.addRetweet, post.removeRetweet, post.getRetweet, post.setRetweet
            
            물론 get은 include 쓰면 되므로 잘 안 쓰이긴 함.
        */
    };
    return Post;
}