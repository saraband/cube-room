require('dotenv').config()

import server from '@app/server'

const PORT = process.env.PORT || 4000

server.listen({ port: PORT }).then(({ url, subscriptionsUrl }) => {
  console.log(`\n\nServer ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}\n\n`)
})