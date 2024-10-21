import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([ { name: 'Arto Hellas', number: '040-1234567' } ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    
    const personExists = persons.some(person => person.name === newName)

    if (personExists) {
      alert(`${newName} is already in the phonebook`)
    } else {
      const nameObject = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(nameObject))
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={handleNameChange}/></div>
        <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
        <div> <button type="submit">add</button></div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map(person => <li key={person.id}>{person.name} {person.number}</li>)}
      </ul>
    </div>
  )
}

export default App