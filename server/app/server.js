import { ApolloServer, PubSub } from 'apollo-server-express'
import schema from '@app/schema'
import db from '@db/models'
import express from 'express'
import jwt from 'jsonwebtoken'
import http from 'http'
import helmet from 'helmet'

const app = express()
app.use(helmet())

// Authentication middleware (for room edit scope)
app.use((req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    next()
    return
  }

  const token = authorization.split(' ')[1]
  try {
    jwt.verify(token, process.env.JWT_KEY || 'developement_key', (err, payload) => {
      if (err) {
        throw err
      }

      if (payload) {
        req.user = payload
      }
    })
    next()
  } catch (err) {
    next()
  }
})

const pubsub = new PubSub()
const server = new ApolloServer({
  ...schema,
  context: ({ req }) => {
    return {
      db,
      user: req?.user,
      pubsub,
    }
  },
})

server.applyMiddleware({ app })

const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

export default httpServer
export const serverPath = server.graphqlPath