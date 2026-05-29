import client from 'prom-client'

const register = client.register

export const seerRequestsTotal = new client.Counter({
  name: 'astro_seer_requests_total',
  help: 'Total requests to seer',
  labelNames: ['path', 'status']
})

export const seerRequestDuration = new client.Histogram({
  name: 'astro_seer_request_duration_seconds',
  help: 'Duration of seer requests',
  labelNames: ['path'],
  buckets: [ 0.01, 0.05, 0.1, 0.5, 1, 2, 5]
})

export { register }
