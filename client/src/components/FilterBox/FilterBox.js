import React, { memo, useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import t from "../../i18nProvider/translate";
import CheckboxGroup from "../CheckboxGroup/CheckboxGroup";
import MultiRangeSlider from "multi-range-slider-react";
import '../../assets/styles/MultiRangeSlider/MultiRangeSlider.css';

const FilterBox = memo(({ onFilterApply, categories, languageOptions }) => {
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(100);
    const [filterValues, setFilterValues] = useState({
        language: "",
        categories: [],
        length: [minValue, maxValue]
    });

    useEffect(() => {
        setFilterValues({
            language: "",
            categories: [],
            length: [minValue, maxValue]
        });
    }, [minValue, maxValue]);

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

    const handleInput = (e) => {
        setMinValue(e.minValue);
        setMaxValue(e.maxValue);
    };

    const handleSubmit = (values) => {
        if (onFilterApply) {
            onFilterApply(values);
        }
    };

    return (
        <Formik
            initialValues={filterValues}
            validationSchema={Yup.object({
                language: Yup.string(),
                categories: Yup.array(),
                length: Yup.array().of(Yup.number().min(0).max(100)),
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
                                <label htmlFor="language">{t('Language')}:</label>
                                <select id="language" name="language" value={formik.values.language} onChange={formik.handleChange}>
                                    <option value="">{'Select language'}</option>
                                    {languageOptions.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                {formik.touched.language && formik.errors.language && (
                                    <div>{formik.errors.language}</div>
                                )}
                            </Row>
                            <Row className="p-0">
                                <label className="pb-2" htmlFor="length">{t('Length')}:</label>
                                <MultiRangeSlider
                                    min={0}
                                    max={100}
                                    step={5}
                                    minValue={minValue}
                                    maxValue={maxValue}
                                    onInput={(e) => {
                                        handleInput(e);
                                        formik.setFieldValue('length', [minValue, maxValue]);
                                    }}
                                />
                            </Row>
                        </Col>

                        <Col lg={6} xs={12}>
                            <label>{t('Categories')}:</label>
                            <CheckboxGroup
                                name="categories"
                                options={categories.map((category) => category.name)}
                                onChange={handleCategoryChange}
                            />
                            {formik.touched.categories && formik.errors.categories && (
                                <div>{t(formik.errors.categories)}</div>
                            )}
                        </Col>
                    </Row>
                    <Row className="p-0">
                        <Button size="md" type="submit">{t('Apply Filter')}</Button>
                    </Row>
                </Form>
            )}
        </Formik>
    );
});

export default FilterBox;
