import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import { PencilFill } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function EditableTitle({ title, onTitleSave, type }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
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
    }
  };

  const validateTitle = (title) => {
    const forbiddenChars = /[-&|]/;
    return !forbiddenChars.test(title);
  };

  const handleTitleChange = (event) => {
    let limitLength = 30;
    console.log(type);
    if (type === "question") {
      limitLength = 200;
    }
    if (event.target.value.length <= limitLength) {
      if (validateTitle(event.target.value)) {
        setNewTitle(event.target.value);
      } else {
        toast.error("Title cannot contain '-', '&' or '|'");
      }
    } else {
      if (type === "question") {
        toast.error("Title cannot be longer than 200 characters");
      } else {
        toast.error("Title cannot be longer than 30 characters");
      }
      
    }
  };

  const handleTitleSave = () => {
    onTitleSave(newTitle);
    setIsEditing(false);
  };

  return (
    <div ref={ref} className="d-flex h-100  flex-column justify-content-center">
      {isEditing ? (
        <div>
          <input type="text" value={newTitle} onChange={handleTitleChange} />
          <button onClick={handleTitleSave}>Save</button>
        </div>
      ) : (
        <div className="d-flex w-100 h-100 justify-content-center">
          <div className="cursor-pointer d-flex flex-column justify-content-center" onClick={() => setIsEditing(true)}>
            <span>{title} <PencilFill size={16} /></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditableTitle;
