import { useEffect } from "react";
import db from "../appwrite/databases";
import { Query } from "appwrite";
import Note from "../components/Note";
import PropTypes from "prop-types";
import "../styles/Note.css"


export default function Notes({ notes, setNotes, loggedin, style }) {
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await db.notes.list([Query.orderDesc("$createdAt")]);

        if (response.documents) {
          setNotes(response.documents);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, [setNotes]); // ✅ Run only when `setNotes` changes


  return (
    <div className="notes-div" style={style}>
      {notes.map((note) => (
          <Note key={note.$id} setNotes={setNotes} noteData={note} loggedin={loggedin} />
        ))}
    </div>
  );
}

Notes.propTypes = {
  loggedin: PropTypes.bool,
  notes: PropTypes.array.isRequired,
  setNotes: PropTypes.func.isRequired,
  style: PropTypes.object,
};
