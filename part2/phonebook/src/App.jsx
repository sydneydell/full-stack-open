/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import personService from './services/persons'

// Component for filtering out phonebook entries by name
const Filter = ({ newSearch, handleSearch }) => (
  <div>
    filter shown with <input value={newSearch} onChange={handleSearch} />
  </div>
);

// Component for the form to add a new person and number
const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

// Component to display the list of persons in the phonebook
const Persons = ({ personsToShow, deletePerson }) => (
  <ul>
    {personsToShow.map(person => (
      <li key={person.id}>
        {person.name} {person.number}
        <button onClick={() => deletePerson(person.id)}>delete</button>
      </li>
    ))}
  </ul>
);

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialNames => {
        setPersons(initialNames)
      })
  }, [])

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

      personService
        .create(nameObject)
        .then(returnedName => {
          setPersons(persons.concat(returnedName))
          setNewName('')
          setNewNumber('')
      })
    }
  }

  const deletePerson = id => {
    const person = persons.find(n => n.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      const changedPerson = { ...person}
      personService
        .remove(changedPerson.id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));  // Remove person from state
        })
        .catch(error => {
          console.error('Failed to delete person:', error);
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setNewSearch(event.target.value)
  }

  // Filter persons based on the search input
  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(newSearch.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newSearch={newSearch} handleSearch={handleSearch}/>

      <h2>Add a new</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App