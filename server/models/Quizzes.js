module.exports = (sequelize, DataTypes) => {
  const Quizzes = sequelize.define("Quizzes", {
    title: {
      type: DataTypes.STRING,
      default: "Untitled",
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      default: "English",
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificated: {
      type: DataTypes.BOOLEAN, 
      default: false,
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

    // Associate with Questions
    Quizzes.hasMany(models.Questions, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false,
        name: "quizId"
      }
    });
  };

  return Quizzes;
};
