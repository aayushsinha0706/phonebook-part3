const express = require('express')
const app = express()

app.use(express.json())

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

app.get('/api/persons', (request,response) => {
    response.json(persons)
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

const generateId = () => {
    const id = persons.length > 0
     ? Math.floor(Math.random() * (99999999 - 5 + 1) + 5 )
     : 0
    return String(id)
}

app.post('/api/persons' , (request,response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({error: 'name and number are required'})
    }

    const personExists = persons.some(person => person.name.toLowerCase() === body.name.toLowerCase())

    if (personExists) {
        return response.status(400).json({ error: 'name must be unique' })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.status(201).json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
