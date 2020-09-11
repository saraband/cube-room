import { ApolloServer, PubSub } from 'apollo-server'
import schema from '@app/schema'
import db from '@db/models'

const pubsub = new PubSub()
const server = new ApolloServer({
  ...schema,
  context: () => {
    return {
      db,
      pubsub,
    }
  },
})

export default server