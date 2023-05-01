module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    experience: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.Quizzes);
  };

  Users.associate = (models) => {
    Users.hasMany(models.Likes, {
      onDelete: "cascade",
    });

    // Associate with Achievements
    Users.belongsToMany(models.Achievements, {
      through: "user_achievements",
      foreignKey: "userId",
    });

  };

  return Users;
};
