import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import { PencilFill } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function EditableTitle({ title, onTitleSave }) {
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
    if (event.target.value.length <= 30) {
      if (validateTitle(event.target.value)) {
        setNewTitle(event.target.value);
      } else {
        toast.error("Title cannot contain '-', '&' or '|'");
      }
    } else {
      toast.error("Title cannot be longer than 30 characters");
    }
  };

  const handleTitleSave = () => {
    onTitleSave(newTitle);
    setIsEditing(false);
  };

  return (
    <div ref={ref}>
      {isEditing ? (
        <div>
          <input type="text" value={newTitle} onChange={handleTitleChange} />
          <button onClick={handleTitleSave}>Save</button>
        </div>
      ) : (
        <div>
          <span className="cursor-pointer" onClick={() => setIsEditing(true)}>
            {title} <PencilFill size={16} />
          </span>
        </div>
      )}
    </div>
  );
}

export default EditableTitle;
