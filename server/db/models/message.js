'use strict'

module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define('message', {
    username: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {})
  message.associate = function (models) {
    models.message.belongsTo(models.room)
  }
  
  return message
}