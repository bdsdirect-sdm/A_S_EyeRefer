import { Local } from "../environment/env";
import Address from "../models/Address";
import Patient from "../models/Patient";
import Appointment from "../models/Appointment";
import Room from "../models/Room";
import sendOTP from "../utils/mailer";
import Staff from "../models/Staff";
import User from "../models/User";
import { Response } from 'express';
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import bcrypt from 'bcrypt';
import Notification from "../models/Notification";
import PDFDocument from 'pdfkit';
import { io } from "../socket/socket";

const Security_Key:any = Local.SECRET_KEY;
// const checkPassword = async() => {

// }

// const getLoginedUser = async(req:any) => {

// }

const otpGenerator = () => {
    return String(Math.round(Math.random()*10000000000)).slice(0,6);
}

export const  registerUser = async (req:any, res:Response) => {
    try{
        const {firstname, lastname, doctype, email, password} = req.body;
        const isExist = await User.findOne({where:{email:email}});
        if(isExist){
            res.status(401).json({"message":"User already Exist"});
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({firstname,  lastname, doctype, email, password: hashedPassword});
            if(user){
                const OTP = otpGenerator();
                sendOTP(user.email, OTP);
                res.status(201).json({"OTP":OTP, "message":"Data Saved Successfully"});
            }
            else{
                res.status(403).json({"message":"Something Went Wrong"});
            }
        }
    }
        catch(err){
        res.status(500).json({"message": err});
    }
}

export const verifyUser = async (req:any, res:Response) =>{
    try{
        const {email} = req.body;
        const user = await User.findOne({where:{email}});
        if(user){
            user.is_verified = true;
            user.save();
            res.status(200).json({"message": "User Verfied Successfully"});
        }
        else{
            res.status(403).json({"message":"Something Went Wrong"})
        }
    }
    catch(err){
        res.status(500).json({"message":err})
    }
}

export  const loginUser = async (req:any, res:Response) =>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({where:{email}});
        if(user){
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch){
                if(user.is_verified){
                    const token = jwt.sign({uuid:user.uuid}, Security_Key);
                    res.status(200).json({"token":token, "user":user, "message":"Login Successfull"});
                }
                else{
                    const OTP = otpGenerator();
                    sendOTP(user.email, OTP);
                    res.status(200).json({"user":user, "OTP":OTP, "message": "OTP sent Successfully"});
                }
            }
            else{
                res.status(403).json({"message":"Invalid Password"});
            }
        }
        else{
            res.status(403).json({"message":"User doesn't Exist"});
        }
    }
    catch(err){
        res.status(500).json({"message":err});
    }
}

export const getUser = async (req:any, res:Response) => {
    try{
        await Notification.findAll();
        const {uuid} = req.user;
        const user = await User.findOne({where:{uuid:uuid}, include:Address});
        if(user){
            const referCount = await Patient.count({where:{[Op.or]:[{referedby:uuid}, {referedto:uuid}]}});
            const referCompleted = await Patient.count({where:{ referedto:uuid, referalstatus:1 }});
            let docCount;

            if(user.doctype == 1){
                docCount = await User.count({where:{ is_verified:1 }});
            }
            else{
                docCount = await User.count({where:{ is_verified:1, doctype:1 }});
            }
            res.status(200).json({"user":user, "message":"User Found", "docCount":docCount, "referCount":referCount, "referCompleted":referCompleted});
        }
        else{
            res.status(404).json({"message":"User Not Found"})
        }
    }
    catch(err){
        res.status(500).json({"message":`Error--->${err}`})
    }
}

export const getDocList = async(req:any, res:Response) => { 
    try{
        const {uuid} = req.user;
        const sortby =  req.query.sortBy
        const sortin = req.query.sortIn
        const user = await User.findOne({where:{uuid:uuid}});
        
        if(req.query.page){
            let docList;
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const search = req.query.find;
            const offset = limit*(page-1)
            
            if(user?.doctype==1){
                docList = await User.findAndCountAll({ 
                    where: {
                        [Op.and]:[
                            {
                                [Op.or]:[
                                    {firstname: {[Op.like]: `%${search}%`}},
                                    {lastname:{[Op.like]: `%${search}%`}}]
                                },
                                {
                                    uuid: {
                                        [Op.ne]:uuid
                                    }
                                }
                            ]
                        }, 
                    limit:limit, 
                    offset:offset,
                    include: Address
                });
            }
            else{
                docList = await User.findAndCountAll({ 
                    where: {
                        [Op.and]:[
                            {
                                [Op.or]:[
                                    {firstname: {[Op.like]: `%${search}%`}},
                                    {lastname:{[Op.like]: `%${search}%`}}]
                                },
                                {
                                    uuid: {
                                        [Op.ne]:uuid
                                    }
                                },
                                {
                                    doctype:1
                                }
                            ]
                        }, 
                    limit:limit, 
                    offset:offset,
                    include: Address,
                    order: [[sortby, sortin]]
                });
            }
            let docCount = docList.count
            const b = docList.rows.map((doc)=>{
                if(doc.Addresses.length != 0){
                    docCount = docCount-1;
                    return doc;
                }
            })
            if(docList){
                res.status(200).json({"docList":b, "totaldocs": docCount, "message":"Docs List Found"});
            }
            else{
                res.status(404).json({"message":"MD List Not Found"});
            }
        } else {
            let docs;
            if(user?.doctype==1){
                docs = await User.findAll({ where: { uuid: {[Op.ne]: uuid} }, include:Address });
            }
            else{
                docs = await User.findAll({ where: { doctype:1, uuid: {[Op.ne]: uuid} }, include:Address });
            }
            const docList = docs.filter((doc)=>{
                if(doc.Addresses.length!=0){
                    return doc
                }
            })
            
            if(docList){
                res.status(200).json({"docList":docList, "message":"Docs List Found"});
            }
            else{
                res.status(404).json({"message":"MD List Not Found"});
            }
        }
        }
        catch(err){
            res.status(500).json({"message":`${err}`});
        }   
    }

export const getPatientList = async(req:any, res:Response) => {
    try{
        const {uuid} = req.user;
        const sortby =  req.query.sortBy
        const sortin = req.query.sortIn
        const user = await User.findOne({where:{uuid:uuid}});
        var plist: any[] = [];

        if( req.query.page ){

            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const search = req.query.find;
            const offset = limit*(page-1)
            if(user){
                const patientList:any = await Patient.findAndCountAll({
                where:{
                    [Op.and]:[
                        {
                            [Op.or]:[
                                {firstname: {[Op.like]: `%${search}%`}},
                                {lastname:{[Op.like]: `%${search}%`}}]
                            },
                            {
                                [Op.or]:[
                                    {referedby:uuid},
                                    {referedto:uuid}
                                ]
                            }
                        ]
                    },
                    include:[
                        {
                            model:Appointment,
                            as: "patientId"
                        },
                        {
                            model:User,
                            as: "referbydoc"
                        },
                        {
                            model:User,
                            as: "refertodoc"
                        },
                        {
                            model: Appointment,
                            as: "patientId"
                        }
                    ],
                    limit:limit,
                    offset:offset,
                    order: [[sortby, sortin]]
                });

                if(patientList){
                    
                    for (const patient of patientList.rows) {
                        const [referedtoUser, referedbyUser, address] = await Promise.all([
                        User.findOne({ where: { uuid: patient.referedto } }),
                        User.findOne({ where: { uuid: patient.referedby } }),
                        Address.findOne({ where: { uuid: patient.address } }),
                    ]);

                        const newPatientList: any = {
                            uuid: patient.uuid,
                            firstname: patient.firstname,
                            lastname: patient.lastname,
                            disease: patient.disease,
                            referalstatus: patient.referalstatus,
                            referback: patient.referback,
                            createdAt: patient.createdAt,
                            updatedAt: patient.updatedAt,
                            referedto: referedtoUser,
                            referedby: referedbyUser,
                            address: address,
                        };
                        plist.push(newPatientList);
                    }
                    res.status(200).json({"patientList":plist, "totalpatients":patientList.count, "message":"Patient List Found"});
                }
                else{
                    res.status(404).json({"message":"Patient List Not Found"});
                }
            }
            else{
                res.status(404).json({"message":"User Not Found"});
            }
        } 
        else {
            const plist = await Patient.findAll({ where: {
                [Op.or]: 
                [
                    {referedby:uuid},
                    {referedto:uuid},
                ]
            },
            include:[
                {
                    model:Appointment,
                    as: "patientId"
                },
                {
                    model:User,
                    as: "referbydoc"
                },
                {
                    model:User,
                    as: "refertodoc"
                },
                {
                    model: Appointment,
                    as: "patientId"
                }
        ]
    });

        let patientList = plist.filter((item)=>{
            if(!item.patientId){
                return item
            }
        })
        res.status(200).json({"patientList":patientList, "pList":plist, "message": "Patient List Found"});
        }
    }
    catch(err){
        res.status(500).json({"message":`${err}`});
    }
}

export const addPatient = async(req:any, res:Response) => {
    try{
        const {uuid} = req.user;
        const user = await User.findOne({where:{uuid:uuid}});
        if(user){
            await user.update({totalrefered: user.totalrefered + 1});
            const {firstname, lastname, disease, address, referedto, referback, email } = req.body;
            const Md = await User.findByPk(referedto);
            await Md?.update({totalreferalreceive: Md.totalreferalreceive + 1});

            const patient = await Patient.create({ firstname, lastname, email, disease, address, referedto, referback, referedby:uuid });
            if(patient){
                res.status(200).json({"message": "Patient added Successfully", 'patient': patient});
            }
        }
        else{
            res.status(401).json({"message":"you're not Authorised"});
        }
    }
    catch(err){
        res.status(500).json({"message":`${err}`});
    }
}

export const addAddress = async(req:any, res:Response) => {
    try{
        const {uuid} = req.user;
        const user = await User.findOne({where:{uuid:uuid}});
        if(user){
            const {street, district, city, state, pincode, phone} = req.body;
            const address = await Address.create({street, district, city, state, pincode, phone, user:uuid});
            if(address){
                res.status(200).json({"message": "Address added Successfully"});
            }
            else{
                res.status(400).json({"message":"Error in Saving Address"});
            }
        }
        else{
            res.status(401).json({"message":"you're not Authorised"});
        }
    }
    catch(err){
        res.status(500).json({"message":`${err}`});
    }
}

export const updatePassword = async(req:any, res:Response) => {
    try{
        const {uuid} = req.user;
        const user = await User.findOne({where:{uuid:uuid}});
        if(user){
            const {prevPassword, newPassword} = req.body;
            const isMatch = await bcrypt.compare(prevPassword, user.password);
            if(isMatch){
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                const updatedPassword = await user.update({password:hashedPassword});
                if(updatedPassword){
                    res.status(200).json({"message":"Password Updated Successfully"});
                }
                else{
                    res.status(400).json({"message":"Password not Updated"});
                }
            }
            else{
                res.status(400).json({"message":"Current Password is Wrong"});   
            }
        }
        else{
            res.status(401).json({"message":"You're not authorized"});
        }
    }
    catch(err){
        res.status(500).json({"message":err});
    }
}

export const updateProfile = async(req:any, res:Response) => {
    try{
        const {uuid} = req.user;
        const user = await User.findOne({where:{uuid:uuid}});
        if(user){
            const updatedUser = await user.update({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                phone:req.body.phone,
                dob: req.body.dob
            });
            if(updatedUser){
                res.status(200).json({"message":"User Updated Successfully"});
            }
            else{
                res.status(400).json({"message":"User not Updated"});
            }
        }
        else{
            res.status(401).json({"message":"You're not authorized"});
        }
    }
    catch(err){
        res.status(500).json({"message":err});
    }
}

export const getPatient = async(req:any, res:Response) => {
    try{
        const { patientId } = req.params;
        const { uuid } = req.user;
        const user = await User.findByPk(uuid);
        if(user){

            const patient = await Patient.findByPk(patientId);
            const refertoUser = await User.findByPk(patient?.referedto);
            const referbyUser = await User.findByPk(patient?.referedby);
            const address = await Address.findByPk(patient?.address);

            if(patient){
                res.status(200).json({"patient":patient, "message":"Patient Found Successfully", "referto":refertoUser, "referby":referbyUser, "address":address });
            }
            else{
                res.status(404).json({"message":"Patient not Found"});
            }
        }
        else{
            res.status(400).json({"message":"You're not authorized "})
        }   
    }
    catch(err){
        res.status(500).json({"message":`${err}`});
    }
}

export const updatePatient = async(req:any, res:Response) => {
    try{
        const { patientId } = req.params;
        const { uuid } = req.user;
        const user = await User.findByPk(uuid);
        if(user){
            const patient = await Patient.findByPk(patientId);
            if(patient){
                
                const updatedPatient = await patient.update(req.body);
                if(updatedPatient){
                    res.status(200).json({"message": "Patient Updated Successfully"});
                }
                else{
                    res.status(400).json({"message": "Patient not Updated"});
                }
            }
            else{
                res.status(404).json({"message": "Patient not Found"});
            }
        }
        else{
            res.status(400).json({"message": "You're not authorized "});
        }
    }
    catch(err){
        res.status(500).json({"message": err});
    }
}

export const deletePatient = async(req:any, res:Response) => {
    try{
        const { patientId } = req.params;
        const { uuid } = req.user;
        const user = await User.findByPk(uuid);
        if(user){
            const patient = await Patient.findByPk(patientId);
            if(patient){
                await patient.destroy();
                res.status(200).json({"message": "Patient deleted Successfully"})
            }
            else{
                res.status(404).json({"message": "Patient not Found"});
            }
        }
        else{
            res.status(400).json({"message": "You're not authorized "});
        }
    }
    catch(err){
        res.status(500).json({"message":err});
    }
}

export const updateAddress = async (req:any, res:Response) => {
    try{
        const { addressId } = req.params;
        const { uuid } = req.user;
        const user = await User.findByPk(uuid);
        if(user){
            const address = await Address.findByPk(addressId);
            if(address){
                const updatedAddress = await address.update(req.body);
                if(updatedAddress){
                    res.status(200).json({"message": "Address Updated Successfully"});
                } else {
                    res.status(400).json({"message": "Failed to update address"});
                }
            } else {
                res.status(404).json({"message": "Address not Found"});
            }
        } else {
            res.status(400).json({"message": "You're not authorized"});
        }
    }
    catch(err){
        res.status(500).json({"message": err});
    }
}

export const deleteAddress = async(req:any, res:Response) => {
    try{
        const {addressId} = req.params;
        const {uuid} = req.user;
        const user = await User.findByPk(uuid);
        if(user){
            const address = await Address.findByPk(addressId);
            if(address){
                await address?.destroy();
                res.status(200).json({"message": "Address deleted Successfully"})
            } else {
                res.status(404).json({"message": "Address not Found"});
            }
        } else {
            res.status(400).json({"message": "you're not authorised"});
        }
    }
    catch(err){
        res.status(500).json({"message":err});
    }
}

export const getAppointment = async(req:any, res:Response) => {
    try{
        const {appointmentId} = req.params;
        const appointment = await Appointment.findByPk(appointmentId,{include:[
            {
                model:Patient,
                as:"patientId",
            }
        ]});
        if(appointment){
            res.status(200).json({ 'appointment':appointment, "message":"Appointment Found" });
        } else {
            res.status(404).json({"message": "Appointment not Found"});
        }
    }
    catch(err){
        res.status(500).json({"message":err});
    }
}

export const getAppointmentList = async(req:any, res:Response) => {
    try{
        const {uuid} = req.user;
        const user = await User.findByPk(uuid);
        const appointments = await Appointment.findAll({where:{ doctor: uuid }, include:[
            {model: Patient, as: 'patientId'},
            {model: User, as: 'appointedby'},
        ]});
        if(appointments){
            res.status(200).json({"appointments":appointments, "message": "Appointment List"});
        } else {
            res.status(404).json({"message": "No Appointments Found"});
        }

    }
    catch(err){
        res.status(500).json({"message":err});
    }
}

export const addAppointment = async(req:any, res:Response) => {
    try{
        const {uuid} = req.user;
        const user = await User.findByPk(uuid);
        if(user){
            const { type, appointmentdate, patient } = req.body;
            const mypatient = await Patient.findByPk(patient);
            await mypatient?.update({isseen:1});
            const appointment = await Appointment.create({
                type:type,
                date: appointmentdate,
                patient: patient,
                doctor: uuid
            });
            if(appointment){
                res.status(200).json({"message": "Appointment made Successfully"});
            } else {
                res.status(400).json({"message": "Appointment not set"});
            }
        } else{
            res.status(401).json({"message":"you're not Authorised"});
        }
    }
    catch(err){
        res.status(500).json({"message": err});
    }
}

export const updateAppointment = async(req:any, res:Response) => {
    try{
        const {appointmentId} = req.params;
        const {uuid} = req.user;
        const user = await User.findByPk(uuid);
        if(user){
            const appointment = await Appointment.findByPk(appointmentId);
            if(appointment){
                
                const updatedAppointment = await appointment.update(req.body);
                if(updatedAppointment.status==3){
                    const patient = await Patient.findByPk(appointment.patient);
                    const OD = await User.findByPk(patient?.referedby);
                    await patient?.update({referalstatus:true});
                    await OD?.update({totalreferalcompleted: OD.totalreferalcompleted+1});
                    await user.update({ totalreferalcompleted: user.totalreferalcompleted+1 });
                }
                if(updatedAppointment){
                    res.status(200).json({"message": "Appointment Updated Successfully"});
                }
                else{
                    res.status(400).json({"message": "Appointment not Updated"});
                }
            }
            else{
                res.status(404).json({"message": "Appointment not Found"});
            }
        }
        else{
            res.status(400).json({"message": "You're not authorized "});
        }

    }
    catch(err){
        res.status(500).json({"message": err});
    }
}

// export const deleteAppointment = async(req:any, res:Response) => {
//     try{
//         const { appointmentId } = req.params;
//         const { uuid } = req.user;
//         const user = await User.findByPk(uuid);
//         if(user){
//             const appointment = await Appointment.findByPk(appointmentId);
//             if(appointment){
//                 await appointment.destroy();
//                 res.status(200).json({"message": "Appointment deleted Successfully"})
//             }
//             else{
//                 res.status(404).json({"message": "Appointment not Found"});
//             }
//         }
//         else{
//             res.status(400).json({"message": "You're not authorized "});
//         }
//     }
//     catch(err){
//         res.status(500).json({"message": err});
//     }
// }

export const forgetPasswordOTP = async(req:any, res:Response) => {
    try{
        const { email } = req.body;
        const user = await User.findOne({where: {email: email}});
        if(user){
            const OTP = otpGenerator();
            sendOTP(email, OTP);
            res.status(201).json({"OTP":OTP, "message":"OTP sent"});
        }
        else{
            res.status(404).json({"message": "User doesn't Exist"});
        }
    }
    catch(err){
        res.status(500).json({"message": err});
    }
}

export const updateforgetedPassword = async(req:any, res:Response) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({where:{email:email}});
        if(user){
            const hashedPassword = await bcrypt.hash(password, 10);
            await user.update({password: hashedPassword});
            res.status(200).json({"message": "Password Updated"});
        }
    }
    catch(err){
        res.status(500).json({"message": err});
    }
}

export const getRooms = async(req:any, res:Response) => {
    try{
        const {uuid} = req.user;
        const search = req.query.search
        const user = await User.findByPk(uuid);
        if(user){
        //     const rooms = await Room.findAll({where:{
        //         [Op.or]:[
        //             {user_id_1: user.uuid},
        //             {user_id_2: user.uuid}]
        //     },
        //     include: [
        //         {
        //             model: User,
        //             as: 'doc1'
        //         },
        //         {
        //             model: User,
        //             as: 'doc2'
        //         },
        //         {
        //             model: Patient,
        //             as: 'patient'
        //         }
        //     ]
        // });
        
        const rooms = await Room.findAll({where:
            {
                [Op.and]:[
                    {name: { [Op.like]: `%${search}%`}},
                    {[Op.or]:[
                        {user_id_1: user.uuid},
                        {user_id_2: user.uuid}
                    ]}
                ]
            },
            include: [
                {
                    model: User,
                    as: 'doc1'
                },
                {
                    model: User,
                    as: 'doc2'
                },
                {
                    model: Patient,
                    as: 'patient'
                }
            ]
        });

        res.status(200).json({"room":rooms, "user":user});
        } else {
            res.status(404).json({"message": "You're not authorized"});
        }
    }
    catch(err){
        res.status(500).json({"message": err});
    }
}

export const getStaffList = async(req:any, res:Response) => {
    try{
        const {uuid} = req.user;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const search = req.query.find;
        const sortby =  req.query.sortBy
        const sortin = req.query.sortIn
        const offset = limit*(page-1)
        
        const user = await User.findByPk(uuid);
        if(user){
            const staffs = await Staff.findAll({
                where: {
                  [Op.and]: [
                    { user_id: uuid },
                    {
                      [Op.or]: [
                        { firstname: { [Op.like]: `%${search}%` } },
                        { lastname: { [Op.like]: `%${search}%` } },
                      ],
                    },
                  ],
                },
                limit,
                offset,
                order: [[sortby, sortin]]
              });

            const totalStaff = await Staff.count({where:{user_id:uuid}});

            res.status(200).json({"staff":staffs, "totalStaff": totalStaff });
        } else {
            res.status(404).json({"message": "You're not authorized"});
        }
    }
    catch(err){
        res.status(500).json({"message": err});
    }
}

export const addStaff = async(req:any, res:Response) => {
    try{
        const {uuid} = req.user;
        const { firstname, lastname, email, phone, gender } = req.body;

        const user = await User.findByPk(uuid);
        if(user){
            const staff = await Staff.create({firstname, lastname, email, phone, gender, user_id: user.uuid});
            if(staff){
                res.status(201).json({"message": "Staff Added Successfully"});
            } else {
                res.status(500).json({"message": "Failed to add staff"});
            }
        } else {
            res.status(404).json({"message": "You're not authorized"});
        }
    }
    catch(err){
        res.status(500).json({"message": "something went wrong"});
    }
}

export const deleteStaff = async(req:any, res:Response) => {
    try{
        const { staff_uuid } = req.params;
        const staff = await Staff.findByPk(staff_uuid);
        if(staff){
            await staff.destroy()
            res.status(200).json({"message": "Staff deleted successfully"});
        }
    }
    catch(err){
        res.status(500).json({"message": "something went wrong"});
    }
}

export const getNotifications = async(req:any, res:Response) => {
    try{
        const {uuid} = req.user;
        const notifications = await Notification.findAll({where:{notifyto: uuid}, order:[['createdAt', 'DESC']]});
        if(notifications){
            res.status(200).json({"notifications":notifications, "message": "Notifications Found"});
        } else {
            res.status(404).json({"message": "Notifications Not Found"});
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({"message": `Something went wrong ${err}` });
    }
}

export const updateNotificationStatus = async(req:any, res:Response) => {
    try{
        const {uuid} = req.user;
        const notifications = await Notification.findAll({where:{notifyto: uuid}});
        
        if(notifications){
            for(let i = 0; i < notifications.length; i++){
                const notification = notifications[i];
                await notification.update({is_seen:1});
            }

            io.to(`room-${uuid}`).emit('getUnreadCount', 0);
        }
    }
    catch(err){
        console.log(err);
    }
}

export const downloadPatientData = async(req:any, res:any) => {
    try{
        const {patientId} = req.params;

        const patientData:any = await Patient.findOne({ where: { uuid: patientId }, include:[
            {
                model: User,
                as:'referbydoc'
            }
        ] });

        if (!patientData) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // const patientData = patient.toJSON();
        const doc = new PDFDocument();
        res.header('Content-Type', 'application/pdf');
        res.attachment('patient_data.pdf');
        doc.pipe(res);

        doc.font('Helvetica-Bold').fontSize(16).text('Patient Information', { align: 'center' });
        doc.moveDown();
        
        doc.font('Helvetica-Bold').fontSize(14).text('Basic Information', { align: 'left' });
        doc.font('Helvetica').fontSize(11)
        doc.text(`Name: ${patientData.firstname} ${patientData.lastname}`);
        doc.text(`Phone: 1122334455`);
        doc.text(`Email: ${patientData.email}`);
        doc.text(`Gender: Male`, { paragraphGap: 20 });

        doc.font('Helvetica-Bold').fontSize(14).text('Reason of Consult', { align: 'left' });
        doc.font('Helvetica').fontSize(11)
        doc.text(`Reason: ${patientData.disease || 'Not provided'}`);
        doc.text(`Laterality: Not provided`);
        doc.text(`Timing: Not provided`, { paragraphGap: 20 });

        doc.font('Helvetica-Bold').fontSize(14).text('Referral MD', { align: 'left' });
        doc.font('Helvetica').fontSize(11)
        doc.text(`Referral MD: Hello`);
        doc.text(`Location: Not provided`);
        doc.text(`Notes: Not provided`, { paragraphGap: 20 });

        doc.font('Helvetica-Bold').fontSize(14).text('Appointment Details', { align: 'left' });
        doc.font('Helvetica').fontSize(11)
        doc.text(`Appointment date/time: Heeelllooo`);
        doc.text(`Surgical: Not provided`, { paragraphGap: 20 });

        doc.font('Helvetica-Bold').fontSize(14).text('Notes', { align: 'left' });
        doc.font('Helvetica').fontSize(11)
        doc.text(`Notes: Not provided`, { paragraphGap: 20 });

        doc.end();
    }
    catch(err){
        console.log(err);
    }
}