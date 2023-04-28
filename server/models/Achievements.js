module.exports = (sequelize, DataTypes) => {
    const Achievements = sequelize.define("Achievements", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      experiences: {
        type: DataTypes.INTEGER,
      },
      how_to_get: {
        type: DataTypes.TEXT,
      },
      icon: {
        type: DataTypes.STRING,
      },
      difficulty: {
        type: DataTypes.STRING,
      },
    });
  
    Achievements.associate = (models) => {
      // Associate with User
      Achievements.belongsToMany(models.Users, {
        through: "user_achievements",
        foreignKey: "achievementId",
      });
    };
  
    return Achievements;
  };
  