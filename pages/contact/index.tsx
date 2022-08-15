import React, { useState } from "react";
import styles from "./contact.module.css";

export default function Contact() {
  function validateEmail(email) {
    var re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { name, email, message } = formState;
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(e) {
    if (e.target.name === "email") {
      const isValid = validateEmail(e.target.value);
      console.log(isValid);
      // isValid conditional statement
      if (!isValid) {
        setErrorMessage("Your email is invalid.");
      } else {
        setErrorMessage("");
      }
    } else {
      if (!e.target.value.length) {
        setErrorMessage(`${e.target.name} is required.`);
      } else {
        setErrorMessage("");
      }
    }

    if (!errorMessage) {
      setFormState({ ...formState, [e.target.name]: e.target.value });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formState);
  }

  return (
    <React.Fragment>
      <h1 className="title">Contact Me</h1>

      <div className={styles.Box}>
        <h2>Contact</h2>
        <form id="contact-form" onSubmit={handleSubmit}>
          <div>
            <label className={styles.ContactLabel} htmlFor="name">
              Name:
            </label>
            <input
              className={styles.ContactInput}
              type="text"
              defaultValue={name}
              onBlur={handleChange}
              name="name"
            />
          </div>
          <div>
            <label className={styles.ContactLabel} htmlFor="email">
              Email address:
            </label>
            <input
              className={styles.ContactInput}
              type="email"
              defaultValue={email}
              name="email"
              onBlur={handleChange}
            />
          </div>
          <div>
            <label className={styles.ContactLabel} htmlFor="message">
              Message:
            </label>
            <textarea
              className={styles.ContactInput}
              name="message"
              defaultValue={message}
              onBlur={handleChange}
              rows="5"
            />
          </div>
          {errorMessage && (
            <div>
              <p className="error-text">{errorMessage}</p>
            </div>
          )}
          <button type="submit" className={styles.DownloadButton}>
            Submit
          </button>
        </form>
      </div>
    </React.Fragment>
  );
}
