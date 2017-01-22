import classnames from 'classnames';
import { Map, OrderedMap } from 'immutable';

import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Swipeable from 'react-swipeable';

import needs from '../lib/needs';
import PostDetail from '../components/postDetail';
import * as PostActions from '../actions/PostActions';
import Utils from '../lib/utils';

@connect(state => ({ posts: state.posts }))
@needs([(props) => {
  // post might have been preloaded from `home` -> in that case, skip loading it again
  const post = props.posts ? props.posts.get(props.params.slug) : false;
  if (post && post.preloaded) {
    props.dispatch(PostActions.setPreloaded(props.params.slug, false));
    return;
  }
  return PostActions.getPost(props.params.slug); // eslint-disable-line consistent-return
}])
export default class Post extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ]),
    dispatch: React.PropTypes.func,
    location: React.PropTypes.shape({
      pathname: React.PropTypes.string
    }),
    params: React.PropTypes.shape({
      picture: React.PropTypes.string,
      slug: React.PropTypes.string
    }),
    posts: React.PropTypes.instanceOf(OrderedMap)
  }
  static onClose() {
    if (Utils.isFullscreen()) {
      Utils.exitFullscreen();
    }
  }
  constructor(props) {
    super(props);
    this.onKeyup = this.onKeyup.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    window.addEventListener('keyup', this.onKeyup);
  }
  componentWillUnmount() {
    window.removeEventListener('keyup', this.onKeyup);
  }
  onKeyup(e) {
    if (e.which === 65) {
      this.handleSwipe('left');
    } else if (e.which === 83) {
      this.handleSwipe('right');
    }
  }
  getPost() {
    return this.props.posts.get(this.props.params.slug) || {
      pictures: new Map(),
      latest: []
    };
  }
  getPicture() {
    const ref = this.refs[`picture-${this.props.location.pathname}`]; // eslint-disable-line react/no-string-refs
    return ref ? ref.getWrappedInstance() : false;
  }
  handleGotoPrevious(e) {
    if (e) e.stopPropagation();
    this.getPicture().handleGotoPrevious();
  }
  handleGotoNext(e) {
    if (e) e.stopPropagation();
    this.getPicture().handleGotoNext();
  }
  handleClick(e) {
    e.stopPropagation();
    this.getPicture().close();
  }
  handleFullscreen(e) {
    if (e) e.stopPropagation(e);
    if (Utils.isFullscreen()) {
      Utils.exitFullscreen();
    } else {
      // eslint-disable-next-line react/no-find-dom-node
      Utils.requestFullscreen(ReactDOM.findDOMNode(this.swipeable));
    }
  }
  render() {
    return (
      <main className="post">
        {/* helmet */}
        <Helmet
          title={`${this.getPost().title} | Czech My Pixels`}
          meta={[
            { property: 'og:type', content: 'article' },
            { property: 'og:title', content: this.getPost().title },
            { property: 'og:description', content: this.getPost().excerpt },
            { property: 'og:image', content: `${this.getPost().banner ? Utils.absoluteUrl(this.getPost().banner.content) : ''}` },
            { property: 'og:image:width', content: `${this.getPost().banner ? this.getPost().banner.width : 0}` },
            { property: 'og:image:height', content: `${this.getPost().banner ? this.getPost().banner.height : 0}` }]}
        />
        {/* picture navigation */}
        <Swipeable
          ref={(swipeable) => { this.swipeable = swipeable; }}
          className={classnames('modal-pictures', this.props.params.picture ? 'visible' : 'hidden')}
          onSwipedRight={() => this.handleGotoPrevious()}
          onSwipedLeft={() => this.handleGotoNext()}
          onClick={(e) => { this.handleClick(e); }}
        >
          <a className="picture-previous" onClick={e => this.handleGotoPrevious(e)}><i className="fa fa-angle-left" /></a>
          <a className="picture-next" onClick={e => this.handleGotoNext(e)}><i className="fa fa-angle-right" /></a>
          <a className="picture-close" onClick={(e) => { this.handleClick(e); }}><i className="fa fa-times" /></a>
          <a className="picture-fullscreen" onClick={e => this.handleFullscreen(e)}><i className="fa fa-arrows-alt" /></a>
          <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
            {this.props.children ? React.cloneElement(this.props.children, {
              key: this.props.location.pathname,
              post: this.getPost(),
              ref: `picture-${this.props.location.pathname}`,
              onClose: Post.onClose
            }) : null}
          </ReactCSSTransitionGroup>
        </Swipeable>
        {/* page content => post */}
        <PostDetail
          dispatch={this.props.dispatch}
          slug={this.props.params.slug}
          posts={this.props.posts}
          post={this.getPost()}
        />
      </main>
    );
  }
}
