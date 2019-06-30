import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import gql from 'graphql-tag'
import { Mutation, withApollo } from 'react-apollo'
import { LoginContext } from '../utils/login-context'

const LOGOUT_MUTATION = gql`
  mutation {
    logout {
      ok
    }
  }
`

class Header extends Component {
  render() {
    return (
      <LoginContext.Consumer>
        {({ isLogin, isAdmin, toggleLogin, toggleIsAdmin }) => {
          return (
            <div className="flex pa1 justify-between nowrap orange">
              <div className="flex flex-fixed black">
                <div className="fw7 mr1">Hacker 文章</div>
                <Link to="/" className="ml1 no-underline black">
                  全部文章
                </Link>
                <div className="ml1">|</div>
                <Link to="/search" className="ml1 no-underline black">
                  搜索
                </Link>
                {isLogin && (
                  <Fragment>
                    <div className="ml1">|</div>
                    <Link to="/create" className="ml1 no-underline black">
                      发表新文章
                    </Link>
                  </Fragment>
                )}
                {isLogin && isAdmin && (
                  <Fragment>
                    <div className="ml1">|</div>
                    <Link to="/users" className="ml1 no-underline black">
                      用户管理
                    </Link>
                  </Fragment>
                )}
              </div>
              <div className="flex flex-fixed">
                {isLogin ? (
                  <Mutation
                    mutation={LOGOUT_MUTATION}
                    onCompleted={data =>
                      this._logout(toggleLogin, toggleIsAdmin)
                    }
                  >
                    {mutation => (
                      <div className="ml1 pointer black" onClick={mutation}>
                        退出
                      </div>
                    )}
                  </Mutation>
                ) : (
                  <Link to="/login" className="ml1 no-underline black">
                    登陆
                  </Link>
                )}
              </div>
            </div>
          )
        }}
      </LoginContext.Consumer>
    )
  }

  _logout = (toggleLogin, toggleIsAdmin) => {
    toggleLogin(false)
    toggleIsAdmin(false)
    this.props.history.push(`/`)
  }
}

export default withRouter(withApollo(Header))
