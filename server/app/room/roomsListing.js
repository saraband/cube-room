import { Op } from 'sequelize'

const typeDefs = `
  input GetAllRoomsInput {
    searchString: String
    orderByKey: String
  }

  extend type Query {
    allRooms (
      filters: GetAllRoomsInput = {},
      offset: Int! = 0,
      limit: Int! = 35
    ): [Room!]!
  }
`

const OrderByParams = {
  'newest': ['createdAt', 'DESC'],
  'oldest': ['createdAt', 'ASC'],
  'most-viewed': ['views', 'DESC'],
  'least-viewed': ['views', 'ASC'],
}

const resolvers = {
  Query: {
    allRooms: async (root, { filters, offset, limit }, ctx) => {
      const params = {
        offset,
        limit,
      }

      // Any filters applied to the listing ?
      if (Object.keys(filters)) {
        const {
          searchString,
          orderByKey,
        } = filters

        // Text search filter
        if (searchString) {
          params.where = {
            name: {
              [Op.like]: `%${searchString}%`,
            },
          }
        }

        // Order by filter
        if (orderByKey && OrderByParams[orderByKey]) {
          params.order = [
            OrderByParams[orderByKey],
            ['id', 'ASC'],
          ]
        }
      }
      
      return ctx.db.room.findAll(params)
    },
  },
}

export default {
  typeDefs,
  resolvers,
}