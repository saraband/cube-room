import React from 'react'
import { Switch, Route } from 'react-router-dom'

import RoomListing from 'views/RoomListingPage/RoomListingPage'
import RoomPage from 'views/RoomPage/RoomPage'
import ManageRoomPage from 'views/ManageRoomPage/ManageRoomPage'
import Page404 from 'views/Page404'
import Routes from 'constants/Routes'

function App() {
  return (
    <Switch>  
      <Route exact path={Routes.INDEX}>
        <RoomListing/>
      </Route>
      <Route exact path={Routes.CREATE_ROOM}>
        <ManageRoomPage action='create'/>
      </Route>
      <Route exact path={Routes.EDIT_ROOM}>
        <ManageRoomPage action='edit'/>
      </Route>
      <Route exact path={Routes.ROOM}>
        <RoomPage/>
      </Route>
      <Route>
        <Page404/>
      </Route>
    </Switch>
  )
}

export default App
