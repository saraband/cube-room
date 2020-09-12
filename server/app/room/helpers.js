import { Op } from 'sequelize'

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