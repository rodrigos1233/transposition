import React, { useState } from 'react'
import logo from './logo.svg'
import './App.scss'
import SimpleTransposition from './pages/simple-transposition'
import Header from './header'
import { Note } from './utils/notes'

function App() {
    const [selectedNotation, setSelectedNotation]: [keyof Note, any] =
        useState('romance')

    return (
        <div className="App">
            <Header
                selectedNotation={selectedNotation}
                setSelectedNotation={setSelectedNotation}
            />
            <SimpleTransposition selectedNotation={selectedNotation} />
        </div>
    )
}

export default App
