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
    // Associate with Categories
    Quizzes.belongsToMany(models.Categories, {
      through: "quiz_categories",
    });

    // Associate with User
    Quizzes.belongsTo(models.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return Quizzes;
};
