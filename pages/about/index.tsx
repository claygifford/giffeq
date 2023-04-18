import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PageComponent from '../../components/page-component';
import AboutHeaderComponent from '../../components/about-header/about-header-component';
import debounce from 'lodash.debounce';

export default function About() {  
  const myRef = useRef(null);
  const [node, setNode] = useState<HTMLDivElement>();
  
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const section1 = useRef(null);

  const sections = [
    { name: 'Choice 1' },
    { name: 'Choice 2' },
    { name: 'Choice 3' },
    { name: 'Choice 4' },
    { name: 'Choice 5' },
  ];

  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const onSelectSection = (section) => {
    console.log(`section ${section.name}`);
    setSelectedSection(section);
  };
  const handleScroll = useCallback(
    (event) => {
      //setScrollTop(window.scrollY);
      const target = event.target;
      console.log(`yop there! ${target.scrollTop} ${isScrolled}`);

      setIsScrolled(target.scrollTop > 1);
    },
    [isScrolled]
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
    if (myRef && myRef.current) {
      setNode(myRef.current);
      console.log('yes sir?');
    }
  }, [myRef]);

  return (
    <PageComponent innerRef={myRef}>
      <AboutHeaderComponent
        sections={sections}
        isScrolled={isScrolled}
        onSelectSection={onSelectSection}
        selectedSection={selectedSection}
      ></AboutHeaderComponent>
      <div className="bg-orange-500 flex-1 flex-col w-full">
        <div className="bg-red-500 h-5/6 flex justify-center items-center">
          <div className="flex">Section 1</div>
        </div>
        <div className="bg-blue-500 h-5/6 flex justify-center items-center">
          <div className="flex">Section 2</div>
        </div>
        <div className="bg-green-500 h-5/6 flex justify-center items-center">
          <div>Section 3</div>
        </div>
        <div className="bg-yellow-500 h-5/6 flex justify-center items-center">
          <div>Section 4</div>
        </div>
        <div className="bg-purple-500 h-5/6 flex justify-center items-center">
          <div>Section 5</div>
        </div>
        <div className="bg-indigo-500 h-20 flex justify-center items-center">
          Footer
        </div>
      </div>
    </PageComponent>
  );
}
