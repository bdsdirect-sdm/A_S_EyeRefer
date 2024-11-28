import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";
import User from "./User";

class Staff extends Model {
    public uuid!: string;
    public firstname!: string;
    public lastname!: string;
    public email!: string;
    public phone!: string;
    public gender!: string;
    public user_id!: string;

}

Staff.init({
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
    email:{
        type: DataTypes.STRING,
        unique:true,
        allowNull: false
    },
    phone:{
        type: DataTypes.STRING,
        unique:true,
        allowNull: false
    },
    gender:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    sequelize,
    modelName: "staff"
})

User.hasOne(Staff, { foreignKey: "user_id", as:'doc', onDelete:"CASCADE", onUpdate:"CASCADE" });
Staff.belongsTo(User, { foreignKey: "user_id", as:'doc', onDelete: "CASCADE", onUpdate:"CASCADE" });

export default Staff;