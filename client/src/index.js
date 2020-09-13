/* eslint-disable */

import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient, InMemoryCache, ApolloProvider, split, from, HttpLink } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { setContext } from '@apollo/client/link/context'
import App from './App'
import * as serviceWorker from './serviceWorker'
import store from './store'
import './index.css'

const HTTP_SERVER_URL = process.env.REACT_APP_HTTP_SERVER_URL || 'http://localhost:4000/graphql'
const WS_SERVER_URL = process.env.REACT_APP_WS_SERVER_URL || 'ws://localhost:4000/graphql'

// Apply auth token (used for editing a room)
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
})

const wsLink = new WebSocketLink({
  uri: WS_SERVER_URL,
  options: {
    reconnect: true,
  },
})

const httpLink = new HttpLink({
  uri: HTTP_SERVER_URL,
})

const link = from([
  authLink,
  split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink,
  )
])

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
