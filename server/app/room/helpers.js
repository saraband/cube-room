import { Op } from 'sequelize'
import jwt from 'jsonwebtoken'

const DAY = 60 * 60 * 24

export async function getRoom (roomId, ctx) {
  const rows = await ctx.db.room.findAll({
    where: {
      id: {
        [Op.eq]: roomId,
      },
    },
  })

  return rows[0] || null
}

export async function roomExists (roomId, ctx) {
  const count = await ctx.db.room.count({
    where: {
      id: {
        [Op.eq]: roomId,
      },
    },
  })

  return count !== 0
}

export async function incrementViewsCounter (roomId, ctx) {
  const room = await getRoom(roomId, ctx)

  if (room) {
    room.views += 1
    return room.save()
  }

  return null
}

export function hasRoomEditScopeAccess (roomId, ctx) {
  return !!ctx?.user?.roomEditScopeAccess?.[roomId]
}

/**
 * Add roomId to the list of room edit scope access of current user
 * and send back an updated token
 */
export function generateEditScopeAccessToken(roomId, ctx) {
  const existingRoomEditScopeAccess = ctx?.user?.roomEditScopeAccess || {}
  const newRoomEditScopeAccess = {
    ...existingRoomEditScopeAccess,
    [roomId]: true,
  }

  const token = jwt.sign(
    {
      roomEditScopeAccess: newRoomEditScopeAccess,
    },
    process.env.JWT_KEY || 'developement_key',
    {  expiresIn: 365 * DAY }, // @TODO refresh tokens
  )

  // Update ctx.user so sub-resolvers that use ctx.user have correct scope
  ctx.user = {
    ...(ctx.user || {}),
    roomEditScopeAccess: newRoomEditScopeAccess,
  }

  return token
}