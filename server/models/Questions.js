module.exports = (sequelize, DataTypes) => {
    const Questions = sequelize.define("Questions", {
        question: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    Questions.associate = (models) => {

        // Associate with quizzes
        Questions.belongsTo(models.Quizzes, {
            foreignKey: "quizId",
            onDelete: "CASCADE",
        });

        // Associate with answers
        Questions.hasMany(models.Answers, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false,
                name: "questionId"
            }
        });


    };





    return Questions;
};
