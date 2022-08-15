import styles from "./footer.module.css";

const Footer = () => (
  <div className={styles.Footer}>
    Clayton Gifford |{" "}
    <a className={styles.FooterLink} href="https://github.com/claygifford">
      <img className={styles.GitHubLogo} src="/img/GitHub_Logo.png" />
    </a>{" "}
    |{" "}
    <a
      className={styles.FooterLink}
      href="https://www.linkedin.com/in/clayton-gifford-8039a03a"
    >
      <img className={styles.LinkedInLogo} src="/img/LI-Logo.png" />
    </a>
  </div>
);

export default Footer;
