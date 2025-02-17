import { useState } from "react";
import { databases } from "../appwrite/config";
import PropTypes from "prop-types";
import "../styles/Note.css";
import Draggable from "react-draggable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";


function Note({ setNotes, noteData, loggedin }) {
  if (!noteData) {
    console.error("Error: `noteData` is undefined in Note component!");
  }

  const [note] = useState(noteData);
  const localStorageKey = `note-${note.$id}-position`;

  const deleteIcon = <FontAwesomeIcon icon={faTrash} />;
  const editIcon = <FontAwesomeIcon icon={faPenToSquare} />;

  const [edit, setEdit] = useState(false);
  const [position, setPosition] = useState(() => {
    const savedPosition = localStorage.getItem(localStorageKey);
    return savedPosition ? JSON.parse(savedPosition) : { x: 0, y: 0 };
  });

  const [notesBorderColor, setNotesBorderColor] = useState(note.notesBorderColor || "white");


  const handleStop = (e, data) => {
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    localStorage.setItem(localStorageKey, JSON.stringify(newPosition));
  };


  const handleDelete = async () => {
    try {
      await databases.deleteDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_COLLECTION_ID_NOTES,
        note.$id
      );
      setNotes((prevState) => prevState.filter((i) => i.$id !== note.$id));
      localStorage.removeItem(localStorageKey);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        notesBorderColor,
      };


      await databases.updateDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_COLLECTION_ID_NOTES,
        note.$id,
        payload
      );

      setEdit(false);
    } catch (error) {
      console.error("Error saving border color:", error);
    }
  };

  const handleEdit = () => {
    setEdit((prevEdit) => !prevEdit);
  };

  const handleColorChange = (event) => {
    setNotesBorderColor(event.target.value);
  };

  return (
    <Draggable position={position} onStop={handleStop}>
      <section className="note-section" style={{ borderColor: notesBorderColor }}>
        <div className="noteTitle">{note.title}</div>
        <div className="noteBody">{note.body}</div>

        {loggedin && (
          <div className="editAndDelete">
            <button onClick={handleEdit} className="noteEditIcon">{editIcon}</button>
            <button className="noteDelete" onClick={handleDelete}>{deleteIcon}</button>
          </div>
        )}

        {edit && (
          <form onSubmit={handleSave} className="notesEditForm">
            <input type="color" value={notesBorderColor} onChange={handleColorChange} />  {/* Color picker for border */}

            <button className="notesEditSaveBtn" type="submit">
              Save
            </button>
          </form>
        )}
      </section>
    </Draggable>
  );
}

Note.propTypes = {
  loggedin: PropTypes.bool,
  setNotes: PropTypes.func.isRequired,
  noteData: PropTypes.shape({
    $id: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    notesBorderColor: PropTypes.string,
    editIcon: PropTypes.element,
  }),
};

export default Note;
