import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Article'

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      articles {
        id
        title
        content
        createdAt
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

class Search extends Component {
  state = {
    articles: [],
    filter: ''
  }

  render() {
    return (
      <div>
        <div>
          搜索
          <input
            type="text"
            onChange={e => this.setState({ filter: e.target.value })}
          />
          <button onClick={() => this._executeSearch()}>OK</button>
        </div>
        {this.state.articles.map((article, index) => (
          <Link key={article.id} article={article} index={index} />
        ))}
      </div>
    )
  }

  _executeSearch = async () => {
    const { filter } = this.state
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter }
    })
    const articles = result.data.feed.articles
    this.setState({ articles })
  }
}

export default withApollo(Search)
