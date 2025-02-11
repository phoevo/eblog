import { useState, useEffect } from "react";
import db from "../appwrite/databases"; // Import Appwrite DB
import Posts from "./Posts";
import "../styles/MainPage.css";
import PropTypes from "prop-types";

function MainPage({ posts, setPosts, loggedin, editIcon}) {
  const [edit, setEdit] = useState(false);
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
        <button onClick={handleEdit} className="blogEditIcon">{editIcon}</button>
      )}

      <Posts posts={posts} setPosts={setPosts} loggedin={loggedin} style={{ backgroundColor: postsBgColor }} />

      {edit && (
        <form onSubmit={handleSave} className="blog-form">
          <label>
            Page Background Color:
            <input type="color" value={bgColor} onChange={handleColorChange} />
          </label>

          <label>
            Posts Background Color:
            <input type="color" value={postsBgColor} onChange={handlePostsColorChange} />
          </label>

          <button className="blogSaveBtn" type="submit">Save</button>
        </form>
      )}
    </section>
  );
}

MainPage.propTypes = {
  posts: PropTypes.array.isRequired,
  setPosts: PropTypes.func.isRequired,
  loggedin: PropTypes.bool,
  setLoggedIn: PropTypes.func,
  editIcon: PropTypes.element
};

export default MainPage;
