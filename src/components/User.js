import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { USER_QUERY } from './UserList'

const CHANGE_USER_STATUS_MUTATION = gql`
  mutation ChangeUserStatusMutation($userId: String!, $status: Boolean!) {
    changeUserStatus(userId: $userId, status: $status) {
      ok
      error
    }
  }
`

class User extends Component {
  _getVariables = user => {
    return {
      userId: user.id,
      status: !this.state.isDelete
    }
  }

  state = {
    isDelete: false
  }

  componentDidMount() {
    this.setState({
      isDelete: this.props.user.isDelete || false
    })
  }

  render() {
    const { user } = this.props
    return (
      <div className="flex mt2 items-start">
        <div className="flex items-center">
          <span className="gray">{this.props.index + 1}.</span>
          <Mutation
            mutation={CHANGE_USER_STATUS_MUTATION}
            variables={this._getVariables(user)}
            update={(store, { data: { changeUserStatus } }) => {
              if (changeUserStatus.ok) {
                try {
                  const data = store.readQuery({
                    query: USER_QUERY
                  })

                  const changeUser = data.users.find(u => u.id === user.id)
                  changeUser.isDelete = !changeUser.isDelete
                  this.setState({ isDelete: changeUser.isDelete })
                  store.writeQuery({ query: USER_QUERY, data })
                } catch (error) {
                  console.log('e: ', error)
                }
              }
            }}
          >
            {mutation => (
              <div
                className={`ml1 gray f11 operation ${
                  !user.isDelete ? 'green' : 'red'
                }`}
                onClick={mutation}
              >
                {!user.isDelete ? '✓ 活跃中' : '✗ 已被冻结'}
              </div>
            )}
          </Mutation>
        </div>
        <div className="ml1">
          <div>
            {user.username} ({user.email})
          </div>
        </div>
      </div>
    )
  }
}

export default User
