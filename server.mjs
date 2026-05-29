import express from 'express'
import client from 'prom-client'
import { handler as astroHandler } from './dist/server/entry.mjs'


const mainApp = express()
mainApp.use(express.static('dist/client/'))
mainApp.use(astroHandler)

mainApp.listen(8080, () => console.log("Main astro server listening on port 8080"))

client.collectDefaultMetrics()
const register = client.register

const metricsApp = express()
metricsApp.get('/metrics', async (_req, res) => {
  res.setHeader('Content-Type', register.contentType)
  res.send(await register.metrics())
})

metricsApp.listen(8081, () => console.log("Metrics server listening on port 8081"))



