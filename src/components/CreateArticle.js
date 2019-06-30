import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { FEED_QUERY } from './ArticleList'
import { LINKS_PER_PAGE } from '../utils/constants'

const POST_MUTATION = gql`
  mutation PostMutation($title: String!, $content: String!) {
    post(title: $title, content: $content) {
      id
      title
      content
      createdAt
      votes {
        id
        createdAt
      }
    }
  }
`

class CreateArticle extends Component {
  state = {
    title: 'title',
    content: 'content'
  }

  render() {
    const { title, content } = this.state
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={title}
            onChange={e => this.setState({ title: e.target.value })}
            type="text"
            placeholder="标题"
          />
          <input
            className="mb2"
            value={content}
            onChange={e => this.setState({ content: e.target.value })}
            type="text"
            placeholder="内容"
          />
        </div>
        <Mutation
          mutation={POST_MUTATION}
          variables={{ title, content }}
          onCompleted={() => this.props.history.push('/')}
          update={(store, { data: post }) => {
            console.log(store, post)
            const variables = {
              page: 1,
              pageSize: LINKS_PER_PAGE
            }

            try {
              // 当没有请求过 feed(page:1, pageSize: 5） 的时候，这时候 readQuery 会报错
              // 例如直接访问 /new/2 后再跳转到 create, 或者是直接访问 create, 这时就会返回错误
              const data = store.readQuery({
                query: FEED_QUERY,
                variables
              })
              data.feed.articles.unshift(post.post)
              store.writeQuery({
                query: FEED_QUERY,
                data,
                variables
              })
            } catch (error) {
              console.log('e', error)
            }
          }}
        >
          {postMutation => <button onClick={postMutation}>提交</button>}
        </Mutation>
      </div>
    )
  }
}

export default CreateArticle
