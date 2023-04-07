import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CheckboxGroup from "../CheckboxGroup/CheckboxGroup";

const FilterBox = ({ categories, onFilterApply }) => {
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
        categories: Yup.array().min(1, "Select at least one category"),
        length: Yup.string(),
      })}
      onSubmit={(values) => {
        onFilterApply(values);
      }}
    >
      {(formik) => (
        <Form>
          <div>
            <label htmlFor="language">Language:</label>
            <Field type="text" name="language" />
            {formik.touched.language && formik.errors.language && (
              <div>{formik.errors.language}</div>
            )}
          </div>

          <div>
            <label>Categories:</label>
            <CheckboxGroup
              name="categories"
              options={categories.map((category) => category.name)}
              onChange={handleCategoryChange}
            />
            {formik.touched.categories && formik.errors.categories && (
              <div>{formik.errors.categories}</div>
            )}
          </div>

          <div>
            <label htmlFor="length">Length:</label>
            <Field type="text" name="length" />
            {formik.touched.length && formik.errors.length && (
              <div>{formik.errors.length}</div>
            )}
          </div>

          <button type="submit">Apply Filter</button>
        </Form>
      )}
    </Formik>
  );
};

export default FilterBox;
