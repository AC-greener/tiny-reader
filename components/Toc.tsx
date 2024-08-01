// TOC组件
import { Button } from "@/components/ui/button"
import {  Menu } from 'lucide-react'
import Link from "next/link"


const TableOfContents = ({ toc, currentChapter, renderChapter, toggleToc, isTocVisible }) => (
  <aside className={`
    h-full bg-muted/40 border-r transition-all duration-300 ease-in-out overflow-hidden
    ${isTocVisible ? 'w-[280px]' : 'w-0'}
  `}>
    <div className="h-full w-[280px]">
      <div className="flex h-full flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Table of Contents</h2>
          <Button variant="ghost" size="icon" onClick={toggleToc}>
            <Menu className="h-6 w-6" />
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
  </aside>
)

export default TableOfContents