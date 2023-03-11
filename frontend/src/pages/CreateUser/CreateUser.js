import React, { useState, useEffect } from 'react';
import Axios from 'axios'

function CreateUser() {

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submitPost = () => {
        Axios.post('http://localhost:5000/api/create', { userName: userName, email: email, password: password })
    }

    return (
        <div className="CreateUser">
            <div className="uploadPost">
                <label>Username: </label>
                <input type="text" onChange={(e) => {
                    setUserName(e.target.value)
                }} />
                <label>Email: </label>
                <input type="text" onChange={(e) => {
                    setEmail(e.target.value)
                }} />
                <label>Password: </label>
                <input type="password" onChange={(e) => {
                    setPassword(e.target.value)
                }} />

                <button onClick={submitPost}>Submit Post</button>
            </div>
        </div>
    )
}

export default CreateUser