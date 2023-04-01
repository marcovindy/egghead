module.exports = (sequelize, DataTypes) => {
    const Categories = sequelize.define("Categories", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Categories.associate = (models) => {
        Categories.belongsToMany(models.Quizzes, {
            through: "quiz_categories",
            foreignKey: "categoryId",
        });
    };

    return Categories;
};
