module.exports = (sequelize, DataTypes) => {
    const Categories = sequelize.define("Categories", {
        category_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Categories;
};
