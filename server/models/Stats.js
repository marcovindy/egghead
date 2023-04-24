module.exports = (sequelize, DataTypes) => {
    const QuizStats = sequelize.define("QuizStats", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quizId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        experience: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        questions: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rank: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        timeSpend: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    QuizStats.associate = (models) => {
        // Associate with User
        QuizStats.belongsTo(models.Users, {
            foreignKey: "userId",
            onDelete: "CASCADE",
        });

        // Associate with Quiz
        QuizStats.belongsTo(models.Quizzes, {
            foreignKey: "quizId",
            onDelete: "CASCADE",
        });
    };

    return QuizStats;
};
