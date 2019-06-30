import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'
import Header from './Header'
import ArticleList from './ArticleList'
import CreateArticle from './CreateArticle'
import Login from './Login'
import Search from './Search'
import { Login as LoginStatus, LoginContext } from '../utils/login-context'
import UserList from './UserList'

const ME_QUERY = gql`
  {
    me {
      ok
      isAdmin
    }
  }
`

class App extends Component {
  state = {
    isLogin: LoginStatus.ok,
    isAdmin: LoginStatus.isAdmin,
    username: LoginStatus.username,
    toggleLogin: flag => {
      this.setState({ isLogin: flag })
    },
    toggleIsAdmin: flag => {
      this.setState({ isAdmin: flag })
    }
  }

  componentDidMount() {
    this.props.client
      .query({
        query: ME_QUERY
      })
      .then(result => {
        if (result.data.me && result.data.me.ok) {
          this.setState({ isLogin: true, isAdmin: result.data.me.isAdmin })
        }
      })
  }

  render() {
    return (
      <LoginContext.Provider value={this.state}>
        <div className="center w85">
          <Header />
          <div className="ph3 pv1 background-gray">
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/new/1" />} />
              <Route
                exact
                path="/create"
                render={props =>
                  this.state.isLogin ? (
                    <CreateArticle {...props} />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                exact
                path="/login"
                component={props =>
                  this.state.isLogin ? (
                    <Redirect to="/" />
                  ) : (
                    <Login {...props} />
                  )
                }
              />
              <Route exact path="/search" component={Search} />
              <Route exact path="/new/:page" component={ArticleList} />
              <Route
                exact
                path="/users"
                render={props =>
                  this.state.isLogin && this.state.isAdmin ? (
                    <UserList {...props} />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />
            </Switch>
          </div>
        </div>
      </LoginContext.Provider>
    )
  }
}

export default withApollo(App)
