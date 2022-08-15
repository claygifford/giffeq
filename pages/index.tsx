import styles from "./home.module.css";

export default function Home() {
  return (
    <div>
      <h1 className="title">About Me</h1>

      <div className={styles.Box}>
        <h2>Hello there and welcome to my site</h2>
        <div className={styles.ProfileContainer}>
          <img className={styles.ProfilePic} src="/img/profile.png" />
          <h2>My name is Clayton Gifford</h2>

          <div>
            <div>
              <div>
                I live in Sylvania, Ohio. I have been a professional software
                engineer for 20 years.
              </div>
              <div>
                I enjoy playing tennis and spending time with my wife and kids.
              </div>
              <div>
                My passion is software development. I am currently developing a
                Unreal video game in my free time.
              </div>
              <div>I hope you like my site.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
