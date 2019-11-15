'use strict'

const { IP_ADDRESS, PORT } = APP

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const socket = new WebSocket(`ws://${IP_ADDRESS}:${PORT}`)

socket.addEventListener('error', () => {
  console.error('server connect error')
})

socket.addEventListener('open', () => {
  console.log('server connect success')
})

socket.addEventListener('message', ({ data }) => {
  const img = new Image()
  img.src = data
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }
})
