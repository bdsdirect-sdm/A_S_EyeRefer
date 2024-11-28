interface config{
    BASE_URL: string;
    CREATE_USER: string;
    VERIFY_USER: string;
    LOGIN_USER: string;
    GET_USER: string;
    GET_DOC_LIST: string;
    GET_PATIENT_LIST: string;
    ADD_PATIENT: string;
    ADD_ADDRESS: string;
    EDIT_PASSWORD: string;
    EDIT_PROFILE: string;
    DELETE_PATIENT: string;
    EDIT_PATIENT: string;
    VIEW_PATIENT: string;
    EDIT_ADDRESS: string;
    DELETE_ADDRESS: string;
    GET_APPOINTMENT_LIST: string;
    ADD_APPOINTMENT: string;
    EDIT_APPOINTMENT: string;
    DELETE_APPOINTMENT: string;
    VIEW_APPOINTMENT: string;
    GET_ROOM: string;
    GET_STAFF_LIST: string;
    ADD_STAFF: string;
    DELETE_STAFF: string;
}

export const Local:config = {
    BASE_URL: import.meta.env.VITE_BASE_URL,
    
    CREATE_USER: import.meta.env.VITE_CREATE_USER,
    VERIFY_USER: import.meta.env.VITE_VERIFY_USER,
    LOGIN_USER: import.meta.env.VITE_LOGIN_USER,
    GET_USER: import.meta.env.VITE_GET_USER,
    EDIT_PROFILE: import.meta.env.VITE_EDIT_PROFILE,
    EDIT_PASSWORD: import.meta.env.VITE_EDIT_PASSWORD,
    GET_DOC_LIST: import.meta.env.VITE_GET_DOC_LIST,
    
    
    ADD_ADDRESS: import.meta.env.VITE_ADD_ADDRESS,
    EDIT_ADDRESS: import.meta.env.VITE_EDIT_ADDRESS,
    DELETE_ADDRESS: import.meta.env.VITE_DELETE_ADDRESS,
    

    ADD_PATIENT: import.meta.env.VITE_ADD_PATIENT,
    VIEW_PATIENT: import.meta.env.VITE_VIEW_PATIENT,
    EDIT_PATIENT: import.meta.env.VITE_EDIT_PATIENT,
    DELETE_PATIENT: import.meta.env.VITE_DELETE_PATIENT,
    GET_PATIENT_LIST: import.meta.env.VITE_GET_PATIENT_LIST,
    

    ADD_APPOINTMENT: import.meta.env.VITE_ADD_APPOINTMENT,
    EDIT_APPOINTMENT: import.meta.env.VITE_EDIT_APPOINTMENT,
    DELETE_APPOINTMENT: import.meta.env.VITE_DELETE_APPOINTMENT,
    GET_APPOINTMENT_LIST: import.meta.env.VITE_GET_APPOINTMENT_LIST,
    VIEW_APPOINTMENT: import.meta.env.VITE_VIEW_APPOINTMENT,

    GET_ROOM: import.meta.env.VITE_GET_ROOM,

    GET_STAFF_LIST: import.meta.env.VITE_GET_STAFF_LIST,
    ADD_STAFF: import.meta.env.VITE_ADD_STAFF,
    DELETE_STAFF: import.meta.env.VITE_DELETE_STAFF
}