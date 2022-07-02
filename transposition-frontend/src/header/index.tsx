import React from 'react'
import NotationSelector from './NotationSelector'
import { Note } from '../utils/notes'

function Header({
    selectedNotation,
    setSelectedNotation,
}: {
    selectedNotation: keyof Note
    setSelectedNotation: any
}) {
    return (
        <header className="header">
            <NotationSelector
                selectedNotation={selectedNotation}
                setSelectedNotation={setSelectedNotation}
            />
        </header>
    )
}

export default Header
