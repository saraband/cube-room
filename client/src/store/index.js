import { createStore, combineReducers } from 'redux'

export const SET_CURRENT_COLOR_KEY = 'SET_CURRENT_COLOR_KEY'
export const SET_ROOM_LISTING_FILTERS = 'SET_ROOM_LISTING_FILTERS'

// Current color in color picker
function currentColorKey (state = 0, action) {
  if (action.type === SET_CURRENT_COLOR_KEY) {
    return action.colorKey
  }

  return state
}

// Room listing filters
const InitialRoomListingFilters = {
  searchString: '',
  orderByKey: 'newest',
}

function roomListingFilters (state = InitialRoomListingFilters, action) {
  if (action.type === SET_ROOM_LISTING_FILTERS) {
    return action.filters
  }

  return state
}

const rootReducer = combineReducers({
  currentColorKey,
  roomListingFilters,
})

export default createStore(rootReducer)