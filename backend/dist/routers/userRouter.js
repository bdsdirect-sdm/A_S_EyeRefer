"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const userAuth_1 = __importDefault(require("../middlewares/userAuth"));
const signupValidation_1 = __importDefault(require("../middlewares/formValidation.ts/signupValidation"));
const loginValidation_1 = __importDefault(require("../middlewares/formValidation.ts/loginValidation"));
const router = (0, express_1.Router)();
// User API's
router.post("/register", signupValidation_1.default, userController_1.registerUser);
router.post("/login", loginValidation_1.default, userController_1.loginUser);
router.put("/verify", userController_1.verifyUser);
router.get('/user', userAuth_1.default, userController_1.getUser);
router.put("/update-password", userAuth_1.default, userController_1.updatePassword);
router.put("/update-profile", userAuth_1.default, userController_1.updateProfile);
router.get('/doc-list', userAuth_1.default, userController_1.getDocList);
// Patients API's
router.post('/add-patient', userAuth_1.default, userController_1.addPatient);
router.get('/view-patient/:patientId', userAuth_1.default, userController_1.getPatient);
router.put('/update-patient/:patientId', userAuth_1.default, userController_1.updatePatient);
router.delete('/delete-patient/:patientId', userAuth_1.default, userController_1.deletePatient);
router.get('/patient-list', userAuth_1.default, userController_1.getPatientList);
// Appointment API's
router.get('/appointment-list', userAuth_1.default, userController_1.getAppointmentList);
router.post('/add-appointment', userAuth_1.default, userController_1.addAppointment);
router.get('/view-appointment/:appointmentId', userAuth_1.default, userController_1.getAppointment);
router.put('/update-appointment/:appointmentId', userAuth_1.default, userController_1.updateAppointment);
// router.delete('/delete-appointment/:appointmentId', userAuthMiddleware, deleteAppointment);
// Address API's
router.post('/add-address', userAuth_1.default, userController_1.addAddress);
router.put("/update-address/:addressId", userAuth_1.default, userController_1.updateAddress);
router.delete('/delete-address/:addressId', userAuth_1.default, userController_1.deleteAddress);
router.post('/forgetPasswordOTP', userController_1.forgetPasswordOTP);
router.put('/updateforgetedPassword', userController_1.updateforgetedPassword);
exports.default = router;
