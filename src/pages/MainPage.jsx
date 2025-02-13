import { useState, useEffect } from "react";
import db from "../appwrite/databases"; // Import Appwrite DB
import Posts from "./Posts";
import "../styles/MainPage.css";
import PropTypes from "prop-types";
import NoteForm from "../components/NoteForm";
import Notes from "./Notes";

function MainPage({ posts, setPosts, notes, setNotes, loggedin, editIcon}) {
  const [edit, setEdit] = useState(false);
  const [noteView, setNoteView] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [postsBgColor, setPostsBgColor] = useState("#ffffff");
  const [blogId, setBlogId] = useState(null);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await db.blog.list();
        if (response.documents.length > 0) {
          const blogSettings = response.documents[0];
          setBgColor(blogSettings.bgColor || "#ffffff");
          setPostsBgColor(blogSettings.postBgColor || "#ffffff");
          setBlogId(blogSettings.$id);
        }
      } catch (error) {
        console.error("Error fetching background colors:", error);
      }
    };

    fetchColors();
  }, []);

  const handleEdit = () => {
    setEdit((prevEdit) => !prevEdit);
  };

  const handleNoteView = () => {
    setNoteView((prevView) => !prevView);
  };

  const handleColorChange = (event) => {
    setBgColor(event.target.value);
  };

  const handlePostsColorChange = (event) => {
    setPostsBgColor(event.target.value);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        bgColor,
        postBgColor: postsBgColor,
      };

      if (blogId) {
        await db.blog.update(blogId, payload);
      } else {
        const response = await db.blog.create(payload);
        setBlogId(response.$id);
      }

      setEdit(false);
    } catch (error) {
      console.error("Error saving colors:", error);
    }
  };

  return (
    <section className="mainpage" style={{ backgroundColor: bgColor }}>
      {loggedin && (
        <div className="noteAndEdit">
          <button onClick={handleEdit} className="blogEditIcon">{editIcon}</button>
          <button onClick={handleNoteView} className="newNoteBtn">New Note</button>
        </div>
      )}

      <Posts posts={posts} setPosts={setPosts} loggedin={loggedin} style={{ backgroundColor: postsBgColor }} />

      <Notes notes={notes} setNotes={setNotes} loggedin={loggedin} />


      {noteView && <NoteForm setNotes={setNotes} setNoteView={setNoteView} />}

      {edit && (
        <form onSubmit={handleSave} className="edit-form">
          <label>
            Page Background Color:
            <input type="color" value={bgColor} onChange={handleColorChange} />
          </label>

          <label>
            Posts Background Color:
            <input type="color" value={postsBgColor} onChange={handlePostsColorChange} />
          </label>

          <button className="editSaveBtn" type="submit">Save</button>
        </form>
      )}
    </section>
  );

}

MainPage.propTypes = {
  posts: PropTypes.array.isRequired,
  setPosts: PropTypes.func.isRequired,
  notes: PropTypes.array.isRequired,
  setNotes: PropTypes.func.isRequired,
  loggedin: PropTypes.bool,
  setLoggedIn: PropTypes.func,
  editIcon: PropTypes.element
};

export default MainPage;
