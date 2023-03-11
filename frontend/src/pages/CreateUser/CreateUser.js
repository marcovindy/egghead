// import React, { useState, useEffect } from 'react';
// import Axios from 'axios'

// function CreateUser() {

//     const [userName, setUserName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const submitPost = () => {
//         Axios.post('http://localhost:5000/api/create', { userName: userName, email: email, password: password })
//     }

//     return (
//         <div className="CreateUser">
//             <div className="uploadPost">
//                 <label>Username: </label>
//                 <input type="text" onChange={(e) => {
//                     setUserName(e.target.value)
//                 }} />
//                 <label>Email: </label>
//                 <input type="text" onChange={(e) => {
//                     setEmail(e.target.value)
//                 }} />
//                 <label>Password: </label>
//                 <input type="password" onChange={(e) => {
//                     setPassword(e.target.value)
//                 }} />

//                 <button onClick={submitPost}>Submit Post</button>
//             </div>
//         </div>
//     )
// }

// export default CreateUser



import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function CreateUser() {
    const initialValues = {
        username: "",
        password: "",
        email: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3).max(15).required(),
        password: Yup.string().min(4).max(20).required(),
    });

    const onSubmit = (data) => {
        axios.post("http://localhost:5000/auth", data).then(() => {
            console.log(data);
        });
    };

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    <label>Username: </label>
                    <ErrorMessage name="username" component="span" />
                    <Field
                        autocomplete="off"
                        id="inputCreatePost"
                        name="username"
                        placeholder="(Ex. John123...)"
                    />

                    <label>Email: </label>
                    <ErrorMessage name="email" component="span" />
                    <Field
                        autocomplete="off"
                        id="inputCreatePost"
                        name="email"
                        placeholder="Your Email..."
                    />

                    <label>Password: </label>
                    <ErrorMessage name="password" component="span" />
                    <Field
                        autocomplete="off"
                        type="password"
                        id="inputCreatePost"
                        name="password"
                        placeholder="Your Password..."
                    />



                    <button type="submit"> Register</button>
                </Form>
            </Formik>
        </div>
    );
}

export default CreateUser;