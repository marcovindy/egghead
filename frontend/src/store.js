import { configureStore } from "@reduxjs/toolkit";

import registrationReducer from "./components/Forms/RegisterForm/UserRegSlice";

const store = configureStore({
	reducer: {
		registration: registrationReducer,
	},
});

export default store;