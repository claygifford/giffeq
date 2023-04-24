import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PageComponent from '../../components/page-component';
import AboutHeaderComponent from '../../components/about-header/about-header-component';
import debounce from 'lodash/debounce';
import router from 'next/router';
import styles from './about.module.css';

export default function About() {
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
        name: 'Choice 1',
        position: { top: 0, bottom: 0 },
      },
      {
        id: 'section2',
        name: 'Choice 2',
        position: { top: 0, bottom: 0 },
      },
      {
        id: 'section3',
        name: 'Choice 3',
        position: { top: 0, bottom: 0 },
      },
      {
        id: 'section4',
        name: 'Choice 4',
        position: { top: 0, bottom: 0 },
      },
      {
        id: 'section5',
        name: 'Choice 5',
        position: { top: 0, bottom: 0 },
      },
    ],
    []
  );

  useEffect(() => {
    const sectionRefs = [
      section1,
      section2,
      section3,
      section4,
      section5,
    ];
    
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
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleScroll = useCallback(
    (event) => {
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
    },
    [sections]
  );

  const debouncedChangeHandler = useMemo(() => {
    return debounce(handleScroll, 300);
  }, [handleScroll]);

  useEffect(() => {
    if (!window) return;

    window.addEventListener('scroll', debouncedChangeHandler);

    return () => {
      window.removeEventListener('scroll', debouncedChangeHandler);
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
        <div
          id="section1"
          ref={section1}
          className={`${styles.AboutSection} bg-red-400`}
        >
          <div className="flex flex-1 h-4/6 max-w-6xl lg:flex-row flex-col">
            <div className="flex flex-1 flex-col justify-center items-start rounded-lg pr-20 mx-10">
              <h1 className={styles.AboutHeader1}>
                Playlist words that describe the product
              </h1>
              <h2 className={styles.AboutHeader3}>
                Playlist words that describe the product
              </h2>
              <div>
                <button
                  onClick={() => router.push('/')}
                  className="bg-blue-200 flex whitespace-nowrap items-center group relative w-full justify-center rounded-full border border-transparent py-2 px-5 text-base font-medium text-gray-800 hover:bg-blue-300 hover:ring-blue-400 hover:ring-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Go to Playlist
                </button>
                <div>button 2</div>
              </div>
            </div>
            <div className="flex flex-1 bg-red-500 rounded-lg justify-center items-center mx-10">
              Section 1 Image
            </div>
          </div>
        </div>
        <div
          id="section2"
          ref={section2}
          className={`${styles.AboutSection} bg-blue-400`}
        >
          <div className="flex flex-1 h-4/6 max-w-6xl lg:flex-row flex-col">
            <div className="flex flex-1 bg-blue-500 rounded-lg justify-center items-center mx-10">
              Section 1 Image
            </div>
            <div className="flex flex-1 flex-col justify-center items-start rounded-lg pl-20 mx-10">
              <h1 className={styles.AboutHeader2}>
                Playlist words that describe the product
              </h1>
              <h2 className={styles.AboutHeader4}>
                Playlist words that describe the product
              </h2>
            </div>
          </div>
        </div>
        <div
          id="section3"
          ref={section3}
          className={`${styles.AboutSection} bg-green-400`}
        >
          <div className="flex flex-1 h-4/6 max-w-6xl lg:flex-row flex-col">
            <div className="flex flex-1 flex-col justify-center items-start rounded-lg pr-20 mx-10">
              <h1 className={styles.AboutHeader2}>
                Playlist words that describe the product
              </h1>
              <h2 className={styles.AboutHeader4}>
                Playlist words that describe the product
              </h2>
            </div>
            <div className="flex flex-1 bg-green-500 rounded-lg justify-center items-center mx-10">
              Section 3 Image
            </div>
          </div>
        </div>
        <div
          id="section4"
          ref={section4}
          className={`${styles.AboutSection} bg-orange-400`}
        >
          <div className="flex flex-1 h-4/6 max-w-6xl lg:flex-row flex-col">
            <div className="flex flex-1 bg-yellow-500 rounded-lg justify-center items-center mx-10">
              Section 4 Image
            </div>
            <div className="flex flex-1 flex-col justify-center items-start rounded-lg pl-20 mx-10">
              <h1 className={styles.AboutHeader2}>
                Playlist words that describe the product
              </h1>
              <h2 className={styles.AboutHeader4}>
                Playlist words that describe the product
              </h2>
            </div>
          </div>
        </div>
        <div
          id="section5"
          ref={section5}
          className={`${styles.AboutSection}`}
        >
          <div className="flex flex-1 h-4/6 max-w-6xl lg:flex-row flex-col">
            <div className="flex flex-1 flex-col justify-center items-start rounded-lg pr-20 mx-10">
              <h1 className={styles.AboutHeader2}>
                Playlist words that describe the product
              </h1>
              <h2 className={styles.AboutHeader4}>
                Playlist words that describe the product
              </h2>
            </div>
            <div className="flex flex-1 bg-purple-500 rounded-lg justify-center items-center mx-10">
              Section 5 Image
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
