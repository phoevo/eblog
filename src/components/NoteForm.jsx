//import React from 'react'
import db from '../appwrite/databases'
import PropTypes from 'prop-types'
import "../styles/Note.css"

function NoteForm({setNotes, setNoteView}) {

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
    <section className="createNoteDropDown">

      <form className = "noteForm" onSubmit={handleAdd}>
      <input
        className='noteTitleInput'
        type="text"
        name="title"
        placeholder="Title"/>

      <textarea maxLength={120}
        className='noteBodyInput'
        type="description"
        name="body"
        placeholder="Body"
      />

      <button className='addNoteBtn' type="submit">Add note</button>
     </form>


    </section>
  )
}

NoteForm.propTypes = {
  setNotes: PropTypes.func.isRequired,
  setNoteView: PropTypes.func.isRequired,
  loggedin: PropTypes.bool,
  setLoggedIn: PropTypes.func,
}

export default NoteForm
