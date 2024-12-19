import { Router } from "express";
import { registerUser, loginUser, verifyUser, getUser, getDocList,
    getPatientList, addPatient, addAddress, updatePassword, updateProfile,
    getPatient, deletePatient, updatePatient, updateAddress, addAppointment,
    updateAppointment, deleteAddress, getAppointmentList, 
    getAppointment, forgetPasswordOTP, updateforgetedPassword,
    getRooms, getStaffList, addStaff, deleteStaff, getNotifications,
    updateNotificationStatus, downloadPatientData} from "../controllers/userController";
import userAuthMiddleware from "../middlewares/userAuth";
import signupValidation from "../middlewares/formValidation.ts/signupValidation";
import loginValidation from "../middlewares/formValidation.ts/loginValidation";

const  router = Router();


// User API's
router.post("/register",signupValidation, registerUser);
router.post("/login",loginValidation, loginUser);
router.put("/verify", verifyUser);
router.get('/user', userAuthMiddleware, getUser);
router.put("/update-password", userAuthMiddleware, updatePassword);
router.put("/update-profile", userAuthMiddleware, updateProfile);
router.get('/doc-list', userAuthMiddleware, getDocList);

// Patients API's
router.post('/add-patient', userAuthMiddleware, addPatient);
router.get('/view-patient/:patientId', userAuthMiddleware, getPatient);
router.put('/update-patient/:patientId', userAuthMiddleware, updatePatient);
router.delete('/delete-patient/:patientId', userAuthMiddleware, deletePatient);
router.get('/patient-list', userAuthMiddleware, getPatientList);
router.get('/download-patient/:patientId', userAuthMiddleware, downloadPatientData);

// Appointment API's
router.get('/appointment-list', userAuthMiddleware, getAppointmentList);
router.post('/add-appointment', userAuthMiddleware, addAppointment);
router.get('/view-appointment/:appointmentId', userAuthMiddleware, getAppointment);
router.put('/update-appointment/:appointmentId', userAuthMiddleware, updateAppointment);
// router.delete('/delete-appointment/:appointmentId', userAuthMiddleware, deleteAppointment);

// Address API's
router.post('/add-address', userAuthMiddleware, addAddress);
router.put("/update-address/:addressId", userAuthMiddleware, updateAddress)
router.delete('/delete-address/:addressId', userAuthMiddleware, deleteAddress);


router.post('/forgetPasswordOTP', forgetPasswordOTP);
router.put('/updateforgetedPassword', updateforgetedPassword);

// Chat API's
router.get('/room-list', userAuthMiddleware, getRooms);

// Staff API's
router.get('/staff-list', userAuthMiddleware, getStaffList);
router.post('/add-staff', userAuthMiddleware, addStaff);
router.delete('/delete-staff/:staff_uuid', userAuthMiddleware, deleteStaff);

// Notification API's
router.get('/notification-list', userAuthMiddleware, getNotifications);
router.put('/seen-notification', userAuthMiddleware, updateNotificationStatus);

export default router;