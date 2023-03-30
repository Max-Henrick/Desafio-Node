const { request, response } = require('express')
const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())

//MIDDLEWARE - conferencia de pedidos
const checkUserId = (request, response, next) => {
    const { id } = request.params
    const position = listOrder.findIndex(user => user.id === id)

    if (position < 0) {
        return response.status(404).json({ menssage: "Usuário não encontrado" })
    }


    request.userPosition = position
    request.userId = id

    next()
}

const listOrder = []

// Criação de pedidos
app.post('/order', (request, response) => {
    const { order, clientName, price } = request.body
    const status = 'Em preparação'
    const statusOrder = { id: uuid.v4(), order, clientName, price, status }
    listOrder.push(statusOrder)
    return response.status(201).json(statusOrder)
})

// Consulta pedidos
app.get('/order', (request, response) => {
    return response.json(listOrder)
})

//Alteração de pedidos
app.put('/order/:id', checkUserId, (request, response) => {
    const { order, clientName, price, status } = request.body
    const position = request.userPosition
    const id = request.userId

    const updateOrder = { id, order, clientName, price, status }

    listOrder[position] = updateOrder

    return response.json(updateOrder)
})

app.patch('/order/:id', checkUserId, (request, response) => {
    const { order, clientName, price, status } = request.body
    const position = request.userPosition
    const id = request.userId

    const statusOrder = status = 'Pronto'

    const updateStatus = { id, order, clientName, price, statusOrder }

    listOrder[position] = updateStatus

    return response.json(updateStatus)
})



app.listen(port, () => {
    console.log(`Server started in port ${port}👍`)
}) 