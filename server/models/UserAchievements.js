module.exports = (sequelize, DataTypes) => {
    const UserAchievements = sequelize.define(
      "UserAchievements",
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        achievementId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        tableName: "user_achievements", // Add this line
      }
    );
  
    UserAchievements.associate = (models) => {
      UserAchievements.belongsTo(models.Achievements, {
        foreignKey: "achievementId",
      });
      UserAchievements.belongsTo(models.Users, {
        foreignKey: "userId",
      });
    };
  
    return UserAchievements;
  };
  