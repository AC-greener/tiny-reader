"use client";
import React, { useState, useEffect, useRef } from 'react';
import ePub from 'epubjs';
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';

const EbookReader = () => {
  const [book, setBook] = useState(null);
  const [toc, setToc] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [isTocVisible, setIsTocVisible] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const renditionRef = useRef(null);
  const readerContentRef = useRef(null);

  useEffect(() => {
    const initBook = async () => {
      const newBook = ePub('/The-Coding-Career-Handbook.epub');
      setBook(newBook);

      newBook.loaded.navigation.then(nav => {
        setToc(nav.toc);
        if (nav.toc.length > 0) {
          setCurrentChapter(nav.toc[0]);
        }
      });

      await newBook.ready;
      
      const rendition = newBook.renderTo(readerContentRef.current, {
        width: "100%",
        height: "100%",
        flow: "scrolled-doc",
        manager: "continuous"
      });
      renditionRef.current = rendition;

      rendition.display();
      applyFontSize(rendition);
    };

    initBook();

    return () => {
      if (renditionRef.current) {
        renditionRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (renditionRef.current) {
        renditionRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderChapter = async (chapter) => {
    if (book && chapter && renditionRef.current) {
      await renditionRef.current.display(chapter.href);
      setCurrentChapter(chapter);
    }
  };

  const toggleToc = () => {
    setIsTocVisible(!isTocVisible);
  };

  const changeFontSize = (delta) => {
    setFontSize(prevSize => {
      const newSize = prevSize + delta;
      applyFontSize(renditionRef.current, newSize);
      return newSize;
    });
  };

  const applyFontSize = (rendition = null, size = fontSize) => {
    if (rendition) {
      rendition.themes.fontSize(`${size}px`);
    }
  };

  return (
    <div className="flex h-screen">
      {/* 左侧目录 */}
      <div className={`${isTocVisible ? 'w-1/4' : 'w-0'} transition-all duration-300 overflow-hidden border-r`}>
        <div className="p-4 h-full overflow-auto">
          <h2 className="text-xl font-bold mb-4">目录</h2>
          <ul>
            {toc.map((chapter, index) => (
              <li 
                key={index} 
                className={`cursor-pointer p-2 hover:bg-gray-100 ${currentChapter === chapter ? 'bg-gray-200' : ''}`}
                onClick={() => renderChapter(chapter)}
              >
                {chapter.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 右侧内容 */}
      <div className={`${isTocVisible ? 'w-3/4' : 'w-full'} transition-all duration-300 flex flex-col`}>
        <div className="flex justify-between items-center p-4 border-b">
          <button onClick={toggleToc} className="p-2 rounded hover:bg-gray-200">
            {isTocVisible ? <ChevronLeft /> : <ChevronRight />}
          </button>
          <div className="flex items-center space-x-4">
            <button onClick={() => changeFontSize(-1)} className="p-2 rounded hover:bg-gray-200">
              <Minus size={20} />
            </button>
            <span>{fontSize}px</span>
            <button onClick={() => changeFontSize(1)} className="p-2 rounded hover:bg-gray-200">
              <Plus size={20} />
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-auto p-4">
          <div ref={readerContentRef} className="h-full"></div>
        </div>
      </div>
    </div>
  );
};

export default EbookReader;