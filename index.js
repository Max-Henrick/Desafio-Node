const { request, response } = require('express')
const express = require('express')
const cors = require('cors')
const uuid = require('uuid')

const port = 3001
const app = express()
app.use(express.json())
app.use(cors())

const listOrder = []

//MIDDLEWARE - conferencia de pedidos
const checkUserId = (request, response, next) => {
    const { id } = request.params
    const position = listOrder.findIndex(order => order.id === id)

    if (position < 0) {
        return response.status(404).json({ menssage: "Usuário não encontrado" })
    }


    request.userPosition = position
    request.userId = id

    next()
}

const checkMethodOrUrl = (request, response, next) => {
    const method = request.method
    const url = request.url

    request.methodPage = method
    request.urlPage = url

    next()
}

// Criação de pedidos
app.post('/order', checkMethodOrUrl, (request, response) => {
    const { order, clientName, price } = request.body
    const status = 'Em preparação'
    const statusOrder = { id: uuid.v4(), order, clientName, price, status }
    listOrder.push(statusOrder)

    const url = request.urlPage
    const method = request.methodPage

    console.log(`[${method}] - ${url}`)

    return response.status(201).json(statusOrder)
})

// Consulta todos os pedidos
app.get('/order', checkMethodOrUrl, (request, response) => {
    const url = request.urlPage
    const method = request.methodPage

    console.log(`[${method}] - ${url}`)
    return response.json(listOrder)

})

// Consulta apenas o pedido selecionado
app.get('/order/:id', checkUserId, checkMethodOrUrl, (request, response) => {
    const id = request.userId

    const listId = listOrder.map(statusId => {
        if (statusId.id === id) {
            let consultId = {
                id: statusId.id,
                order: statusId.order,
                clientName: statusId.clientName,
                price: statusId.price,
                status: statusId.status
            }
            return consultId
        }
    })

    //Relacionado ao MIDDLEWARE que verifica 
    const url = request.urlPage
    const method = request.methodPage

    console.log(`[${method}] - ${url}`)

    return response.json(listId)
})

//Alteração de pedidos
app.put('/order/:id', checkUserId, checkMethodOrUrl, (request, response) => {
    const { order, clientName, price, status } = request.body
    const position = request.userPosition
    const id = request.userId

    const updateOrder = { id, order, clientName, price, status }

    listOrder[position] = updateOrder

    //Relacionado ao MIDDLEWARE que verifica 
    const url = request.urlPage
    const method = request.methodPage

    console.log(`[${method}] - ${url}`)

    return response.json(updateOrder)
})

// Deleta um pedido
app.delete('/users/:id', checkUserId, checkMethodOrUrl, (request, response) => {
    const position = request.userPosition

    listOrder.splice(position, 1)

    //Relacionado ao MIDDLEWARE que verifica 
    const url = request.urlPage
    const method = request.methodPage

    console.log(`[${method}] - ${url}`)

    return response.status(204)
})

//Adiciona status para pronto ou encerrado
app.patch('/order/:id', checkUserId, checkMethodOrUrl, (request, response) => {
    const position = request.userPosition
    const id = request.userId

    const changeStatus = listOrder.map(stats => {

        if (stats.id === id) {
            let newStatusOrder = {
                id: stats.id,
                order: stats.order,
                clientName: stats.clientName,
                price: stats.price,
                status: stats.status === "Em preparação" ? "Pronto" : "Encerrado"
            }
            return newStatusOrder
        }
    })

    listOrder[position] = changeStatus

    //Relacionado ao MIDDLEWARE que verifica 
    const url = request.urlPage
    const method = request.methodPage

    console.log(`[${method}] - ${url}`)

    return response.json(changeStatus)
})





app.listen(port, () => {
    console.log(`Server started in port ${port}👍`)
}) 