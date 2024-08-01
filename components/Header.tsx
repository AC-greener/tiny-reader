import React from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Minus, Settings } from 'lucide-react'

interface HeaderProps {
  toggleToc: () => void
  isTocVisible: boolean
  fontSize: number
  changeFontSize: (delta: number) => void
}

const Header: React.FC<HeaderProps> = ({ toggleToc, isTocVisible, fontSize, changeFontSize }) => (
  <header className="flex items-center justify-between border-b bg-muted/40 px-6 py-4">
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={toggleToc}>
        {isTocVisible ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
      </Button>
      <div className="text-lg font-semibold truncate">The Coding Career Handbook</div>
    </div>
    <div className="flex items-center gap-4 ml-auto">
      <Button variant="ghost" size="icon" onClick={() => changeFontSize(-1)}>
        <Minus className="h-6 w-6" />
      </Button>
      <span>{fontSize}px</span>
      <Button variant="ghost" size="icon" onClick={() => changeFontSize(1)}>
        <Plus className="h-6 w-6" />
      </Button>
      <Button variant="ghost" size="icon">
        <Settings className="h-6 w-6" />
      </Button>
    </div>
  </header>
)

export default Header