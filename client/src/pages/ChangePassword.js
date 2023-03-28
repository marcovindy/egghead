import React, { useState } from "react";
import axios from "axios";

function ChangePassword() {
  const IS_PROD = process.env.NODE_ENV === "development";
  const URL = IS_PROD ? "http://localhost:5000/auth/changepassword" : "https://testing-egg.herokuapp.com/auth/changepassword";

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const changePassword = () => {
    axios
      .put(
        URL,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        }
      });
  };

  return (
    <div>
      <h1>Change Your Password</h1>
      <input
        type="text"
        placeholder="Old Password..."
        onChange={(event) => {
          setOldPassword(event.target.value);
        }}
      />
      <input
        type="text"
        placeholder="New Password..."
        onChange={(event) => {
          setNewPassword(event.target.value);
        }}
      />
      <button onClick={changePassword}> Save Changes</button>
    </div>
  );
}

export default ChangePassword;
