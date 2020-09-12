import { GraphQLError } from 'graphql'
import { compareSync } from 'bcryptjs'
import { getRoom, generateEditScopeAccessToken } from './helpers'

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
      const token = generateEditScopeAccessToken(room.id, ctx)

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