/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('') 
  const [showAll, setShowAll] = useState(true)

  // By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.
  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }
  
  // the first parameter is the effect function itself
  // the second parameter is used to speciy how often the effect is run 
  // if the second parameter is an empty array, the effect is only run along with the first render of the component
  useEffect(hook, [])

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: String(notes.length + 1),
    }
  
    setNotes(notes.concat(noteObject))
    setNewNote('')
  }

  // assigned a piece of the App component's state as the value attribute of the input element
  // called every time a change occurs in the input element
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  // conditional operator: const result = condition ? val1 : val2
  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote} 
          onChange={handleNoteChange} // registering an event handler
        />
        <button type="submit">save</button>
      </form>  
    </div>
  )
}

export default App 