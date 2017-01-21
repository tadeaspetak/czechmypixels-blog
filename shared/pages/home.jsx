import classnames from 'classnames';
import nprogress from 'nprogress';

import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import needs from '../lib/needs';
import { getPostStubs } from '../actions/PostStubActions';
import { getTrips } from '../actions/TripActions';
import PostStub from '../components/postStub';
import Trips from '../components/trips';
import Utils from '../lib/utils';

@connect(state => ({
  stubs: state.postStubs.get('stubs') ? state.postStubs.get('stubs').toArray() : [],
  total: state.postStubs.get('total') || 0,
  trips: state.trips.toArray() }))
@needs([() => getPostStubs(), () => getTrips()])
export default class Home extends React.Component {
  constructor(params) {
    super(params);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.state = { loadingMore: false };
  }
  // load more stubs
  handleLoadMore() {
    nprogress.start();
    this.setState({ loadingMore: true });
    this.props.dispatch(getPostStubs(this.props.stubs.size)).then(() => {
      this.setState({ loadingMore: false });
      nprogress.done();
    });
  }
  render() {
    return (
      <main className="home">
        <Helmet
          title="Home | Czech My Pixels"
          meta={[
            { property: 'og:type', content: 'article' },
            { property: 'og:title', content: 'Czech My Pixels' },
            { property: 'og:description', content: 'Pictures and scribbles from some of our travels \'round this blue planet.' },
            { property: 'og:image', content: Utils.absoluteUrl('/media/header-fb.jpg') },
            { property: 'og:image:width', content: 3000 },
            { property: 'og:image:height', content: 1575 }
          ]}
        />
        <div className="container">
          <div className="post-stubs">
            {this.props.stubs.map(stub =>
              <PostStub key={stub.id} dispatch={this.props.dispatch} stub={stub} />)
            }
          </div>
          <button
            className={classnames('load-more', 'button-block', 'button-green', {
              hidden: this.props.stubs.length >= this.props.total
            })}
            onClick={this.handleLoadMore} disabled={this.state.loadingMore}>
            <i className="fa fa-refresh" />Show Me More
          </button>
          <Trips trips={this.props.trips} />
        </div>
      </main>);
  }
}

Home.propTypes = {
  dispatch: PropTypes.func,
  stubs: PropTypes.arrayOf(),
  total: PropTypes.number,
  trips: PropTypes.arrayOf()
};
