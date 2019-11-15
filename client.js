'use strict'

const { join } = require('path')
const internalIp = require('internal-ip')
const Koa = require('koa')
const Router = require('koa-router')
const serve = require('koa-static')
const views = require('co-views')
require('colors')

const SERVER_PORT = 9998
const CLIENT_PORT = 9999
const VIEWS_DIR = 'views'

;(async () => {
  const ipAddress = await internalIp.v4()

  const app = new Koa()
  const router = new Router()
  const render = views(join(__dirname, VIEWS_DIR), {
    map: { html: 'swig' }
  })

  router
    .get('/', async (ctx, next) => {
      const { method, url } = ctx.request
      console.log(`[${method}: ${url}]`.yellow)
      ctx.body = await render('viewer', {
        ipAddress,
        port: SERVER_PORT
      })
      await next()
    })
    .get('/camera', async (ctx, next) => {
      const { method, url } = ctx.request
      console.log(`[${method}: ${url}]`.yellow)
      ctx.body = await render('camera', {
        ipAddress,
        port: SERVER_PORT
      })
      await next()
    })

  app
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve(join(__dirname, VIEWS_DIR)))

  const server = app.listen(CLIENT_PORT, '0.0.0.0', () => {
    const host = server.address().address
    const port = server.address().port
    console.log('listening at http://%s:%s', host, port)
  })
})()
