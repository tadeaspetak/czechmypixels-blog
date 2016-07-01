import React from 'react';

/**
 * Post stub shown on the home page and when filtering.
 */

export default class PostStub extends React.Component {
  handleClick(){
    this.context.router.push(`post/${this.props.post.slug}`);
  }
  render() {
    return (
      <div className="post-stub" onClick={this.handleClick.bind(this)}>
        <h2>{this.props.post.title}</h2>
        <div className="post-stub-body">
          <img className="post-stub-thumbnail" alt="" src={this.props.post.thumbnail.thumbnail} />
          <div className="post-stub-description" dangerouslySetInnerHTML={{__html: this.props.post.excerptHtml}}></div>
        </div>
      </div>
    )
  }
}

//router context
PostStub.contextTypes = {
  router: React.PropTypes.object.isRequired
}
