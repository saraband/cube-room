export default {
  INDEX: '/',
  ROOM: '/room/:roomId',
  CREATE_ROOM: '/room/create',
}

export function generateRoute (route, params) {
  for (const key in params) {
    route = route.replace(`:${key}`, params[key])
  }

  return route
}