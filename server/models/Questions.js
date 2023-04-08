module.exports = (sequelize, DataTypes) => {
    const Questions = sequelize.define("Questions", {
        question: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    Questions.associate = (models) => {

        // Associate with User
        Questions.belongsTo(models.Quizzes, {
            foreignKey: "quizId",
            onDelete: "CASCADE",
        });
    };

    return Questions;
};
