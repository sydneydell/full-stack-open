const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Arguments should be given as: node mongo.js password name number')
  process.exit(1)
} 

const password = process.argv[2]

const url =
  `mongodb+srv://sdell:${password}@cluster0.n3w1u.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {
    const newName = process.argv[3]
    const newNumber = process.argv[4]

    const person = new Person({
        name: newName,
        number: newNumber
    })

    person.save().then(result => {
        console.log(`Added ${newName} number ${newNumber} to phonebook`)
        mongoose.connection.close()
    }).catch(err => {
        console.error('Error saving person:', err.message);
        mongoose.connection.close();
    })
}

