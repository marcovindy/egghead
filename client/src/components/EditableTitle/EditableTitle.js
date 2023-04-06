import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';
import { useParams } from "react-router-dom";

function EditableTitle({ title, onTitleSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
  
    const handleTitleChange = (event) => {
      setNewTitle(event.target.value);
    };
  
    const handleTitleSave = () => {
      onTitleSave(newTitle); // pass newTitle as an argument
      setIsEditing(false);
    };
  
    return (
      <div>
        {isEditing ? (
          <div>
            <input type="text" value={newTitle} onChange={handleTitleChange} />
            <button onClick={handleTitleSave}>Save</button>
          </div>
        ) : (
          <div>
            <span onClick={() => setIsEditing(true)}>{title}</span>
          </div>
        )}
      </div>
    );
  }
  
export default EditableTitle;
