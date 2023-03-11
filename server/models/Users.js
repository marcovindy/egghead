module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    // Users.associate = (models) => {
    //   Users.hasMany(models.Comments, {
    //     onDelete: "cascade",
    //   });
    // };
    return Users;
  };