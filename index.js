const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if(error.name === 'CastError') {
      return response.status(400).json({ error: 'Invalid id' })
    }
    next(error)
  }
  
const unknownEndpoint = (request,response) => {
    response.status(404).json({ error: 'Unknown endpoint' })
}

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

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
   Person.countDocuments({})
    .then(result => {
        const currentTime = Date()
        response.send(`
        <p>Phonebook has info of ${result} people</p>
        <p>${currentTime}</p>
        `)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request,response) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        if (result) {
            response.status(200).json(result)
        } else {
            response.status(404).end()
        }
    })
   .catch(error => next(error))
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

app.use(unknownEndpoint)  // Catch all other requests and return 404 error
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
