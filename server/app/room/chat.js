import { withFilter } from 'apollo-server'
import { safeTrim } from '@app/helpers/string'
import { roomExists } from './helpers'
import { GraphQLError } from 'graphql'

const typeDefs = `
  type ChatMessage {
    id: ID!
    username: String!
    content: String!
    createdAt: Date!
  }

  extend type Subscription {
    messageReceived (roomId: ID!): ChatMessage!
    userJoinedRoom (roomId: ID!): Int! # Count of people connected in the room
  }

  input SendMessageInput {
    roomId: ID!
    username: String!
    content: String!
  }

  extend type Mutation {
    sendMessage (input: SendMessageInput!): ChatMessage!
  }
`

export const MESSAGE_RECEIVED = 'MESSAGE_RECEIVED'

async function validateChatMessageInput ({ username, content, roomId }, ctx) {
  // Username and content of message must exist
  if (!safeTrim(username).length || !safeTrim(content).length) {
    return false
  }

  // Room should exist
  return roomExists(roomId, ctx)
}

const resolvers = {
  Subscription: {
    messageReceived: {
      subscribe: withFilter(
        (root, args, ctx) => ctx.pubsub.asyncIterator([MESSAGE_RECEIVED]),
        (payload, variables) => parseInt(payload.messageReceived.roomId) === parseInt(variables.roomId)
      ),
    },
  },
  Mutation: {
    sendMessage: async (root, { input }, ctx) => {
      const isMessageValid = await validateChatMessageInput(input, ctx)

      if (!isMessageValid) {
        throw new GraphQLError('Unable to send chat message: Invalid input')
      }

      const message = await ctx.db.message.create(input)

      // Notify all clients subscribed to the chat
      ctx.pubsub.publish(MESSAGE_RECEIVED, {
        messageReceived: message,
      })

      return message
    },
  },
}

export default {
  typeDefs,
  resolvers,
}