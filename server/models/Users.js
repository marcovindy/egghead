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
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    level: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    role: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    rank: {
      type: DataTypes.NUMBER,
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

    Users.hasMany(models.Posts, {
      onDelete: "cascade",
    });
  };

  return Users;
};
