import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import t from "../../i18nProvider/translate";
import { toast } from "react-toastify";

function ChangePassword() {
  const IS_PROD = process.env.NODE_ENV === "production";
  const API_URL = IS_PROD
    ? "https://testing-egg.herokuapp.com"
    : "http://localhost:5000";

    
  const yupTranslate = (data) => {
    return t(data);
  }


  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required(yupTranslate("old-password-validation-required")),
    newPassword: Yup.string()
      .required(yupTranslate("new-password-validation-required"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/,
        yupTranslate("password-validation-complexity-no-special")
      )
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        yupTranslate("new-password-validation-special-char")
      )
      .min(8, yupTranslate("new-password-validation-min-length")),
  });
  

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      axios
        .put(
          `${API_URL}/auth/changepassword`,
          { oldPassword: values.oldPassword, newPassword: values.newPassword },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        )
        .then((response) => {
          if (response.data.error) {
            let errorMessage = t(response.data.error);
            toast.error(errorMessage);
          } else {
            let successMessage = t(response.data.message);
            toast.success(successMessage);
          }
        });
    },
  });

  return (
    <Container>
      <Row>
        <Col>
          <h1>{t("Change Your Password")}</h1>
          <form onSubmit={formik.handleSubmit}>
            <div>
              <input
                type="password"
                name="oldPassword"
                placeholder="Old Password..."
                value={formik.values.oldPassword}
                onChange={formik.handleChange}
              />
              {formik.errors.oldPassword && formik.touched.oldPassword && (
                <p>{formik.errors.oldPassword}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password..."
                value={formik.values.newPassword}
                onChange={formik.handleChange}
              />
              {formik.errors.newPassword && formik.touched.newPassword && (
                <p className="text-danger">{formik.errors.newPassword}</p>
              )}
            </div>
            <Button type="submit">{t("saveButton")}</Button>
          </form>
        </Col>
      </Row>
    </Container>
  );
}

export default ChangePassword;
