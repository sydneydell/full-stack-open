/* eslint-disable no-unused-vars */
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

// Component to display a notification when a person is added
const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={type === 'error' ? 'error' : 'success'}>
      {message}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newSearch, setNewSearch] = useState('');
  const [notification, setNotification] = useState({ message: null, type: null });

  useEffect(() => {
    personService
      .getAll()
      .then(initialNames => {
        setPersons(initialNames);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const nameObject = {
      name: newName,
      number: newNumber,
    };

    const personExists = persons.find(person => person.name === newName);

    if (personExists) {
      if (window.confirm(`${nameObject.name} is already added to the phonebook, replace the old number with a new one?`)) {
        personService
          .update(personExists.id, nameObject)
          .then(updatedPerson => {
            setPersons(persons.map(person => 
              person.id !== personExists.id ? person : updatedPerson
            ));
            setNewName('');
            setNewNumber('');
            setNotification({ message: `Updated ${nameObject.name}'s phone number`, type: 'success' });
            setTimeout(() => {
              setNotification({ message: null, type: null });
            }, 5000);
          })
          .catch(error => {
            // Handle validation error or other backend errors
            const errorMessage = error.response?.data?.error || 'Failed to update the entry';
            setNotification({ message: errorMessage, type: 'error' });
            setTimeout(() => {
                setNotification({ message: null, type: null });
            }, 5000);
          });
      }
    } else {
      personService
        .create(nameObject)
        .then(returnedName => {
          setPersons(persons.concat(returnedName));
          setNewName('');
          setNewNumber('');
          setNotification({ message: `Added ${nameObject.name}`, type: 'success' });
          setTimeout(() => {
            setNotification({ message: null, type: null });
          }, 5000);
        });
    }
  };

  const deletePerson = id => {
    const person = persons.find(n => n.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setNotification({ message: `Deleted ${person.name}`, type: 'success' });
          setTimeout(() => {
            setNotification({ message: null, type: null });
          }, 5000);
        })
        .catch(error => {
          setNotification({ message: `Failed to delete ${person.name}`, type: 'error' });
          setTimeout(() => {
            setNotification({ message: null, type: null });
          }, 5000);
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearch = (event) => {
    setNewSearch(event.target.value);
  };

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(newSearch.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter newSearch={newSearch} handleSearch={handleSearch} />

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
  );
};

export default App;
