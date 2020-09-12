import { GraphQLError } from 'graphql'
import { safeTrim } from '@app/helpers/string'
import { generateEditScopeAccessToken, getRoom, hasRoomEditScopeAccess } from './helpers'
import { genSaltSync, hashSync } from 'bcryptjs'

const SALT = genSaltSync(10)

const typeDefs = `
  input CreateRoomInput {
    name: String!
    description: String
    pixels: String!
    password: String!
  }

  type CreateRoomPayload {
    token: String!
    room: Room!
  }

  input EditRoomInput {
    roomId: ID!
    name: String!
    description: String
    pixels: String!
  }

  type EditRoomPayload {
    room: Room!
  }

  extend type Mutation {
    createRoom (input: CreateRoomInput!): CreateRoomPayload!
    editRoom (input: EditRoomInput!): EditRoomPayload!
  }
`

const PIXELS_TOTAL_NUMBER = 400
const MAX_SERIALIZED_PIXELS_SIZE = JSON.stringify(new Array(400).fill(15)).length

function validateRoomInput ({ name, pixels, password }, passwordRequired = true) {
  try {
    // Name does not exist or longer than allowed pixels input
    if (safeTrim(name).length === 0 ||
      pixels.length > MAX_SERIALIZED_PIXELS_SIZE) {
      return false
    }

    // Password
    if (passwordRequired && safeTrim(password).length === 0) {
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

      const room = await ctx.db.room.create({
        ...input,
        password: hashSync(input.password, SALT),
      })

      /**
       * Add the newly created room to the user edit scope access and
       * send back a token that represents that scope access
       */
      const token = generateEditScopeAccessToken(room.id, ctx)

      return {
        token,
        room,
      }
    },
    editRoom: async (root, { input }, ctx) => {
      if (!hasRoomEditScopeAccess(input.roomId, ctx)) {
        throw new GraphQLError('Unable to update room: No edit scope access')
      }

      if (!validateRoomInput(input, false)) {
        throw new GraphQLError('Unable to update room: Invalid input')
      }

      const room = await getRoom(input.roomId, ctx)

      if (!room) {
        throw new GraphQLError('Unable to update room: Invalid room ID')
      }

      room.name = input.name
      room.description = input.description
      room.pixels = input.pixels
      await room.save()

      return {
        room,
      }
    },
  },
}

export default {
  typeDefs,
  resolvers,
}