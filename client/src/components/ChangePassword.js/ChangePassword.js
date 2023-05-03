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

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string()
      .required("New password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/,
        "Password should contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "New password must have at least one special character"
      )
      .min(8, "New password must have at least 8 characters"),
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
