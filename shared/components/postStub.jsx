import moment from 'moment';
import nprogress from 'nprogress';

import React from 'react';

import * as PostActions from '../actions/PostActions';
import Utils from '../lib/utils';

export default class PostStub extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  static propTypes = {
    dispatch: React.PropTypes.func,
    stub: React.PropTypes.shape({
      published: React.PropTypes.string,
      slug: React.PropTypes.string,
      square: React.PropTypes.string,
      title: React.PropTypes.title,
      trip: React.PropTypes.shape({
        title: React.PropTypes.string
      })
    })
  }
  constructor(props) {
    super(props);
    this.handleStubClick = this.handleStubClick.bind(this);
  }
  // load the post before changing views
  handleStubClick() {
    nprogress.start();
    this.props.dispatch(PostActions.getPost(this.props.stub.slug)).then(() => {
      this.props.dispatch(PostActions.setPreloaded(this.props.stub.slug, true));
      this.context.router.push(`/post/${this.props.stub.slug}`);
      nprogress.done();
    });
  }
  render() {
    return (
      <div
        className="post-stub" onClick={this.handleStubClick}
        style={{ backgroundImage: `url("${Utils.getDensityAwareUrl(this.props.stub.square)}")` }}
      >
        <div className="post-stub-contents">
          <h2>{this.props.stub.title}</h2>
          <div className="post-stub-date">{moment(this.props.stub.published).format('MMM DD, YYYY')}</div>
          <div className="post-stub-trip">{this.props.stub.trip.title}</div>
        </div>
      </div>
    );
  }
}
