import { incrementViewsCounter, getRoom } from './helpers'

const typeDefs = `
  type Room {
    id: ID!
    name: String!
    description: String
    pixels: String!
    messages: [ChatMessage!]!
    views: Int!
    createdAt: Date!
  }

  extend type Query {
    room (roomId: ID!): Room
  }
`

const resolvers = {
  Room: {
    messages: async (room, args, ctx) => {
      incrementViewsCounter(room.id, ctx)
      return room.getMessages()
    },
  },
  Query: {
    room: async (root, { roomId }, ctx) => getRoom(roomId, ctx),
  },
}

export default {
  typeDefs,
  resolvers,
}