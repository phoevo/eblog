import db from '../appwrite/databases';
import PropTypes from 'prop-types';
import "../styles/Note.css";
import useClickOutside from '../hooks/useClickOutside';
import {useState} from "react";

function NoteForm({ setNotes, setNoteView }) {
  const formRef = useClickOutside(() => setNoteView(false));
  const [textCount, setTextCount] = useState("");



  const handleAdd = async (e) => {
    e.preventDefault();
    const noteTitle = e.target.title.value;
    const noteBody = e.target.body.value;
    setNoteView((prevView) => !prevView);

    if (!noteTitle || !noteBody) return;

    try {
      const payload = { title: noteTitle, body: noteBody };
      const response = await db.notes.create(payload);
      setNotes((prevState) => [response, ...prevState]);
      e.target.reset();
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  return (
    <section className="createNoteDropDown" ref={formRef}>
      <form className="noteForm" onSubmit={handleAdd}>
        <input
          className="noteTitleInput"
          type="text"
          name="title"
          placeholder="Title"
        />
        <textarea
          maxLength={120}
          className="noteBodyInput"
          name="body"
          placeholder="Body"
          value={textCount}
          onChange={(e) => setTextCount(e.target.value)}
        />
         <div className="bodyInputCount">{textCount.length}/120</div>
        <button className="addNoteBtn" type="submit">
          Add note
        </button>
      </form>
    </section>
  );
}

NoteForm.propTypes = {
  setNotes: PropTypes.func.isRequired,
  setNoteView: PropTypes.func.isRequired,
};

export default NoteForm;
