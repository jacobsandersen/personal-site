import client from 'prom-client'

const register = client.register

export const seerRequestsTotal = (register.getSingleMetric("astro_seer_requests_total") as client.Counter<string>) || 
  new client.Counter({
    name: 'astro_seer_requests_total',
    help: 'Total requests to seer',
    labelNames: ['path', 'status']
  })

export const seerRequestDuration = register.getSingleMetric("astro_seer_request_duration_seconds") as client.Histogram<string> || new client.Histogram({
  name: 'astro_seer_request_duration_seconds',
  help: 'Duration of seer requests',
  labelNames: ['path'],
  buckets: [ 0.01, 0.05, 0.1, 0.5, 1, 2, 5]
})

export const bastionRequestsTotal = register.getSingleMetric("astro_bastion_requests_total") as client.Counter<string> || new client.Counter({
  name: 'astro_bastion_requests_total',
  help: 'Total requests to bastion',
  labelNames: ['path', 'status']
})

export const bastionRequestDuration = register.getSingleMetric("astro_bastion_request_duration_seconds") as client.Histogram<string> || new client.Histogram({
  name: 'astro_bastion_request_duration_seconds',
  help: 'Duration of bastion requests',
  labelNames: ['path'],
  buckets: [ 0.01, 0.05, 0.1, 0.5, 1, 2, 5]
})

export { register }
