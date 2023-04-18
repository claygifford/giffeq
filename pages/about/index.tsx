import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PageComponent from '../../components/page-component';
import AboutHeaderComponent from '../../components/about-header/about-header-component';
import debounce from 'lodash.debounce';

export default function About() {
  const pageRef = useRef(null);
  const [node, setNode] = useState<HTMLDivElement>();
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
    const sectionRefs = [section1, section2, section3, section4, section5];
    let top = 0,
      bottom = 0;
    for (var i = 0; i < sectionRefs.length; i++) {
      const position = sections[i].position;
      position.top = top;
      position.bottom = bottom =
        sectionRefs[i].current.getBoundingClientRect().height + top;
      top = bottom;
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
      const target = event.target;
      setIsScrolled(target.scrollTop > 1);
      for (var i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (
          section.position.top <= target.scrollTop &&
          section.position.bottom >= target.scrollTop
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
    if (!node) return;

    node.addEventListener('scroll', debouncedChangeHandler);

    return () => {
      node.removeEventListener('scroll', debouncedChangeHandler);
    };
  }, [node, debouncedChangeHandler]);

  useEffect(() => {
    if (pageRef && pageRef.current) {
      setNode(pageRef.current);
    }
  }, [pageRef]);

  return (
    <PageComponent innerRef={pageRef}>
      <AboutHeaderComponent
        sections={sections}
        isScrolled={isScrolled}
        onSelectSection={onSelectSection}
        selectedSection={selectedSection}
      ></AboutHeaderComponent>
      <div className="bg-orange-500 flex-1 flex-col w-full">
        <div
          id="section1"
          ref={section1}
          className="bg-red-500 h-5/6 flex justify-center items-center"
        >
          <div className="flex">Section 1</div>
        </div>
        <div
          id="section2"
          ref={section2}
          className="bg-blue-500 h-5/6 flex justify-center items-center"
        >
          <div className="flex">Section 2</div>
        </div>
        <div
          id="section3"
          ref={section3}
          className="bg-green-500 h-5/6 flex justify-center items-center"
        >
          <div>Section 3</div>
        </div>
        <div
          id="section4"
          ref={section4}
          className="bg-yellow-500 h-5/6 flex justify-center items-center"
        >
          <div>Section 4</div>
        </div>
        <div
          id="section5"
          ref={section5}
          className="bg-purple-500 h-5/6 flex justify-center items-center"
        >
          <div>Section 5</div>
        </div>
        <div className="bg-indigo-500 h-1/5 flex justify-center items-center">
          Footer
        </div>
      </div>
    </PageComponent>
  );
}
