import { useState, useEffect } from "react";
import "../styles/Contact.css";
import db from "../appwrite/databases";

function Contact({ loggedin, editIcon }) {
  const [edit, setEdit] = useState(false);
  const [contactinfo, setContactInfo] = useState({
    message: "",
    name: "",
    email: "",
    phone: "",
  });
  const [contactId, setContactId] = useState(null);


  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await db.contact.list();
        if (response.documents.length > 0) {
          const existingContact = response.documents[0];
          setContactInfo({
            message: existingContact.message,
            name: existingContact.name,
            email: existingContact.email,
            phone: existingContact.phone,
          });
          setContactId(existingContact.$id);

        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    fetchContact();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const contactMessage = e.target.message.value;
      const contactName = e.target.name.value;
      const contactEmail = e.target.email.value;
      const contactPhone = e.target.phone.value;

      if (!contactMessage || !contactName || !contactEmail || !contactPhone) {
        return;
      }

      const payload = {
        message: contactMessage,
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
      };

      if (contactId) {

        const response = await db.contact.update(contactId, payload);
        console.log("Contact updated:", response);
      } else {

        const response = await db.contact.create(payload);
        console.log("Contact created:", response);
        setContactId(response.$id);
      }

      setContactInfo(payload);
      e.target.reset();
      setEdit(false);
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  const handleEdit = () => {
    setEdit((prevEdit) => !prevEdit);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContactInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  return (
    <section className="contact-section">
      <div className="contact-div">
        {loggedin && (
          <button onClick={handleEdit} className="contactEditIcon">
            {editIcon}
          </button>
        )}
        <h1 className="contact-message">{contactinfo.message}</h1>
        <p className="contact-name">{contactinfo.name}</p>
        <p className="contact-email">{contactinfo.email}</p>
        <p className="contact-phone">{contactinfo.phone}</p>
      </div>

      {edit && (
        <form onSubmit={handleAdd} className="contact-form">
          <label>
            Message
            <input
              type="text"
              placeholder="message"
              name="message"
              value={contactinfo.message}
              onChange={handleChange}
            />
          </label>

          <label>
            Name
            <input
              type="text"
              placeholder="name"
              name="name"
              value={contactinfo.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Email
            <input
              type="text"
              placeholder="email"
              name="email"
              value={contactinfo.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Number
            <input
              type="number"
              placeholder="phone"
              name="phone"
              value={contactinfo.phone}
              onChange={handleChange}
            />
          </label>

          <button className="ContactSaveBtn" type="submit">SAVE</button>
        </form>
      )}
    </section>
  );
}

export default Contact;