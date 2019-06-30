import React, { Component, Fragment } from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import User from './User'

export const USER_QUERY = gql`
  query UserQuery{
    users {
      username
      email
      id
      isDelete
    }
  }
`

class UserList extends Component {
  render() {
    return (
      <Query query={USER_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <div>Fetching</div>
          if (error) return <div>Error</div>

          const usersToRender = data.users || []
          return (
            <Fragment>
              {usersToRender.map((user, index) => (
                <User index={index} key={user.id} user={user} />
              ))}
            </Fragment>
          )
        }}
      </Query>
    )
  }
}

export default UserList
