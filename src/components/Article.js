import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { timeDifferenceForDate } from '../util'

const VOTE_MUTATION = gql`
  mutation VoteMutation($articleId: String!) {
    vote(articleId: $articleId) {
      id
      article {
        id
        title
        content
        createdAt
        votes {
          id
        }
      }
    }
  }
`

class Article extends Component {
  render() {
    const { isLogin, article } = this.props
    return (
      <div className="flex mt2 items-start">
        <div className="flex items-center">
          <span className="gray">{this.props.index + 1}.</span>
          {isLogin && (
            <Mutation
              mutation={VOTE_MUTATION}
              variables={{ articleId: article.id }}
              update={(store, { data: { vote } }) =>
                this.props.updateStoreAfterVote(store, vote, article.id)
              }
              onError={({ graphQLErrors }) => {
                const message = graphQLErrors[0].state.message || '错误'
                alert(message)
              }}
            >
              {mutation => (
                <div className="ml1 gray f11 vote" onClick={mutation}>
                  ▲
                </div>
              )}
            </Mutation>
          )}
        </div>
        <div className="ml1">
          <div>
            {article.title} ({article.content})
          </div>
          <div className="f6 lh-copy gray">
            {article.votes.length} 人点赞👍{' '}
            {timeDifferenceForDate(article.createdAt)}
          </div>
        </div>
      </div>
    )
  }
}

export default Article
