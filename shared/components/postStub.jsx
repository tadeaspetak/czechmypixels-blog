import utils from 'lib/utils';
import React from 'react';

/**
 * Post stub shown on the home page and when filtering.
 */

export default class PostStub extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  render() {
    return (
      <div className="post-stub" onClick={() => this.context.router.push(`post/${this.props.stub.slug}`)} style={{
          backgroundImage: `url("${this.props.stub.colourBanner}")`
        }}>
        <div className="post-stub-contents">
          <h2>{this.props.stub.title}</h2>
          <div className="post-stub-body">{this.props.stub.excerpt}</div>
        </div>
      </div>
    )
  }
}
