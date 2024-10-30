const express = require('express')
const app = express()

// Hardcoded list of phonebook entries
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Title of the API
app.get('/', (request, response) => {
    response.send('<h1>Phonebook API</h1>')
})

// Show that the port is running correctly
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

  
// Display a hardcoded list of phonebook entries
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Show the number of entries in the phonebook and the time the request was made
app.get('/info', (request, response) => {
    const numPersons = persons.length
    const currentTime = new Date()

    response.send(`
        <p>Phonebook has info for ${numPersons} people</p>
        <p>${currentTime}</p>
    `)
})

// Display the information for a single phonebook entry
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})
  
