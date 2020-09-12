import { GraphQLError } from 'graphql'
import { compareSync } from 'bcryptjs'
import { getRoom } from './helpers'
import jwt from 'jsonwebtoken'

const DAY = 60 * 60 * 24

const typeDefs = `
  extend type Mutation {
    unlockRoom (roomId: ID!, password: String!): String
  }
`

const resolvers = {
  Mutation: {
    unlockRoom: async (root, { roomId, password }, ctx) => {
      const room = await getRoom(roomId, ctx)

      if (!room) {
        throw new GraphQLError('Unable to unlock room: Room ID invalid')
      }

      if (!compareSync(password, room.password)) {
        throw new GraphQLError('Unable to unlock room: Invalid password')
      }

      const token = jwt.sign(
        { roomId: room.id },
        process.env.JWT_KEY || 'developement_key',
        {  expiresIn: 7 * DAY },
      )

      return token
    },
  },
}

export default {
  typeDefs,
  resolvers,
}