const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())

const requests = []

const checkRequestsId = (request, response, next) => {
    const { id } = request.params

    const index = requests.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ erro: "user not found" })
    }

    request.orderIndex = index
    request.orderId = id


    next()
}

const checkMethodAndUrl = (request, response, next) => {
    console.log(" Methodo: " + request.method)
    console.log(" Url: " + request.url)

    next()
}


app.get('/users', checkMethodAndUrl, (request, response) => {
    return response.json({ requests })


})

app.get('/users/:id', checkMethodAndUrl, (request, response) => {
    const { id } = request.params

    const index = requests.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ erro: "user not found" })
    }

    const orderInProcess = requests.find(user => user.id === id)


    return response.json(orderInProcess)
})

app.post('/users', checkMethodAndUrl, (request, response) => {

    const { order, clienteName, price, status } = request.body

    const user = { id: uuid.v4(), order, clienteName, price, status }



    requests.push(user)
    return response.status(201).json(user)
})

app.put('/users/:id', checkRequestsId, checkMethodAndUrl, (request, response) => {
    const { order, clienteName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateUser = { id, order, clienteName, price, status }

    requests[index] = updateUser

    return response.json(updateUser)
})

app.delete('/users/:id', checkRequestsId, checkMethodAndUrl, (request, response) => {
    const index = request.orderIndex

    requests.splice(index, 1)

    return response.status(202).json({ Ok: "successfully deleted" })
})


app.patch('/users/:id', checkRequestsId, checkMethodAndUrl, (request, response) => {
    const index = request.orderIndex
    const id = request.orderId

    const newRequests = requests.filter(item => item.id === id)

    newRequests.forEach(updateStatus => {
        updateStatus.status = "pronto"

        requests[index] = updateStatus

        return response.json(updateStatus)

    });


})


app.listen(port, () => {
    console.log(`👍 Servidor status on port ${port}`)
})



