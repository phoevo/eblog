import "../styles/Footer.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faLinkedin} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

function Footer() {

  const linkedInIcon = <FontAwesomeIcon icon={faLinkedin} size="xl"/>

  return(
    <section className="footer-section">
      <div className="footer-message">
        <a className="linkedInIcon"
        href="https://www.linkedin.com/in/efthymia-karatopouzi-186868209/"
        target="_blank">
        {linkedInIcon} Efthymia Karatopouzi</a>
        <p>Ikigai Vitality</p>
        <Link to="/contact" className="contactLink">
        <div>Contact me</div>
        </Link>
      </div>
    </section>
  )

}

export default Footer