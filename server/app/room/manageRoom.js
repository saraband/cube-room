import { GraphQLError } from 'graphql'
import { safeTrim } from '@app/helpers/string'
import { getRoom, hasRoomEditScopeAccess } from './helpers'

const typeDefs = `
  input CreateRoomInput {
    name: String!
    description: String
    pixels: String!
  }

  input editRoomInput {
    roomId: ID!
    name: String!
    description: String
    pixels: String!
  }

  extend type Mutation {
    createRoom (input: CreateRoomInput!): Room!
    editRoom (input: editRoomInput!): Room!
  }
`

const PIXELS_TOTAL_NUMBER = 400
const MAX_SERIALIZED_PIXELS_SIZE = JSON.stringify(new Array(400).fill(15)).length

function validateRoomInput ({ name, pixels }) {
  try {
    // Name does not exist or longer than allowed pixels input
    if (safeTrim(name).length === 0 ||
      pixels.length > MAX_SERIALIZED_PIXELS_SIZE) {
      return false
    }
    
    const pixelsParsed = JSON.parse(pixels)

    // Must be an array of size 400
    if (!Array.isArray(pixelsParsed) || pixelsParsed.length !== PIXELS_TOTAL_NUMBER) {
      return false
    }

    // Must be an array of numbers representing pixels
    for (const element of pixelsParsed) {
      if (typeof element !== 'number') {
        return false
      }

      // Not a valid color key
      if (element < 0 || element > 15) {
        return false
      }
    }
  } catch (error) {
    return false
  }

  return true
}

const resolvers = {
  Mutation: {
    createRoom: async (root, { input }, ctx) => {
      if (!validateRoomInput(input)) {
        throw new GraphQLError('Unable to create room: Invalid input')
      }

      return ctx.db.room.create(input)
    },
    editRoom: async (root, { input }, ctx) => {
      if (!hasRoomEditScopeAccess(input.roomId, ctx)) {
        throw new GraphQLError('Unable to update room: No edit scope access')
      }

      if (!validateRoomInput(input)) {
        throw new GraphQLError('Unable to update room: Invalid input')
      }

      const room = await getRoom(input.roomId, ctx)

      if (!room) {
        throw new GraphQLError('Unable to update room: Invalid room ID')
      }

      room.name = input.name
      room.description = input.description
      room.pixels = input.pixels

      return room.save()
    },
  },
}

export default {
  typeDefs,
  resolvers,
}