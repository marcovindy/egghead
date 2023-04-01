module.exports = (sequelize, DataTypes) => {
  const Quizzes = sequelize.define("Quizzes", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Quizzes.associate = (models) => {
    Quizzes.belongsToMany(models.Categories, {
      through: "quiz_categories",
    });
  };

  return Quizzes;
};
