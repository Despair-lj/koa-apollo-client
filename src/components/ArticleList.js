import React, { Component, Fragment } from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Article from './Article'
import { LINKS_PER_PAGE } from '../utils/constants'
import { LoginContext } from '../utils/login-context'

export const FEED_QUERY = gql`
  query FeedQuery($page: Int, $pageSize: Int) {
    feed(page: $page, pageSize: $pageSize) {
      articles {
        id
        title
        content
        createdAt
        votes {
          id
        }
      }
      count
    }
  }
`

const NEW_ARTICLE_SUBSCRIPTION = gql`
  subscription {
    newArticle {
      id
      title
      content
      createdAt
      votes {
        id
      }
    }
  }
`

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
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

class ArticleList extends Component {
  componentDidMount() {
    const page = parseInt(this.props.match.params.page, 10)
    isNaN(page) && this.props.history.push('/new/1')
  }

  render() {
    return (
      <Query query={FEED_QUERY} variables={this._getQueryVariables()}>
        {({ loading, error, data, subscribeToMore }) => {
          if (loading) return <div>Fetching</div>
          if (error) return <div>Error</div>

          this._subscribeToNewArticles(subscribeToMore)
          this._subscribeToNewVotes(subscribeToMore)
          const articlesToRender = data.feed.articles

          if (articlesToRender.length === 0) {
            // this.props.history.push('/new/1')
            return null
          }

          return (
            <LoginContext.Consumer>
              {({ isLogin }) => {
                return (
                  <Fragment>
                    {articlesToRender.map((article, index) => (
                      <Article
                        index={index}
                        key={article.id}
                        article={article}
                        isLogin={isLogin}
                        updateStoreAfterVote={this._updateCacheAfterVote}
                      />
                    ))}
                    <div className="flex ml4 mv3 gray">
                      <div className="pointer mr2" onClick={this._previousPage}>
                        上一页
                      </div>
                      <div
                        className="pointer"
                        onClick={() => this._nextPage(data)}
                      >
                        下一页
                      </div>
                    </div>
                  </Fragment>
                )
              }}
            </LoginContext.Consumer>
          )
        }}
      </Query>
    )
  }

  // 在这里处理更新是因为在子控件中无法获取 this.props.match
  _updateCacheAfterVote = (store, vote, articleId) => {
    const variables = this._getQueryVariables()

    const data = store.readQuery({
      query: FEED_QUERY,
      variables
    })
    const votedLink = data.feed.articles.find(art => art.id === articleId)
    votedLink.votes = vote.article.votes
    store.writeQuery({ query: FEED_QUERY, data, variables })
  }

  // 返回 Query 所需的参数
  _getQueryVariables = () => {
    let page = parseInt(this.props.match.params.page, 10)
    page = page < 1 || isNaN(page) ? 1 : page
    return { page, pageSize: LINKS_PER_PAGE }
  }

  // 处理新文章的订阅
  _subscribeToNewArticles = subscribeToMore => {
    subscribeToMore({
      document: NEW_ARTICLE_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        console.log('pre article', subscriptionData, prev)
        if (!subscriptionData.data) return prev
        const newArticle = subscriptionData.data.newArticle
        const exists = prev.feed.articles.find(({ id }) => id === newArticle.id)
        if (exists) return prev

        return Object.assign({}, prev, {
          feed: {
            articles: [newArticle, ...prev.feed.articles],
            count: prev.feed.articles.length + 1,
            __typename: prev.feed.__typename
          }
        })
      }
    })
  }

  // 处理新点赞的订阅
  _subscribeToNewVotes = subscribeToMore => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION
    })
  }

  // 下一页
  _nextPage = data => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page < data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }

  // 上一页
  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page > 1) {
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }
}

export default ArticleList
