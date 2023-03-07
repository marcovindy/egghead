
import React from "react";

import RegisterForm from "../../components/Forms/RegisterForm/RegisterForm";

import "./register.css";

export const Register = () => {
  return (
    <div className="registration-page bg-info">
      <div className="mt-5">
          <RegisterForm />
      
      </div>
    </div>
  );
};

export default Register