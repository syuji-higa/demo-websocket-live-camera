'use strict'

const { IP_ADDRESS, PORT } = APP

;(async () => {
  await import('/utils/mediaDevices-getUserMedia-polyfill.js')

  if (!navigator.mediaDevices) {
    console.error('getUserMedia not supported.')
    return
  }

  const video = document.getElementById('video')

  const stream = await navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false
    })
    .catch((err) => {
      console.error(`${err.name}: ${err.message}`)
    })

  if (!stream) {
    return
  }

  const socket = new WebSocket(`ws://${IP_ADDRESS}:${PORT}`)

  socket.addEventListener('error', () => {
    console.error('server connect error')
  })

  socket.addEventListener('open', () => {
    console.log('server connect success')
  })

  video.srcObject = stream
  video.addEventListener('timeupdate', () => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    socket.send(canvas.toDataURL())
  })
})()
