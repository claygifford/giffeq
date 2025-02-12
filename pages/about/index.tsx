import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PageComponent from "../../components/page-component";
import AboutHeaderComponent from "../../components/about-header/about-header-component";
import debounce from "lodash/debounce";
import router from "next/router";
import styles from "./about.module.css";
import { useAuth } from "../../lib/context/auth-context";
import ThumbsUpDogComponent from './../../components/dogs/thumbs-up-dog-component';
import ThumbsDownDogComponent from "../../components/dogs/thumbs-down-dog-component";
import VibingDogComponent from "../../components/dogs/vibing-dog-component";

export default function About() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const section1 = useRef(null);
  const section2 = useRef(null);
  const section3 = useRef(null);
  const section4 = useRef(null);
  const section5 = useRef(null);

  const sections = useMemo(
    () => [
      {
        id: 'section1',
        name: 'Music Discovery',
        position: { top: 0, bottom: 0 },
      },
      {
        id: 'section2',
        name: 'Explore New Music',
        position: { top: 0, bottom: 0 },
      },
      {
        id: 'section3',
        name: 'Featured Playlists',
        position: { top: 0, bottom: 0 },
      },
      {
        id: 'section4',
        name: 'The Stack',
        position: { top: 0, bottom: 0 },
      },
      {
        id: 'section5',
        name: 'About Me',
        position: { top: 0, bottom: 0 },
      },
    ],
    []
  );

  useEffect(() => {
    const sectionRefs = [section1, section2, section3, section4, section5];

    for (var i = 0; i < sectionRefs.length; i++) {
      const position = sections[i].position;
      position.top = sectionRefs[i].current.offsetTop;
      position.bottom = position.top + sectionRefs[i].current.offsetHeight;
    }
  }, [sections]);

  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const onSelectSection = (section) => {
    setSelectedSection(section);
    if (document) {
      const element = document.getElementById(section.id);
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleScroll = useCallback(() => {
    const scrollTop = Math.round(window.pageYOffset);
    setIsScrolled(scrollTop > 1);
    for (var i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (
        section.position.top <= scrollTop &&
        section.position.bottom >= scrollTop
      ) {
        setSelectedSection(section);
      }
    }
  }, [sections]);

  const debouncedChangeHandler = useMemo(() => {
    return debounce(handleScroll, 300);
  }, [handleScroll]);

  useEffect(() => {
    if (!window) return;

    window.addEventListener("scroll", debouncedChangeHandler);

    return () => {
      window.removeEventListener("scroll", debouncedChangeHandler);
    };
  }, [debouncedChangeHandler]);

  return (
    <PageComponent>
      <AboutHeaderComponent
        sections={sections}
        isScrolled={isScrolled}
        onSelectSection={onSelectSection}
        selectedSection={selectedSection}
      ></AboutHeaderComponent>
      <div className="flex-1 w-full">
        <div id="section1" ref={section1} className={`${styles.AboutSection}`}>
          <div className="flex flex-1 h-4/6 max-w-6xl lg:flex-row flex-col">
            <div className={`${styles.AboutSectionTextLeft}`}>
              <h1 className={styles.AboutHeader1}>Likeness AI</h1>
              <h2 className={styles.AboutHeader3}>
                A personal project discovering music that uses Likeness AI for
                music discovery. Sign up, Login, and see if I can match songs.
              </h2>
              <div className="pt-5">
                {user ? (
                  <button
                    aria-label="Go to Playlist"
                    onClick={() => router.push('/')}
                    className="bg-blue-200 flex whitespace-nowrap items-center group relative w-full justify-center rounded-full border border-transparent py-5 px-10 text-xl font-medium text-gray-800 hover:bg-blue-100 hover:ring-blue-300 hover:ring-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Go to Playlist
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      aria-label="Sign up"
                      onClick={() => router.push('/about/signup')}
                      className="flex whitespace-nowrap items-center group relative w-full justify-center rounded-full border border-transparent py-5 px-10 text-xl font-medium text-gray-800 hover:bg-blue-100 hover:ring-blue-300 hover:ring-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      Sign up
                    </button>
                    <button
                      aria-label="Log in"
                      onClick={() => router.push('/about/login')}
                      className="bg-blue-200 flex whitespace-nowrap items-center group relative w-full justify-center rounded-full border border-transparent py-5 px-10 text-xl font-medium text-gray-800 hover:bg-blue-100 hover:ring-blue-300 hover:ring-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      Log in
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div
              className={`${styles.AboutSubsection} ${styles.Traveler} bg-red-500`}
            >
              <div>Playlist</div>
              <VibingDogComponent></VibingDogComponent>
            </div>
          </div>
        </div>
        <div
          id="section2"
          ref={section2}
          className={`${styles.AboutSection} bg-blue-400`}
        >
          <div className="flex flex-1 h-4/6 max-w-6xl lg:flex-row flex-col">
            <div
              className={`${styles.AboutSubsection} ${styles.Selfish} bg-blue-500`}
            >
              <div>Upvote</div>
              <ThumbsUpDogComponent></ThumbsUpDogComponent>
              <div>Downvote</div>
              <ThumbsDownDogComponent></ThumbsDownDogComponent>
              {/* <div className={styles.AboutThumbsSection}>
                <div className={styles.AboutThumbsUp}>
                  <ThumbsUpDogComponent></ThumbsUpDogComponent>
                </div>
                <div className={styles.AboutThumbsDown}>
                  <ThumbsDownDogComponent></ThumbsDownDogComponent>
                </div>
              </div> */}
            </div>
            <div className={`${styles.AboutSectionTextRight}`}>
              <h1 className={styles.AboutHeader2}>Explore New Music</h1>
              <h2 className={styles.AboutHeader5}>
                After a song plays, users could easily upvote or downvote 
                songs to let the system know if they like it or not
              </h2>
            </div>
          </div>
        </div>
        <div id="section3" ref={section3} className={`${styles.AboutSection}`}>
          <div className="flex flex-1 h-4/6 max-w-6xl lg:flex-row flex-col">
            <div className={`${styles.AboutSectionTextLeft}`}>
              <h1 className={styles.AboutHeader2}>Featured Playlists</h1>
              <h2 className={styles.AboutHeader4}>
                Curated playlists to predict more specific tracks or even dive
                into similar, lesser-known artists and tracks that a loved one
                might not know about but would be a perfect fit.
              </h2>
            </div>
            <div
              className={`${styles.AboutSubsection} ${styles.Traveler} bg-green-500`}
            >
              <div>Section 3</div>
              <div>Image</div>
            </div>
          </div>
        </div>
        <div
          id="section4"
          ref={section4}
          className={`${styles.AboutSection} bg-yellow-200`}
        >
          <div className="flex flex-1 h-4/6 max-w-6xl lg:flex-row flex-col">
            <div
              className={`${styles.AboutSubsection} ${styles.Selfish} bg-yellow-500`}
            >
              <div>Client</div>
              <div>Server</div>
              <div>Image</div>
            </div>
            <div className={`${styles.AboutSectionTextRight}`}>
              <h1 className={styles.AboutHeader2}>The Stack</h1>
              <h2 className={styles.AboutHeader4}>
                Playlist words that describe the product
              </h2>
            </div>
          </div>
        </div>
        <div id="section5" ref={section5} className={`${styles.AboutSection}`}>
          <div className="flex flex-1 h-4/6 max-w-6xl lg:flex-row flex-col">
            <div className={`${styles.AboutSectionTextLeft}`}>
              <h1 className={styles.AboutHeader2}>About Me</h1>
              <h2 className={styles.AboutHeader4}>
                Software developer, father. I decided to make this passion
                project based on my take on AI. Enough said, login already.
              </h2>
            </div>
            <div
              className={`${styles.AboutSubsection} ${styles.Traveler} bg-purple-500`}
            >
              <div>Section 5</div>
              <div>Image</div>
            </div>
          </div>
        </div>
        <div className="bg-blue-200 h-1/5 flex justify-center items-center">
          Footer
        </div>
      </div>
    </PageComponent>
  );
}
