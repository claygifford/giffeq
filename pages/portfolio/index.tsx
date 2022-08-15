import React, { useState } from "react";
import Project from "../../components/project/project";
import styles from "./portfolio.module.css";

const projects = [
  {
    title: "Clay Gifford",
    image: "./img/profile-1.png",
    url: "http://www.claygifford.com/",
    github: "https://github.com/claygifford/crowd-strike",
  },
  {
    title: "Sky Specs",
    image: "./img/profile-2.png",
    url: "https://github.com/claygifford/sky-specs",
    github: "https://github.com/claygifford/sky-specs",
  },
  {
    title: "Toni Gerber",
    image: "./img/profile-3.png",
    github: "https://github.com/claygifford/toni-gerber",
  },
  {
    title: "Senwell Advisors",
    image: "./img/profile-4.png",
    url: "https://senwelladvisors.com/",
  },
  {
    title: "Bed License Exchange",
    image: "./img/profile-5.png",
    github: "https://github.com/claygifford/BLE",
  },
  {
    title: "Video Game",
    image: "./img/profile-6.png",
    github: "https://github.com/claygifford/video-game",
  },
];

export default function Portfolio() {
  const [currentProject, setProject] = useState(projects[0]);

  return (
    <React.Fragment>
      <h1 className="title">Porfolio</h1>
      <div className={styles.Box}>
        <div className={styles.ProjectContainer}>
          {projects.map((project, i) => {
            return (
              <div key={project.title} className={styles.PortfolioLink}>
                <div
                  onClick={() => setProject(project)}
                  className={`${styles.NavigationLink} ${
                    currentProject == project ? styles.NavigationActive : ""
                  }`}
                >
                  {project.title}
                </div>
                {i + 1 !== projects.length ? (
                  <div className={styles.PortfolioDivider}>|</div>
                ) : undefined}
              </div>
            );
          })}
        </div>
        <Project project={currentProject} />
      </div>
    </React.Fragment>
  );
}
