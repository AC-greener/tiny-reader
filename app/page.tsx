"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import ePub from 'epubjs'
import { ChevronLeft, ChevronRight, Plus, Minus, Settings, Menu } from 'lucide-react'
import TableOfContents from '@/components/Toc'
import Header from '@/components/Header'
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
    <div className="flex h-screen w-full">
      <TableOfContents
        toc={toc}
        currentChapter={currentChapter}
        renderChapter={renderChapter}
        toggleToc={toggleToc}
        isTocVisible={isTocVisible}
      />
      <div className="flex flex-col flex-grow min-w-0">
        <Header
          toggleToc={toggleToc}
          isTocVisible={isTocVisible}
          fontSize={fontSize}
          changeFontSize={changeFontSize}
        />
        <main className="flex-1 overflow-auto flex justify-center">
          <div ref={readerContentRef} className="h-full w-full max-w-6xl px-4"></div>
        </main>
      </div>
    </div>
  )
}
