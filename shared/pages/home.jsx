import classnames from 'classnames';
import { Map, OrderedMap } from 'immutable';
import nprogress from 'nprogress';

import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import needs from '../lib/needs';
import * as PostStubActions from '../actions/PostStubActions';
import PostStub from '../components/postStub';
import Utils from '../lib/utils';

@connect(state => ({ postStubs: state.postStubs }))
@needs([() => PostStubActions.getPostStubs()])
export default class Home extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
    postStubs: React.PropTypes.instanceOf(OrderedMap)
  }
  constructor(params) {
    super(params);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.state = { loadingMore: false };
  }
  // get all the stubs
  getStubs() {
    return this.props.postStubs.get('stubs') || new Map();
  }
  // get stub total
  getTotal() {
    return this.props.postStubs.get('total') || 0;
  }
  // load more stubs
  handleLoadMore() {
    nprogress.start();
    this.setState({ loadingMore: true });
    this.props.dispatch(PostStubActions.getPostStubs(this.getStubs().size)).then(() => {
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
          <div className="post-stubs">{this.getStubs().valueSeq().map(stub => <PostStub key={stub.id} dispatch={this.props.dispatch} stub={stub} />)}</div>
          <button
            className={classnames('load-more', 'button-block', 'button-green', { hidden: this.getStubs().size >= this.getTotal() })}
            onClick={this.handleLoadMore} disabled={this.state.loadingMore}
          ><i className="fa fa-refresh" />Show Me More
          </button>
        </div>
      </main>);
  }
}
