import { Router } from "express";
import { registerUser, loginUser, verifyUser, getUser, getDocList,
    getPatientList, addPatient, addAddress, updatePassword, updateProfile,
    getPatient, deletePatient, updatePatient, updateAddress } from "../controllers/userController";
import userAuthMiddleware from "../middlewares/userAuth";
import signupValidation from "../middlewares/formValidation.ts/signupValidation";
import loginValidation from "../middlewares/formValidation.ts/loginValidation";

const  router = Router();

router.post("/register",signupValidation, registerUser);
router.post("/login",loginValidation, loginUser);
router.put("/verify", verifyUser);
router.get('/user', userAuthMiddleware, getUser);
router.get('/doc-list', userAuthMiddleware, getDocList);
router.get('/patient-list', userAuthMiddleware, getPatientList);
router.post('/add-patient', userAuthMiddleware, addPatient);
router.post('/add-address', userAuthMiddleware, addAddress);
router.put("/update-password", userAuthMiddleware, updatePassword);
router.put("/update-profile", userAuthMiddleware, updateProfile);
router.get('/view-patient/:patientId', userAuthMiddleware, getPatient);
router.put('/update-patient/:patientId', userAuthMiddleware, updatePatient);
router.delete('/delete-patient/:patientId', userAuthMiddleware, deletePatient);
router.put("/update-address/:addressId", userAuthMiddleware, updateAddress)

export default router;