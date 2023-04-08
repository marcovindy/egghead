module.exports = (sequelize, DataTypes) => {
    const Answers = sequelize.define("Answers", {
        answer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isCorrect: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
          },
    });

    Answers.associate = (models) => {

        // Associate with Question
        Answers.belongsTo(models.Questions, {
            foreignKey: "questionId",
            onDelete: "CASCADE",
        });
    };

    return Answers;
};
