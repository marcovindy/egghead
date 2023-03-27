module.exports = (sequelize, DataTypes) => {
  const Quizzes = sequelize.define("Quizzes", {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quiz_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exper: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Quizzes;
};
