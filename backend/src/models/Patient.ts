import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";
import Address from "./Address";
import User from "./User";

class Patient extends Model{
    public uuid!: number;
    public firstname!: string;
    public lastname!: string;
    public email!: string;
    public disease!: string;
    public referedby!: string;
    public referedto!: string;
    public referalstatus!: boolean;
    public referback!: boolean;
    public patientId!: string;
    public refertodoc!: string;
    public referbydoc!: string;
    public address!: string;
    public isseen!: boolean; // 0: pending, 1: scheduled
}

Patient.init({
    uuid:{
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    firstname:{
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    disease:{
        type: DataTypes.STRING,
        allowNull: false
    },
    referalstatus:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue:false
    },
    referback:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    isseen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},{
    sequelize,
    modelName:'Patient'
})

User.hasMany(Patient, { foreignKey: 'referedby', as: "referbydoc", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'referedby', as: "referbydoc", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

User.hasMany(Patient, { foreignKey: 'referedto', as: "refertodoc", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'referedto', as: "refertodoc", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Address.hasMany(Patient, {foreignKey:"address", as: "docaddress", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Patient.belongsTo(Address, {foreignKey:"address", as: "docaddress", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

export default Patient;