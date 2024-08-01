"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ePub from 'epubjs'
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react'

export default function CombinedEbookReader() {
  const [book, setBook] = useState(null)
  const [toc, setToc] = useState([])
  const [currentChapter, setCurrentChapter] = useState(null)
  const [isTocVisible, setIsTocVisible] = useState(true)
  const [fontSize, setFontSize] = useState(16)
  const renditionRef = useRef(null)
  const readerContentRef = useRef(null)

  useEffect(() => {
    const initBook = async () => {
      const newBook = ePub('/The-Coding-Career-Handbook.epub')
      setBook(newBook)

      newBook.loaded.navigation.then(nav => {
        setToc(nav.toc)
        if (nav.toc.length > 0) {
          setCurrentChapter(nav.toc[0])
        }
      })

      await newBook.ready
      
      const rendition = newBook.renderTo(readerContentRef.current, {
        width: "100%",
        height: "100%",
        flow: "scrolled-doc",
        manager: "continuous"
      })
      renditionRef.current = rendition

      rendition.display()
      applyFontSize(rendition)
    }

    initBook()

    return () => {
      if (renditionRef.current) {
        renditionRef.current.destroy()
      }
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (renditionRef.current) {
        renditionRef.current.resize()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const renderChapter = async (chapter) => {
    if (book && chapter && renditionRef.current) {
      await renditionRef.current.display(chapter.href)
      setCurrentChapter(chapter)
    }
  }

  const toggleToc = () => {
    setIsTocVisible(prev => !prev)
    if (renditionRef.current) {
      setTimeout(() => {
        renditionRef.current.resize()
      }, 300) // Wait for the transition to complete
    }
  }

  const changeFontSize = (delta) => {
    setFontSize(prevSize => {
      const newSize = prevSize + delta
      applyFontSize(renditionRef.current, newSize)
      return newSize
    })
  }

  const applyFontSize = (rendition = null, size = fontSize) => {
    if (rendition) {
      rendition.themes.fontSize(`${size}px`)
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div 
        className={`
          fixed left-0 top-0 bottom-0 z-30 w-[280px] 
          bg-muted/40 border-r transition-transform duration-300 ease-in-out
          ${isTocVisible ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Table of Contents</h2>
            <Button variant="ghost" size="icon" onClick={toggleToc}>
              <MenuIcon className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            <nav className="space-y-2">
              {toc.map((chapter, index) => (
                <Link
                  key={index}
                  href="#"
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    currentChapter === chapter ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => renderChapter(chapter)}
                  prefetch={false}
                >
                  {chapter.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className={`flex flex-col flex-grow transition-all duration-300 ${isTocVisible ? 'ml-[280px]' : 'ml-0'}`}>
        <header className="flex items-center justify-between border-b bg-muted/40 px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleToc}>
              {isTocVisible ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
            </Button>
            <div className="text-lg font-semibold">The Coding Career Handbook</div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => changeFontSize(-1)}>
              <Minus className="h-6 w-6" />
            </Button>
            <span>{fontSize}px</span>
            <Button variant="ghost" size="icon" onClick={() => changeFontSize(1)}>
              <Plus className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <SettingsIcon className="h-6 w-6" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div ref={readerContentRef} className="h-full w-full"></div>
        </main>
      </div>
    </div>
  )
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}