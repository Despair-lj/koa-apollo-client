import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import './styles/index.css'
// 1
import { ApolloProvider } from 'react-apollo'
import { ApolloClient, InMemoryCache, split } from 'apollo-boost'
import { createHttpLink } from 'apollo-link-http'
// 设置路由
import { BrowserRouter } from 'react-router-dom'
// 设置订阅
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
})
// 订阅设置
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
    connectionParams: {}
  }
})
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

// const networkInterface
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
