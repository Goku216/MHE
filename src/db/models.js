import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const User = sequelize.define(
  "User",
  {
    userid: {
      // Keep this as userid
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "users",
  }
);

export const Questionnaire = sequelize.define(
  "Questionnaire",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    no_of_questions: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time_to_complete: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "questionnaires",
  }
);

export const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    questionnaire_id: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "questions",
    timestamps: false, // Disable automatic timestamp fields (createdAt, updatedAt)
  }
);

export const EvaluationSession = sequelize.define(
  "EvaluationSession",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "userid", // Changed to reference userid instead of id
      },
    },
    questionnaire_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "questionnaires",
        key: "id",
      },
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
    tableName: "evaluation_sessions",
  }
);

export const Result = sequelize.define(
  "Result",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    session_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "evaluation_sessions",
        key: "id",
      },
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    severity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "results",
  }
);

// Define associations with onDelete and onUpdate behaviors
Questionnaire.hasMany(Question, {
  foreignKey: "questionnaire_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Question.belongsTo(Questionnaire, {
  foreignKey: "questionnaire_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

User.hasMany(EvaluationSession, {
  foreignKey: "user_id",
  sourceKey: "userid", // Added sourceKey to specify the User primary key
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
EvaluationSession.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "userid", // Added targetKey to specify the User primary key
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Questionnaire.hasMany(EvaluationSession, {
  foreignKey: "questionnaire_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
EvaluationSession.belongsTo(Questionnaire, {
  foreignKey: "questionnaire_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

EvaluationSession.hasOne(Result, {
  foreignKey: "session_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Result.belongsTo(EvaluationSession, {
  foreignKey: "session_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
