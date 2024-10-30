const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

// Custom morgan token for logging request body
morgan.token('body', (req) => JSON.stringify(req.body))

// Use morgan with custom format to include method, URL, status, and body if it exists
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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
  
// Delete a single phonebook entry
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})

// Add new phonebook entries by making HTTP POST request
const generateId = () => {
    return Math.floor(Math.random() * 10000)
}

const nameExists = (name) => {
    return persons.some(person => person.name === name)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({error: 'Name Missing'})
    } else if (!body.number) {
        return response.status(400).json({error: 'Number Missing'})
    } else if (nameExists(body.name)) {
        return response.status(400).json({error: 'Name must be unique'})
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(newPerson)
    response.json(newPerson)
})

// Handle unknown endpoints
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

// Show that the port is running correctly
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})