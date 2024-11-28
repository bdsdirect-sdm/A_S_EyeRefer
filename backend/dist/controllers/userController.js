"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStaff = exports.getStaffs = exports.getRooms = exports.updateforgetedPassword = exports.forgetPasswordOTP = exports.updateAppointment = exports.addAppointment = exports.getAppointmentList = exports.getAppointment = exports.deleteAddress = exports.updateAddress = exports.deletePatient = exports.updatePatient = exports.getPatient = exports.updateProfile = exports.updatePassword = exports.addAddress = exports.addPatient = exports.getPatientList = exports.getDocList = exports.getUser = exports.loginUser = exports.verifyUser = exports.registerUser = void 0;
const env_1 = require("../environment/env");
const Address_1 = __importDefault(require("../models/Address"));
const Patient_1 = __importDefault(require("../models/Patient"));
const Appointment_1 = __importDefault(require("../models/Appointment"));
const Room_1 = __importDefault(require("../models/Room"));
const mailer_1 = __importDefault(require("../utils/mailer"));
const Staff_1 = __importDefault(require("../models/Staff"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Security_Key = env_1.Local.SECRET_KEY;
// const checkPassword = async() => {
// }
// const getLoginedUser = async(req:any) => {
// }
const otpGenerator = () => {
    return String(Math.round(Math.random() * 10000000000)).slice(0, 6);
};
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstname, lastname, doctype, email, password } = req.body;
        const isExist = yield User_1.default.findOne({ where: { email: email } });
        if (isExist) {
            res.status(401).json({ "message": "User already Exist" });
        }
        else {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = yield User_1.default.create({ firstname, lastname, doctype, email, password: hashedPassword });
            if (user) {
                const OTP = otpGenerator();
                (0, mailer_1.default)(user.email, OTP);
                res.status(201).json({ "OTP": OTP, "message": "Data Saved Successfully" });
            }
            else {
                res.status(403).json({ "message": "Something Went Wrong" });
            }
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.registerUser = registerUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({ where: { email } });
        if (user) {
            user.is_verified = true;
            user.save();
            res.status(200).json({ "message": "User Verfied Successfully" });
        }
        else {
            res.status(403).json({ "message": "Something Went Wrong" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.verifyUser = verifyUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ where: { email } });
        if (user) {
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (isMatch) {
                if (user.is_verified) {
                    const token = jsonwebtoken_1.default.sign({ uuid: user.uuid }, Security_Key);
                    res.status(200).json({ "token": token, "user": user, "message": "Login Successfull" });
                }
                else {
                    const OTP = otpGenerator();
                    (0, mailer_1.default)(user.email, OTP);
                    res.status(200).json({ "user": user, "OTP": OTP, "message": "OTP sent Successfully" });
                }
            }
            else {
                res.status(403).json({ "message": "Invalid Password" });
            }
        }
        else {
            res.status(403).json({ "message": "User doesn't Exist" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.loginUser = loginUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.user;
        const user = yield User_1.default.findOne({ where: { uuid: uuid }, include: Address_1.default });
        if (user) {
            const referCount = yield Patient_1.default.count({ where: { [sequelize_1.Op.or]: [{ referedby: uuid }, { referedto: uuid }] } });
            const referCompleted = yield Patient_1.default.count({ where: { referedto: uuid, referalstatus: 1 } });
            let docCount;
            if (user.doctype == 1) {
                docCount = yield User_1.default.count({ where: { is_verified: 1 } });
            }
            else {
                docCount = yield User_1.default.count({ where: { is_verified: 1, doctype: 1 } });
            }
            res.status(200).json({ "user": user, "message": "User Found", "docCount": docCount, "referCount": referCount, "referCompleted": referCompleted });
        }
        else {
            res.status(404).json({ "message": "User Not Found" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `Error--->${err}` });
    }
});
exports.getUser = getUser;
const getDocList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.user;
        const user = yield User_1.default.findOne({ where: { uuid: uuid } });
        if (req.query.page) {
            let docList;
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const search = req.query.find;
            const offset = limit * (page - 1);
            if ((user === null || user === void 0 ? void 0 : user.doctype) == 1) {
                docList = yield User_1.default.findAndCountAll({
                    where: {
                        [sequelize_1.Op.and]: [
                            {
                                [sequelize_1.Op.or]: [
                                    { firstname: { [sequelize_1.Op.like]: `%${search}%` } },
                                    { lastname: { [sequelize_1.Op.like]: `%${search}%` } }
                                ]
                            },
                            {
                                uuid: {
                                    [sequelize_1.Op.ne]: uuid
                                }
                            }
                        ]
                    },
                    limit: limit,
                    offset: offset,
                    include: Address_1.default
                });
            }
            else {
                docList = yield User_1.default.findAndCountAll({
                    where: {
                        [sequelize_1.Op.and]: [
                            {
                                [sequelize_1.Op.or]: [
                                    { firstname: { [sequelize_1.Op.like]: `%${search}%` } },
                                    { lastname: { [sequelize_1.Op.like]: `%${search}%` } }
                                ]
                            },
                            {
                                uuid: {
                                    [sequelize_1.Op.ne]: uuid
                                }
                            },
                            {
                                doctype: 1
                            }
                        ]
                    },
                    limit: limit,
                    offset: offset,
                    include: Address_1.default
                });
            }
            // console.log("Listing", docList.rows);
            const b = docList.rows.map((doc) => {
                if (doc.Addresses.length != 0) {
                    return doc;
                }
                return false;
            });
            console.log("Listing", b);
            if (docList) {
                res.status(200).json({ "docList": b, "totaldocs": docList.count, "message": "Docs List Found" });
            }
            else {
                res.status(404).json({ "message": "MD List Not Found" });
            }
        }
        else {
            let docs;
            if ((user === null || user === void 0 ? void 0 : user.doctype) == 1) {
                docs = yield User_1.default.findAll({ where: { uuid: { [sequelize_1.Op.ne]: uuid } }, include: Address_1.default });
            }
            else {
                docs = yield User_1.default.findAll({ where: { doctype: 1, uuid: { [sequelize_1.Op.ne]: uuid } }, include: Address_1.default });
            }
            const docList = docs.filter((doc) => {
                if (doc.Addresses.length != 0) {
                    return doc;
                }
            });
            // console.log("Listing", docList);
            if (docList) {
                res.status(200).json({ "docList": docList, "message": "Docs List Found" });
            }
            else {
                res.status(404).json({ "message": "MD List Not Found" });
            }
        }
    }
    catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
});
exports.getDocList = getDocList;
const getPatientList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.user;
        const user = yield User_1.default.findOne({ where: { uuid: uuid } });
        var plist = [];
        if (req.query.page) {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const search = req.query.find;
            const offset = limit * (page - 1);
            if (user) {
                const patientList = yield Patient_1.default.findAndCountAll({
                    where: {
                        [sequelize_1.Op.and]: [
                            {
                                [sequelize_1.Op.or]: [
                                    { firstname: { [sequelize_1.Op.like]: `%${search}%` } },
                                    { lastname: { [sequelize_1.Op.like]: `%${search}%` } }
                                ]
                            },
                            {
                                [sequelize_1.Op.or]: [
                                    { referedby: uuid },
                                    { referedto: uuid }
                                ]
                            }
                        ]
                    },
                    include: [
                        {
                            model: Appointment_1.default,
                            as: "patientId"
                        },
                        {
                            model: User_1.default,
                            as: "referbydoc"
                        },
                        {
                            model: User_1.default,
                            as: "refertodoc"
                        },
                        {
                            model: Appointment_1.default,
                            as: "patientId"
                        }
                    ],
                    limit: limit,
                    offset: offset
                });
                if (patientList) {
                    for (const patient of patientList.rows) {
                        const [referedtoUser, referedbyUser, address] = yield Promise.all([
                            User_1.default.findOne({ where: { uuid: patient.referedto } }),
                            User_1.default.findOne({ where: { uuid: patient.referedby } }),
                            Address_1.default.findOne({ where: { uuid: patient.address } }),
                        ]);
                        const newPatientList = {
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
                    res.status(200).json({ "patientList": plist, "totalpatients": patientList.count, "message": "Patient List Found" });
                }
                else {
                    res.status(404).json({ "message": "Patient List Not Found" });
                }
            }
            else {
                res.status(404).json({ "message": "User Not Found" });
            }
        }
        else {
            const plist = yield Patient_1.default.findAll({ where: {
                    [sequelize_1.Op.or]: [
                        { referedby: uuid },
                        { referedto: uuid },
                    ]
                },
                include: [
                    {
                        model: Appointment_1.default,
                        as: "patientId"
                    },
                    {
                        model: User_1.default,
                        as: "referbydoc"
                    },
                    {
                        model: User_1.default,
                        as: "refertodoc"
                    },
                    {
                        model: Appointment_1.default,
                        as: "patientId"
                    }
                ]
            });
            let patientList = plist.filter((item) => {
                if (!item.patientId) {
                    return item;
                }
            });
            res.status(200).json({ "patientList": patientList, "pList": plist, "message": "Patient List Found" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
});
exports.getPatientList = getPatientList;
const addPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.user;
        const user = yield User_1.default.findOne({ where: { uuid: uuid } });
        if (user) {
            yield user.update({ totalrefered: user.totalrefered + 1 });
            const { firstname, lastname, disease, address, referedto, referback } = req.body;
            const Md = yield User_1.default.findByPk(referedto);
            yield (Md === null || Md === void 0 ? void 0 : Md.update({ totalreferalreceive: Md.totalreferalreceive + 1 }));
            const patient = yield Patient_1.default.create({ firstname, lastname, disease, address, referedto, referback, referedby: uuid });
            if (patient) {
                res.status(200).json({ "message": "Patient added Successfully" });
            }
        }
        else {
            res.status(401).json({ "message": "you're not Authorised" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
});
exports.addPatient = addPatient;
const addAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.user;
        const user = yield User_1.default.findOne({ where: { uuid: uuid } });
        if (user) {
            const { street, district, city, state, pincode, phone } = req.body;
            const address = yield Address_1.default.create({ street, district, city, state, pincode, phone, user: uuid });
            if (address) {
                res.status(200).json({ "message": "Address added Successfully" });
            }
            else {
                res.status(400).json({ "message": "Error in Saving Address" });
            }
        }
        else {
            res.status(401).json({ "message": "you're not Authorised" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
});
exports.addAddress = addAddress;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.user;
        const user = yield User_1.default.findOne({ where: { uuid: uuid } });
        if (user) {
            const { prevPassword, newPassword } = req.body;
            const isMatch = yield bcrypt_1.default.compare(prevPassword, user.password);
            if (isMatch) {
                const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
                const updatedPassword = yield user.update({ password: hashedPassword });
                if (updatedPassword) {
                    res.status(200).json({ "message": "Password Updated Successfully" });
                }
                else {
                    res.status(400).json({ "message": "Password not Updated" });
                }
            }
            else {
                res.status(400).json({ "message": "Current Password is Wrong" });
            }
        }
        else {
            res.status(401).json({ "message": "You're not authorized" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.updatePassword = updatePassword;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.user;
        const user = yield User_1.default.findOne({ where: { uuid: uuid } });
        if (user) {
            const updatedUser = yield user.update({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phone: req.body.phone,
                dob: req.body.dob
            });
            if (updatedUser) {
                res.status(200).json({ "message": "User Updated Successfully" });
            }
            else {
                res.status(400).json({ "message": "User not Updated" });
            }
        }
        else {
            res.status(401).json({ "message": "You're not authorized" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.updateProfile = updateProfile;
const getPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { patientId } = req.params;
        const { uuid } = req.user;
        const user = yield User_1.default.findByPk(uuid);
        if (user) {
            const patient = yield Patient_1.default.findByPk(patientId);
            const refertoUser = yield User_1.default.findByPk(patient === null || patient === void 0 ? void 0 : patient.referedto);
            const referbyUser = yield User_1.default.findByPk(patient === null || patient === void 0 ? void 0 : patient.referedby);
            const address = yield Address_1.default.findByPk(patient === null || patient === void 0 ? void 0 : patient.address);
            if (patient) {
                res.status(200).json({ "patient": patient, "message": "Patient Found Successfully", "referto": refertoUser, "referby": referbyUser, "address": address });
            }
            else {
                res.status(404).json({ "message": "Patient not Found" });
            }
        }
        else {
            res.status(400).json({ "message": "You're not authorized " });
        }
    }
    catch (err) {
        res.status(500).json({ "message": `${err}` });
    }
});
exports.getPatient = getPatient;
const updatePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { patientId } = req.params;
        const { uuid } = req.user;
        const user = yield User_1.default.findByPk(uuid);
        if (user) {
            const patient = yield Patient_1.default.findByPk(patientId);
            if (patient) {
                const updatedPatient = yield patient.update(req.body);
                if (updatedPatient) {
                    res.status(200).json({ "message": "Patient Updated Successfully" });
                }
                else {
                    res.status(400).json({ "message": "Patient not Updated" });
                }
            }
            else {
                res.status(404).json({ "message": "Patient not Found" });
            }
        }
        else {
            res.status(400).json({ "message": "You're not authorized " });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.updatePatient = updatePatient;
const deletePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { patientId } = req.params;
        const { uuid } = req.user;
        const user = yield User_1.default.findByPk(uuid);
        if (user) {
            const patient = yield Patient_1.default.findByPk(patientId);
            if (patient) {
                yield patient.destroy();
                res.status(200).json({ "message": "Patient deleted Successfully" });
            }
            else {
                res.status(404).json({ "message": "Patient not Found" });
            }
        }
        else {
            res.status(400).json({ "message": "You're not authorized " });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.deletePatient = deletePatient;
const updateAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { addressId } = req.params;
        const { uuid } = req.user;
        const user = yield User_1.default.findByPk(uuid);
        if (user) {
            const address = yield Address_1.default.findByPk(addressId);
            if (address) {
                const updatedAddress = yield address.update(req.body);
                if (updatedAddress) {
                    res.status(200).json({ "message": "Address Updated Successfully" });
                }
                else {
                    res.status(400).json({ "message": "Failed to update address" });
                }
            }
            else {
                res.status(404).json({ "message": "Address not Found" });
            }
        }
        else {
            res.status(400).json({ "message": "You're not authorized" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.updateAddress = updateAddress;
const deleteAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { addressId } = req.params;
        const { uuid } = req.user;
        const user = yield User_1.default.findByPk(uuid);
        if (user) {
            const address = yield Address_1.default.findByPk(addressId);
            if (address) {
                yield (address === null || address === void 0 ? void 0 : address.destroy());
            }
            else {
                res.status(200).json({ "message": "Address deleted Successfully" });
            }
        }
        else {
            res.status(400).json({ "message": "you're not authorised" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.deleteAddress = deleteAddress;
const getAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { appointmentId } = req.params;
        const appointment = yield Appointment_1.default.findByPk(appointmentId, { include: [
                {
                    model: Patient_1.default,
                    as: "patientId",
                }
            ] });
        if (appointment) {
            res.status(200).json({ 'appointment': appointment, "message": "Appointment Found" });
        }
        else {
            res.status(404).json({ "message": "Appointment not Found" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.getAppointment = getAppointment;
const getAppointmentList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.user;
        const user = yield User_1.default.findByPk(uuid);
        const appointments = yield Appointment_1.default.findAll({ where: { doctor: uuid }, include: [
                { model: Patient_1.default, as: 'patientId' },
                { model: User_1.default, as: 'appointedby' },
            ] });
        if (appointments) {
            res.status(200).json({ "appointments": appointments, "message": "Appointment List" });
        }
        else {
            res.status(404).json({ "message": "No Appointments Found" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.getAppointmentList = getAppointmentList;
const addAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.user;
        const user = yield User_1.default.findByPk(uuid);
        if (user) {
            const { type, appointmentdate, patient } = req.body;
            const mypatient = yield Patient_1.default.findByPk(patient);
            yield (mypatient === null || mypatient === void 0 ? void 0 : mypatient.update({ isseen: 1 }));
            const appointment = yield Appointment_1.default.create({
                type: type,
                date: appointmentdate,
                patient: patient,
                doctor: uuid
            });
            if (appointment) {
                res.status(200).json({ "message": "Appointment made Successfully" });
            }
            else {
                res.status(400).json({ "message": "Appointment not set" });
            }
        }
        else {
            res.status(401).json({ "message": "you're not Authorised" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.addAppointment = addAppointment;
const updateAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { appointmentId } = req.params;
        const { uuid } = req.user;
        const user = yield User_1.default.findByPk(uuid);
        if (user) {
            const appointment = yield Appointment_1.default.findByPk(appointmentId);
            if (appointment) {
                const updatedAppointment = yield appointment.update(req.body);
                if (updatedAppointment.status == 3) {
                    const patient = yield Patient_1.default.findByPk(appointment.patient);
                    const OD = yield User_1.default.findByPk(patient === null || patient === void 0 ? void 0 : patient.referedby);
                    yield (patient === null || patient === void 0 ? void 0 : patient.update({ referalstatus: true }));
                    yield (OD === null || OD === void 0 ? void 0 : OD.update({ totalreferalcompleted: OD.totalreferalcompleted + 1 }));
                    yield user.update({ totalreferalcompleted: user.totalreferalcompleted + 1 });
                }
                if (updatedAppointment) {
                    res.status(200).json({ "message": "Appointment Updated Successfully" });
                }
                else {
                    res.status(400).json({ "message": "Appointment not Updated" });
                }
            }
            else {
                res.status(404).json({ "message": "Appointment not Found" });
            }
        }
        else {
            res.status(400).json({ "message": "You're not authorized " });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.updateAppointment = updateAppointment;
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
const forgetPasswordOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({ where: { email: email } });
        if (user) {
            const OTP = otpGenerator();
            (0, mailer_1.default)(email, OTP);
            res.status(201).json({ "OTP": OTP, "message": "OTP sent" });
        }
        else {
            res.status(404).json({ "message": "User doesn't Exist" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.forgetPasswordOTP = forgetPasswordOTP;
const updateforgetedPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log("\n\n data", req.body, "\n\n");
        const user = yield User_1.default.findOne({ where: { email: email } });
        if (user) {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            yield user.update({ password: hashedPassword });
            res.status(200).json({ "message": "Password Updated" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.updateforgetedPassword = updateforgetedPassword;
const getRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.user;
        const user = yield User_1.default.findByPk(uuid);
        if (user) {
            const rooms = yield Room_1.default.findAll({ where: {
                    [sequelize_1.Op.or]: [
                        { user_id_1: user.uuid },
                        { user_id_2: user.uuid }
                    ]
                },
                include: [
                    {
                        model: User_1.default,
                        as: 'doc1'
                    },
                    {
                        model: User_1.default,
                        as: 'doc2'
                    },
                    {
                        model: Patient_1.default,
                        as: 'patient'
                    }
                ]
            });
            res.status(200).json({ "room": rooms, "user": user });
        }
        else {
            res.status(404).json({ "message": "You're not authorized" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.getRooms = getRooms;
const getStaffs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.user;
        const user = yield User_1.default.findByPk(uuid);
        if (user) {
            const staffs = yield User_1.default.findAll({ where: { user_id: user.uuid } });
        }
        else {
            res.status(404).json({ "message": "You're not authorized" });
        }
    }
    catch (err) {
        res.status(500).json({ "message": err });
    }
});
exports.getStaffs = getStaffs;
const addStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uuid } = req.user;
        const { firstname, lastname, email, phone, gender } = req.body;
        const user = yield User_1.default.findByPk(uuid);
        if (user) {
            const staff = yield Staff_1.default.create({ firstname, lastname, email, phone, gender, user_id: user.uuid });
            if (staff) {
                res.status(201).json({ "staff": staff, "message": "Staff Added" });
            }
            else {
                res.status(500).json({ "message": "Failed to add staff" });
            }
        }
        else {
            res.status(404).json({ "message": "You're not authorized" });
        }
    }
    catch (err) {
    }
});
exports.addStaff = addStaff;
