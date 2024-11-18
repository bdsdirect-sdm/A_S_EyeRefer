import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";

class User extends Model{
    public uuid!: string;
    public profile_photo!: string;
    public dob!:Date;
    public phone!: string;
    public gender!: string;
    public firstname!: string;
    public lastname!: string;
    // public fullname!: string;
    public doctype!: number;  // '1' for MD & '2' for OD
    public email!: string;
    public password!: string;
    public totalrefered!: number;
    public totalreferalreceive!: number;
    public totalreferalcompleted!: number;
    public is_verified!: boolean;
    public is_deleted!: boolean;
    public deleted_at!: Date;
    public status!: boolean;
    public Addresses!: string
    }

User.init({
    uuid:{
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    firstname:{
        type: DataTypes.STRING,
        allowNull:false
    },
    lastname:{
        type: DataTypes.STRING,
        allowNull:false
    },
    // fullname:{
    //     type: DataTypes.STRING,
    //     allowNull:false,
    //     get() {
    //         return `${this.firstname} ${this.lastname}`;
    //     },
    // },
    profile_photo:{
        type: DataTypes.STRING,
        allowNull:true
    },
    doctype:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false
    },
    totalrefered:{
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue: 0
    },
    totalreferalcompleted:{
        type: DataTypes.INTEGER,
        allowNull:false,
        defaultValue: 0
    },
    totalreferalreceive: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    dob:{
        type: DataTypes.DATEONLY,
        allowNull:true
    },
    phone:{
        type: DataTypes.STRING,
    },
    is_verified:{
        type: DataTypes.BOOLEAN,
        allowNull:true
    },
    is_deleted:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    deleted_at:{
        type: DataTypes.DATE,
        allowNull: true
    },
    status:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},{
    sequelize, 
    modelName: 'User'
})

export default User