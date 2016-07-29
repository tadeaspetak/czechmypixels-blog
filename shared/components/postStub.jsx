import React from 'react';

/**
 * Post stub shown on the home page and when filtering.
 */

export default class PostStub extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  handleClick(){
    this.context.router.push(`post/${this.props.post.slug}`);
  }
  render() {
    return (
      <div className="post-stub" onClick={this.handleClick.bind(this)} style={{
          backgroundImage: `url("${this.props.post.colourBanner.colourBanner}")`
        }}>
        <div className="post-stub-contents">
          <h2>{this.props.post.title}</h2>
          <div className="post-stub-body">
            <div className="post-stub-description" dangerouslySetInnerHTML={{__html: this.props.post.excerptHtml}}></div>
          </div>
        </div>
      </div>
    )
  }
}
//<img className="post-stub-banner" alt="" src={this.props.post.banner.banner} />
//<img className="post-stub-thumbnail" alt="" src={this.props.post.thumbnail.thumbnail} />
