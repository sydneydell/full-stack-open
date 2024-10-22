/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import noteService from './services/notes'
import Note from './components/Note'


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('') 
  const [showAll, setShowAll] = useState(true)

  // By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.
  const hook = () => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
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
    }
  
    // Object is sent to the server using the post method
    noteService
    .create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }

  // assigned a piece of the App component's state as the value attribute of the input element
  // called every time a change occurs in the input element
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    // In practice, { ...note } creates a new object with copies of all the properties from the note object.
    const changedNote = { ...note, important: !note.important }
    noteService
    .update(id, changedNote)
    .then(returnedNote => {
      setNotes(notes.map(note => note.id === id ? returnedNote : note))
    })
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
          <Note 
            key={note.id} 
            note={note}           
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
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