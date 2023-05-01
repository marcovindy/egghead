// models/Likes.js
module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define("Likes");

  Likes.associate = (models) => {
    Likes.belongsTo(models.Users, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Likes.belongsTo(models.Quizzes, {
      foreignKey: 'quizId',
      onDelete: 'CASCADE',
    });
  };

  return Likes;
};
