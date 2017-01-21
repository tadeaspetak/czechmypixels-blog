import moment from 'moment';
import nprogress from 'nprogress';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import * as PostActions from '../actions/PostActions';
import Utils from '../lib/utils';

@connect()
export default class PostStub extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.handleStubClick = this.handleStubClick.bind(this);
    this.handleTripClick = this.handleTripClick.bind(this);
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
  handleTripClick(e, slug) {
    e.preventDefault();
    e.stopPropagation();
    this.context.router.push(`/trip/${slug}`);
  }
  render() {
    return (
      <div
        className="post-stub"
        onClick={this.handleStubClick}
        style={{ backgroundImage: `url("${Utils.getDensityAwareUrl(this.props.stub.square.square)}")` }}>
        <div className="post-stub-contents">
          <h2>{this.props.stub.title}</h2>
          <div className="post-stub-date"><em>{moment(this.props.stub.published).format('MMM DD, YYYY')}</em></div>
          {this.props.hasTrip !== false && <div className="post-stub-trip">Trip
            <span onClick={(e) => { this.handleTripClick(e, this.props.stub.trip.slug); }}>
              {this.props.stub.trip.title}
            </span>
          </div>}
        </div>
      </div>
    );
  }
}

PostStub.propTypes = {
  dispatch: PropTypes.func,
  hasTrip: PropTypes.bool,
  stub: PropTypes.shape({
    published: PropTypes.string,
    slug: PropTypes.string,
    square: PropTypes.shape({ square: PropTypes.string }),
    title: PropTypes.title,
    trip: PropTypes.shape({
      slug: PropTypes.string,
      title: PropTypes.string
    })
  })
};
