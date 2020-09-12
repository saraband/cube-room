import { GraphQLError } from 'graphql'
import { compareSync } from 'bcryptjs'
import { getRoom } from './helpers'
import jwt from 'jsonwebtoken'

const DAY = 60 * 60 * 24

const typeDefs = `
  type UnlockRoomPayload {
    token: String!
    room: Room!
  }

  extend type Mutation {
    unlockRoom (roomId: ID!, password: String!): UnlockRoomPayload
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

      /**
       * Add this room to the user edit scope access and
       * send back a token that represents that scope access
       */
      const existingRoomEditScopeAccess = ctx?.user?.roomEditScopeAccess || {}
      const newRoomEditScopeAccess = {
        ...existingRoomEditScopeAccess,
        [roomId]: true,
      }

      const token = jwt.sign(
        {
          roomEditScopeAccess: newRoomEditScopeAccess,
        },
        process.env.JWT_KEY || 'developement_key',
        {  expiresIn: 365 * DAY }, // @TODO refresh tokens
      )

      // Update ctx.user so sub-resolvers that use ctx.user have correct scope
      ctx.user = {
        ...(ctx.user || {}),
        roomEditScopeAccess: newRoomEditScopeAccess,
      }

      return {
        token,
        room,
      }
    },
  },
}

export default {
  typeDefs,
  resolvers,
}