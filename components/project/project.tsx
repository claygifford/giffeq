import styles from "./project.module.css";

export default function Project({ project }) {
  return (
    <div className={styles.ProjectContainer}>
      <div className={styles.ProjectTitle}>{project.title}</div>
      <img className={styles.ProjectImage} src={project.image} />
      {project.url && (
        <div className={styles.ProjectLinkContainer}>
          Url
          <a className={styles.ProjectLink} href={project.url}>
            {project.url}
          </a>
        </div>
      )}
      {project.github && (
        <div className={styles.ProjectLinkContainer}>
          Github
          <a className={styles.ProjectLink} href={project.github}>
            {project.github}
          </a>
        </div>
      )}
    </div>
  );
}
