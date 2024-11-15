import sequelize from "../config/db";
import { Model, DataTypes, DateOnlyDataType } from "sequelize";
import User from "./User";
import Patient from "./Patient";
import { v4 as UUIDV4 } from "uuid";

class Appointment extends Model {
    public uuid!: string;
    public patientname!: string;
    public date!: DateOnlyDataType;
    public type!: number; // 1: Surgery, 2: Other
    public status!: number // 1: Scheduled, 2: Cancelled, 3: Complete
    public consultdate!: DateOnlyDataType;
    public surgerydate!: DateOnlyDataType;
    public patientId!: string;
    public appointedby!: string;
}

Appointment.init({
    uuid:{
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    patientname:{
        type: DataTypes.STRING,
        allowNull: false
    },
    date:{
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    type:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    consultdate:{
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    surgerydate:{
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
},{
    modelName: 'Appointment',
    sequelize
})

Patient.hasOne(Appointment, { foreignKey: 'patientId', as: 'patientId', onDelete: "CASCADE", onUpdate: "CASCADE" });
Appointment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patientId', onDelete: "CASCADE", onUpdate: "CASCADE" });

User.hasOne(Appointment, { foreignKey: "appointedby", as: "appointedby", onDelete: "CASCADE", onUpdate: "CASCADE" });
Appointment.hasOne(User, { foreignKey: "appointedby", as: "appointedby", onDelete: "CASCADE", onUpdate: "CASCADE" });