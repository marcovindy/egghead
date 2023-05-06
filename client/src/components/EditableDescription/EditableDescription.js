import React, { useState, useRef, useEffect } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import t from '../../i18nProvider/translate'

const EditableDescription = ({ description, onDescriptionSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(description);
  const ref = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsEditing(false);
      setNewDescription(description);
    }
  };

  const handleSave = () => {
    onDescriptionSave(newDescription);
    setIsEditing(false);
  };

  const validateDescription = (description) => {
    return true;
  };

  const handleDescriptionChange = (event) => {
    if (event.target.value.length <= 300) {
      if (validateDescription(event.target.value)) {
        setNewDescription(event.target.value);
      } else {
        toast.error("Invalid description");
      }
    } else {
      toast.error("Description cannot be longer than 300 characters");
    }
  };

  return (
    <div ref={ref}>
      {isEditing ? (
        <>
          <InputGroup>
            <FormControl
              as="textarea"
              value={newDescription}
              maxLength={300}
              onChange={handleDescriptionChange}
            />
          </InputGroup>
          <Button className="mb-2" onClick={handleSave}>{t('saveButton')}</Button>
        </>
      ) : (
        <>
          <p className="cursor-pointer" onClick={() => setIsEditing(true)}>{description}</p>
        </>
      )}
    </div>
  );
};

export default EditableDescription;
