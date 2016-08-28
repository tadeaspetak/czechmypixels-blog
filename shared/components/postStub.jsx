import utils from 'lib/utils';
import React from 'react';
import * as PostActions from 'actions/PostActions';
import nprogress from 'nprogress';
import Utils from 'lib/utils';

/**
 * Post stub shown on the home page and when filtering.
 */

export default class PostStub extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  //load the post before changing views
  handleStubClick(){
    nprogress.start();
    this.props.dispatch(PostActions.getPost(this.props.stub.slug)).then(() => {
      this.props.dispatch(PostActions.setPreloaded(this.props.stub.slug, true));
      this.context.router.push(`post/${this.props.stub.slug}`);
      nprogress.done();
    });
  }
  render() {
    return (
      <div className="post-stub" onClick={this.handleStubClick.bind(this)} style={{
          backgroundImage: `url("${Utils.getDensityAwareUrl(this.props.stub.colourBanner)}")`
        }}>
        <div className="post-stub-contents">
          <h2>{this.props.stub.title}</h2>
          <div className="post-stub-body">{this.props.stub.excerpt}</div>
        </div>
      </div>
    )
  }
}
