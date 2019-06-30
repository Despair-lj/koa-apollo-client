import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { LoginContext } from '../utils/login-context'

const SIGNUP_MUTATION = gql`
  mutation SignupMutation(
    $email: String!
    $password: String!
    $username: String!
  ) {
    signup(email: $email, password: $password, username: $username) {
      ok
      error
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      isAdmin
    }
  }
`

class Login extends Component {
  state = {
    login: true, // switch between Login and SignUp
    email: 'lj@gmail.com',
    password: 'iamlj',
    username: ''
  }

  render() {
    const { login, email, password, username } = this.state
    console.log(this.props.history)
    return (
      <LoginContext.Consumer>
        {({ isLogin, toggleLogin, toggleIsAdmin }) => {
          return (
            <div>
              <h4 className="mv3">{login ? '登录' : '注册'}</h4>
              <div className="flex flex-column">
                {!login && (
                  <input
                    value={username}
                    onChange={e => this.setState({ username: e.target.value })}
                    type="text"
                    placeholder="用户名"
                  />
                )}
                <input
                  value={email}
                  onChange={e => this.setState({ email: e.target.value })}
                  type="text"
                  placeholder="邮箱"
                />
                <input
                  value={password}
                  onChange={e => this.setState({ password: e.target.value })}
                  type="password"
                  placeholder="密码"
                />
              </div>
              <div className="flex mt3">
                <Mutation
                  mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
                  variables={{ email, password, username }}
                  onCompleted={data =>
                    this._confirm(data, toggleLogin, toggleIsAdmin)
                  }
                  onError={({ graphQLErrors }) => {
                    const message = graphQLErrors[0].state.message || '错误'
                    alert(message)
                  }}
                >
                  {mutation => (
                    <div className="pointer mr2 button" onClick={mutation}>
                      {login ? '登录' : '创建账号'}
                    </div>
                  )}
                </Mutation>
                <div
                  className="pointer button"
                  onClick={() => this.setState({ login: !login })}
                >
                  {login ? '需要创建一个账号?' : '已经拥有账号?'}
                </div>
              </div>
            </div>
          )
        }}
      </LoginContext.Consumer>
    )
  }

  _confirm = ({ login }, loginToggle, toggleIsAdmin) => {
    toggleIsAdmin(login.isAdmin || false)
    loginToggle(true)
    this.props.history.push(`/`)
  }
}

export default Login
