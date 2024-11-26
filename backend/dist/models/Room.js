"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const uuid_1 = require("uuid");
const User_1 = __importDefault(require("./User"));
const Patient_1 = __importDefault(require("./Patient"));
class Room extends sequelize_1.Model {
}
Room.init({
    uuid: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: uuid_1.v4,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
}, {
    modelName: 'Room',
    sequelize: db_1.default
});
User_1.default.hasMany(Room, { foreignKey: 'user_id_1', as: 'doc1', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Room.belongsTo(User_1.default, { foreignKey: 'user_id_1', as: 'doc1', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User_1.default.hasMany(Room, { foreignKey: 'user_id_2', as: 'doc2', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Room.belongsTo(User_1.default, { foreignKey: 'user_id_2', as: 'doc2', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Patient_1.default.hasMany(Room, { foreignKey: 'patient_id', as: 'patient', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Room.belongsTo(Patient_1.default, { foreignKey: 'patient_id', as: 'patient', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
exports.default = Room;
