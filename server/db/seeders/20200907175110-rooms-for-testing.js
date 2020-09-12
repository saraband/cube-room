'use strict'

const moment = require('moment')
const Faker = require('faker')
const { genSaltSync, hashSync } = require('bcryptjs')

const DEFAULT_PASSWORD = hashSync('password', genSaltSync(10))

function randomInteger (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomPixels () {
  const randomRange = []
  const rangeAmplitude = randomInteger(2, 5)

  while (randomRange.length < rangeAmplitude) {
    const key = randomInteger(0, 15)

    if (!randomRange.find((k) => k === key)) {
      randomRange.push(key)
    }
  }

  return JSON.stringify(new Array(400).fill(0).map(() => randomRange[randomInteger(0, randomRange.length)]))
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'rooms',
      new Array(400).fill(1).map(
        () => {
          const createdAtDate = moment().subtract(randomInteger(5, 200), 'days').toDate()

          return {
            name: Faker.commerce.productName(),
            description: Faker.commerce.productDescription(),
            views: randomInteger(0, 500),
            pixels: randomPixels(),
            password: DEFAULT_PASSWORD,
            createdAt: createdAtDate,
            updatedAt: createdAtDate,
          }
        }
      ),
      {}
    )
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('rooms', null, {})
  },
}
