module.exports = (sequelize, DataTypes) => {
    const UserAchievements = sequelize.define("UserAchievements", {
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
    });
  
    return UserAchievements;
  };
  