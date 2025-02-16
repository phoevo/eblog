import { useState, useEffect } from "react";
import "../styles/Contact.css";
import db from "../appwrite/databases";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFacebook } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import {faLinkedin} from "@fortawesome/free-brands-svg-icons";
import { faAt } from "@fortawesome/free-solid-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";




function Contact({ loggedin, editIcon }) {
  const [edit, setEdit] = useState(false);
  const [contactinfo, setContactInfo] = useState({
    message: "",
    name: "",
    email: "",
    phone: "",
  });
  const [contactId, setContactId] = useState(null);

  const facebookIcon = <FontAwesomeIcon icon={faSquareFacebook} />;
  // const instagramIcon = <FontAwesomeIcon icon={faInstagram} />;
  const linkedInIcon = <FontAwesomeIcon icon={faLinkedin} size="xl"/>
  const atIcon = <FontAwesomeIcon icon={faAt} />;
  const phoneIcon = <FontAwesomeIcon icon={faPhone} />;




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
      <div className="contactH1Container">
        <h1 className="contactH1">Don't hesitate to contact me anywhere.</h1>
      </div>

      <div className="contact-div">
        {loggedin && (
          <button onClick={handleEdit} className="contactEditIcon">
            {editIcon}
          </button>
        )}
        <h1 className="contact-message">{contactinfo.message}</h1>
        <div className="contact-name">{contactinfo.name}</div>
        <div className="contact-email">{contactinfo.email}</div>
        <div className="contact-phone">{phoneIcon} {contactinfo.phone}</div>

        <div className="socialsBox">
          <h2>Or check out my socials</h2>
            <div className="socialsLinks">
              {/* <p className="facebookIcon">{facebookIcon} Facebook name </p> */}
              {/* <span className="instagramIcon">{instagramIcon} Instagram name</span> */}
              <p className="linkedInIcon">{linkedInIcon} Efthymia Karatopouzi</p>
            </div>
        </div>

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

          <button className="ContactSaveBtn" type="submit">Save</button>
        </form>
      )}
    </section>
  );
}

export default Contact;