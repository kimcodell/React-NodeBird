const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Comment extends Model {  //sequelize.define() -> Model.init()
    static init(sequelize) {
        return super.init({
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },

        }, {
            modelName: 'Comment',
            tableName: 'comments',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            sequelize,
        });
    }

    static associate(db) {
        db.Comment.belongsTo(db.User);
        db.Comment.belongsTo(db.Post);
    }
}
//class 방식이 최신 문법

// module.exports = (sequelize, DataTypes) => {
//     const Comment = sequelize.define('Comment', {
//         content: {
//             type: DataTypes.TEXT,
//             allowNull: false,
//         },
//         //UserId,
//         //PostId,
//     }, {
//         charset: 'utf8mb4',
//         collate: 'utf8mb4_general_ci',
//     });
//     Comment.associate = (db) => {
//         db.Comment.belongsTo(db.User);  //속하는 관계. belongsTo가 있으면 자동으로 MySQL에 UserId, PostId를 만듦.
//         db.Comment.belongsTo(db.Post);
//     };
//     return Comment;
// }