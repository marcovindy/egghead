module.exports = (sequelize, DataTypes) => {
    const Scores = sequelize.define("Scores", {
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      score: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    return Scores;
  };
  