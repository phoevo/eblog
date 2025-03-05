import { useState, useEffect, useRef } from "react";
import "../styles/Contact.css";
import db from "../appwrite/databases";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import useClickOutside from "../hooks/useClickOutside";
import emailjs from "@emailjs/browser";

function Contact({ loggedin, editIcon }) {
  const [edit, setEdit] = useState(false);
  const [bgColor, setBgColor] = useState("whitesmoke");
  const [messageColor, setMessageColor] = useState("whitesmoke");
  const [contactColor, setContactColor] = useState("whitesmoke");
  const [contactinfo, setContactInfo] = useState({
    message: "",
    name: "",
    email: "",
    phone: "",
  });
  const [contactId, setContactId] = useState(null);
  const emailForm = useRef(null);

  // const linkedInIcon = <FontAwesomeIcon icon={faLinkedin} size="xl" />;
  const phoneIcon = <FontAwesomeIcon icon={faPhone} />;
  const editRef = useClickOutside(() => setEdit(false));

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
          setBgColor(existingContact.bgColor || "whitesmoke");
          setMessageColor(existingContact.messageColor || "whitesmoke");
          setContactColor(existingContact.contactColor || "whitesmoke");
          setContactId(existingContact.$id);
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    fetchContact();
  }, []);


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
        bgColor,
        messageColor,
        contactColor,
      };

      if (contactId) {
        await db.contact.update(contactId, payload);
        console.log("Contact updated:", payload);
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

  const handleSendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_l44cx0l",
        "template_2a9fr0u",
        emailForm.current,
        "hR4COSO4qV4GDCZwK"
      )
      .then(
        (response) => {
          console.log("Email sent successfully:", response);
          alert("Your message has been sent!");
          emailForm.current.reset();
        },
        (error) => {
          console.error("Error sending email:", error);
        }
      );
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
    <section className="contact-section" style={{backgroundColor: bgColor}}>


      <div className="contact-div" style={{backgroundColor: contactColor}}>
        {loggedin && (
          <button onClick={handleEdit} className="contactEditIcon">
            {editIcon}
          </button>
        )}
        <h1 className="contact-message">{contactinfo.message}</h1>
        <div className="contact-name">{contactinfo.name}</div>
        <div className="contact-email">{contactinfo.email}</div>
        <div className="contact-phone">{phoneIcon} {contactinfo.phone}</div>

        {/* <div className="socialsBox">
          <h2>Or check out my socials</h2>
          <div className="socialsLinks">
            <p className="linkedInIcon">{linkedInIcon} Efthymia Karatopouzi</p>
          </div>
        </div> */}
      </div>

      {edit && (
        <form onSubmit={handleAdd} className="contact-form" ref={editRef}>
          <label>Background<input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}/>
          </label>

          <label>Message box<input
          type="color"
          value={messageColor}
          onChange={(e) => setMessageColor(e.target.value)}/>
          </label>

          <label>Contact box<input
          type="color"
          value={contactColor}
          onChange={(e) => setContactColor(e.target.value)}/>
          </label>

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
            <input className="contactNumber"
              type="number"
              placeholder="phone"
              name="phone"
              value={contactinfo.phone}
              onChange={handleChange}
            />
          </label>

          <button className="ContactSaveBtn" type="submit">
            Save
          </button>
        </form>
      )}


      <div className="messageSection" style={{backgroundColor: messageColor}}>
      <p className="contactH1">Send me a message</p>

      <form ref={emailForm} onSubmit={handleSendEmail} className="emailForm">

        <label>
          Name:
          <input type="text" name="user_name" required />
        </label>

        <label>
          Email:
          <input type="email" name="user_email" required />
        </label>

        <label>
          Message:
          <textarea name="message" required></textarea>
        </label>

        <button type="submit">Send message</button>
      </form>
      </div>
    </section>
  );
}

Contact.propTypes = {
  loggedin: PropTypes.bool.isRequired,
  editIcon: PropTypes.bool.isRequired,
};

export default Contact;
