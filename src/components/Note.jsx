import { useState, useEffect } from "react";
import { databases } from "../appwrite/config";
import PropTypes from "prop-types";
import "../styles/Note.css";
import Draggable from "react-draggable";

function Note({ setNotes, noteData, loggedin }) {
  if (!noteData) {
    console.error("Error: `noteData` is undefined in Note component!");
  }

  const [note] = useState(noteData);

  const localStorageKey = `note-${note.$id}-position`;


  const [position, setPosition] = useState(() => {
    const savedPosition = localStorage.getItem(localStorageKey);
    return savedPosition ? JSON.parse(savedPosition) : { x: 0, y: 0 };
  });


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

  return (
    <Draggable position={position} onStop={handleStop}>

      <section className="note-section">
        <div className="noteTitle">{note.title}</div>
        <div className="noteBody">{note.body}</div>

        {loggedin && (
          <button className="noteDelete" onClick={handleDelete}>
            Delete
          </button>
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
  }),
};

export default Note;
