import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';
import { useParams } from "react-router-dom";

const EditableTitle = ({ title, onTitleSave }) => {
    let { id } = useParams();
    const [showEditTitle, setShowEditTitle] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const inputRef = useRef();

    useEffect(() => {
        // add a listener to hide the input field when user clicks outside of it
        document.addEventListener("mousedown", handleHideInput);
        return () => {
            document.removeEventListener("mousedown", handleHideInput);
        };
    }, []);

    const handleEditTitle = () => {
        setShowEditTitle(true);
    };

    const handleTitleChange = (event) => {
        setNewTitle(event.target.value);
    };

    const handleTitleSave = () => {
        onTitleSave(newTitle);
        setShowEditTitle(false);
    };

    const handleHideInput = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setShowEditTitle(false);
        }
    };

    return (
        <h1>
            Název kvízu:{" "}
            {showEditTitle ? (
                <div ref={inputRef}>
                    <input type="text" value={newTitle} onChange={handleTitleChange} />
                    <Button onClick={handleTitleSave}>Uložit</Button>
                </div>
            ) : (
                <span onClick={handleEditTitle}>
                    {title} <PencilFill className="m-2" size={22} />
                </span>
            )}
        </h1>
    );
};

export default EditableTitle;
