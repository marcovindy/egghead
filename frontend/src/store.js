import { configureStore } from "@reduxjs/toolkit";

import registrationReducer from "./components/Forms/RegisterForm/userRegSlice";

const store = configureStore({
	reducer: {
		registration: registrationReducer,
	},
});

export default store;