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
    EDIT_ADDRESS: string
}

export const Local:config = {
    BASE_URL: import.meta.env.VITE_BASE_URL,
    CREATE_USER: import.meta.env.VITE_CREATE_USER,
    VERIFY_USER: import.meta.env.VITE_VERIFY_USER,
    LOGIN_USER: import.meta.env.VITE_LOGIN_USER,
    GET_USER: import.meta.env.VITE_GET_USER,
    GET_DOC_LIST: import.meta.env.VITE_GET_DOC_LIST,
    GET_PATIENT_LIST: import.meta.env.VITE_GET_PATIENT_LIST,
    ADD_PATIENT: import.meta.env.VITE_ADD_PATIENT,
    ADD_ADDRESS: import.meta.env.VITE_ADD_ADDRESS,
    EDIT_PASSWORD: import.meta.env.VITE_EDIT_PASSWORD,
    EDIT_PROFILE: import.meta.env.VITE_EDIT_PROFILE,
    DELETE_PATIENT: import.meta.env.VITE_DELETE_PATIENT,
    EDIT_PATIENT: import.meta.env.VITE_EDIT_PATIENT,
    VIEW_PATIENT: import.meta.env.VITE_VIEW_PATIENT,
    EDIT_ADDRESS: import.meta.env.VITE_EDIT_ADDRESS
}