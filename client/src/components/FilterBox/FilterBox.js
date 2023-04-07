import { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CheckboxGroup from "../CheckboxGroup/CheckboxGroup";

const FilterBox = ({ categories, languageOptions, onFilterApply }) => {
    const [filterValues, setFilterValues] = useState({
        language: "",
        categories: [],
        length: "",
    });

    const handleCategoryChange = (event) => {
        const { value, checked } = event.target;

        setFilterValues((prevValues) => {
            if (checked) {
                return {
                    ...prevValues,
                    categories: [...prevValues.categories, value],
                };
            } else {
                return {
                    ...prevValues,
                    categories: prevValues.categories.filter(
                        (category) => category !== value
                    ),
                };
            }
        });
    };

    return (
        <Formik
            initialValues={filterValues}
            validationSchema={Yup.object({
                language: Yup.string(),
                categories: Yup.array(),
                length: Yup.number(),
            })}
            onSubmit={(values) => {
                onFilterApply(values);
            }}
        >
            {(formik) => (
                <Form>
                    <Row className="p-0">
                        <Col lg={6} xs={12}>
                            <Row className="p-0 pb-4">
                            <label htmlFor="language">Language:</label>
                            <select id="language" name="language" value={formik.values.language} onChange={formik.handleChange}>
                                <option value="">Select language</option>
                                {languageOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            {formik.touched.language && formik.errors.language && (
                                <div>{formik.errors.language}</div>
                            )}
                        </Row>
                        <Row className="p-0">
                            <label htmlFor="length">Length:</label>
                            <Field type="text" name="length" />
                            {formik.touched.length && formik.errors.length && (
                                <div>{formik.errors.length}</div>
                            )}
                           </Row>
                        </Col>

                        <Col lg={6} xs={12}>
                            <label>Categories:</label>
                            <CheckboxGroup
                                name="categories"
                                options={categories.map((category) => category.name)}
                                onChange={handleCategoryChange}
                            />
                            {formik.touched.categories && formik.errors.categories && (
                                <div>{formik.errors.categories}</div>
                            )}
                        </Col>


                    </Row>
                    <Row className="p-0">


                        <Button size="md" type="submit">Apply Filter</Button>
                    </Row>
                </Form>
            )}
        </Formik>
    );
};

export default FilterBox;
