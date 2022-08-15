import React from "react";
import styles from "./resume.module.css";

export default function Resume() {
  return (
    <React.Fragment>
      <h1 className="title">Resume</h1>

      <div className={styles.Box}>
        <h2>Skills</h2>
        <div>
          <div>
            <span className={styles.Important}>Languages:</span> Typescript,
            Javascript, Xaml, HTML 5, CSS3, C, C++, C#, .NET 4.0, 5.0, WPF,
            SilverLight, Java, Flash, XML, PHP, and SharePoint
          </div>
          <div>
            <span className={styles.Important}>Databases:</span> SQL 2008 R2,
            Informix, MySQL, DB2, Oracle, Sybase, and Access
          </div>
          <div>
            <span className={styles.Important}>Software Packages:</span>{" "}
            Expression Blend, Photoshop, AutoCAD, OpenGL, Matlab, Milkshape 3d,
            and WebSphere
          </div>
          <div>
            <span className={styles.Important}>Operating Systems:</span> Mac OS
            X, UNIX, AIX, HP, Windows, and DOS Mobile: Windows App Store, WinRT,
            Surface, Windows Phone
          </div>
          <div>
            <span className={styles.Important}>Javascript:</span> React, Angular
            11, Typescript, Babel, Webpack, Gulp, D3.js, AngularJS, Backbone.js,
            Handlebars.js, jQuery, ExtJs, Dojo, script.aculo.us, JavaScript
            Toolkits, ember, Node.js, knockout, three.js, WebGL
          </div>
        </div>
      </div>
      <div className={styles.DownloadSection}>
        <h2>Download my resume</h2>
        <div className={styles.DownloadContainer}>
          <a
            className={styles.DownloadButton}
            href="./files/Resume.docx"
            download="Clayton_Gifford_Resume"
          >
            doc
          </a>
          <a
            className={styles.DownloadButton}
            href="./files/Resume.pdf"
            download="Clayton_Gifford_Resume"
          >
            pdf
          </a>
        </div>
      </div>
    </React.Fragment>
  );
}