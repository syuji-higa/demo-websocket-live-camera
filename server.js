'use strict'

const WebSocket = require('ws')

const PORT = 9998

const wss = new WebSocket.Server({ port: PORT })

let maxId = 0
const connections = []

wss.on('connection', (ws, { headers, url }) => {
  const { host } = headers
  const path = `${host}${url}`
  const id = maxId
  maxId++

  console.log(`Connecting: ${path} [ID:${id}]`)

  connections.push({ id, path, ws })

  ws.on('message', (data) => {
    console.log(`Update to data: ${Date.now()}`)
    for (const con of connections) {
      console.log(`Send to data: [ID:${con.id}]`)
      con.ws.send(data)
    }
  })

  ws.on('close', () => {
    for (const [index, con] of Object.entries(connections)) {
      if (con.ws === ws) {
        connections.splice(index, 1)
        console.log(`Closed: ${con.path} [ID:${con.id}]`)
        break
      }
    }
  })
})
