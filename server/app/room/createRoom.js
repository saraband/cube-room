import { GraphQLError } from 'graphql'
import { safeTrim } from '@app/helpers/string'
import PixelsColors from '@/../client/src/constants/Pixels'

const typeDefs = `
  input CreateRoomInput {
    name: String!
    description: String
    pixels: String!
  }

  extend type Mutation {
    createRoom (input: CreateRoomInput!): Room!
  }
`

const PIXELS_TOTAL_NUMBER = 400
const MAX_SERIALIZED_PIXELS_SIZE = JSON.stringify(new Array(400).fill(15)).length

function validateRoomCreationInput ({ name, pixels }) {
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
      if (element < 0 || element >= PixelsColors.length) {
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
      if (!validateRoomCreationInput(input)) {
        throw new GraphQLError('Unable to create room: Invalid input')
      }

      return ctx.db.room.create(input)
    },
  },
}

export default {
  typeDefs,
  resolvers,
}