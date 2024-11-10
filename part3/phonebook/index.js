const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

// Custom morgan token for logging request body
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Title of the API
app.get('/', (request, response) => {
    response.send('<h1>Phonebook API</h1>')
})

// Display a hardcoded list of phonebook entries
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// Show the number of entries in the phonebook and the time the request was made
app.get('/info', (request, response) => {
    Person.countDocuments({})
        .then(numPersons => {
            const currentTime = new Date()
            response.send(`
                <p>Phonebook has info for ${numPersons} people</p>
                <p>${currentTime}</p>
            `)
            })
        .catch(error => {
            response.status(500).send({ error: 'Failed to fetch the number of entries' })
        })
})

// Display the information for a single phonebook entry
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})
  
// Delete a single phonebook entry
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})

// Update an existing phonebook entry by making HTTP PUT request
app.put('/app/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    if (!name) {
        return response.status(400).json({error: 'Name Missing'})
    } else if (!number) {
        return response.status(400).json({error: 'Number Missing'})
    } 

    // const updatedPerson = new Person({
    //     name: name,
    //     number: number
    // })

    Person.findByIdAndUpdate(
        request.params.id, 
        { name, number }, 
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

// Add new phonebook entries by making HTTP POST request
app.post('/api/persons', (request, response, next) => {
    const {name, number} = request.body

    if (!name) {
        return response.status(400).json({error: 'Name Missing'})
    } else if (!number) {
        return response.status(400).json({error: 'Number Missing'})
    } 

    Person.findOne({ name })
        .then(existingPerson => {
            if (existingPerson) {
                // Update the number if the name exists
                existingPerson.number = number
                existingPerson.save()
                    .then(updatedPerson => response.json(updatedPerson))
                    .catch(error => next(error))
            } else {
                const newPerson = new Person({
                    name: name,
                    number: number
                })

                newPerson.save()
                .then(savedPerson => {
                    response.json(savedPerson)
                })
                .catch(error => next(error))
            }
        })
})

// Handle unknown endpoints
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
// Handler of requests to unknown endpoints
app.use(unknownEndpoint)

// Middleware error handler
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}
  
// Handler of requrests with result to errors
app.use(errorHandler)

// Show that the port is running correctly
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
