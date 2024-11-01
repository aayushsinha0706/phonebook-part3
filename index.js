const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))


morgan.token("req-body", (req) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"))

app.get('/api/persons', (request,response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/info', (request,response) => {
    const totalEntries = persons.length
    const currentTime = Date()
    response.send(`
        <p>Phonebook has info of ${totalEntries} people</p>
        <p>${currentTime}</p>
        `)
})

app.get('/api/persons/:id', (request,response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id!== id)
    response.status(204).end()
})

app.post('/api/persons' , (request,response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({error: 'name and number are required'})
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.status(201).json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
