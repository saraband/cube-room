'use strict'

module.exports = (sequelize, DataTypes) => {
  const room = sequelize.define('room', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    pixels: DataTypes.TEXT,
    views: DataTypes.INTEGER,
    password: DataTypes.STRING,
  }, {})
  room.associate = function (models) {
    models.room.hasMany(models.message)
  }
  
  return room
}