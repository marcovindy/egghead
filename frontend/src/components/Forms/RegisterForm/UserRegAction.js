import {
    registrationPending, // Akce pro signalizaci probíhající registrace
    registrationSuccess, // Akce pro signalizaci úspěšné registrace
    registrationError, // Akce pro signalizaci chyby při registraci
} from "./UserRegSlice"; // Importování definic akcí pro registraci

// Importování funkce pro registraci uživatele z API
import { UserRegistration } from "../../../api/UserApi";

export const newUserRegistration = (frmDt) => async (dispatch) => {
    try {
        dispatch(registrationPending()); // Dispatch akce signalizující probíhající registraci

        const result = await UserRegistration(frmDt);  // Volání funkce pro registraci uživatele z API
        result.status === "success" // Pokud registrace proběhla úspěšně
            ? dispatch(registrationSuccess(result.message)) // Dispatch akce signalizující úspěšnou registraci
            : dispatch(registrationError(result.message));  // Dispatch akce signalizující chybu při registraci

        console.log(result);
    } catch (error) {
        dispatch(registrationError(error.message)); // Dispatch akce signalizující chybu při registraci
    }
};