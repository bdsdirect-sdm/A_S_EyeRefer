"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const uuid_1 = require("uuid");
const Address_1 = __importDefault(require("./Address"));
const User_1 = __importDefault(require("./User"));
class Patient extends sequelize_1.Model {
}
Patient.init({
    uuid: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: uuid_1.v4,
        primaryKey: true,
        allowNull: false
    },
    firstname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    disease: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    referalstatus: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    referback: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    },
    isseen: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: db_1.default,
    modelName: 'Patient'
});
User_1.default.hasMany(Patient, { foreignKey: 'referedby', as: "referbydoc", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Patient.belongsTo(User_1.default, { foreignKey: 'referedby', as: "referbydoc", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User_1.default.hasMany(Patient, { foreignKey: 'referedto', as: "refertodoc", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Patient.belongsTo(User_1.default, { foreignKey: 'referedto', as: "refertodoc", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Address_1.default.hasMany(Patient, { foreignKey: "address", as: "docaddress", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Patient.belongsTo(Address_1.default, { foreignKey: "address", as: "docaddress", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
exports.default = Patient;
