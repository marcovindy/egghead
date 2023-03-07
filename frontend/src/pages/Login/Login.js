
import React from "react";

import { LoginForm } from "../../components/Forms/LoginForm/LoginForm";

import "./Login.css";

export const Login = () => {
  return (
    <div className="registration-page bg-info">
      <div className="mt-5">
          <LoginForm />
      </div>
    </div>
  );
};

export default Login