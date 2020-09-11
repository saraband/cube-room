import fs from 'fs'
import path from 'path'
import { merge } from 'lodash'

const typeDefs = []
const resolvers = {}

typeDefs.push(`
  scalar Date

  type Subscription {
    _empty: String
  }

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`)

// Aggregate whole schema
const allDirectories = fs
  .readdirSync(__dirname)
  .filter((filename) => fs.lstatSync(path.resolve(__dirname, filename)).isDirectory())

for (const directory of allDirectories) {
  for (const filename of fs.readdirSync(path.resolve(__dirname, directory))) {
    const modulePath = path.resolve(__dirname, directory, filename)

    try {
      const module = require(modulePath).default || {}
      if (module.typeDefs) typeDefs.push(module.typeDefs)
      merge(resolvers, module.resolvers || {})
    } catch (error) {
      console.error(`Unable to load module ${modulePath}: ${error.message}`)
    }
  }
}

export default {
  typeDefs,
  resolvers,
}