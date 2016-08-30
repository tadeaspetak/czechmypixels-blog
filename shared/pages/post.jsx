import React from 'react';
import {connect} from 'react-redux';
import {needs} from 'lib/needs';
import * as PostActions from 'actions/PostActions';
import { Map } from 'immutable';
import Helmet from 'react-helmet';
import classnames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Swipeable from 'react-swipeable';
import Utils from 'lib/utils';
import PostDetail from 'components/postDetail';

/**
 * Post detail.
 */

@connect(state => ({posts: state.posts}))
@needs([props => {
  //post might have been preloaded from `home` -> in that case, skip loading it again
  let post = props.posts ? props.posts.get(props.params.slug) : false;
  if(post && post.preloaded){
      props.dispatch(PostActions.setPreloaded(props.params.slug, false));
      return;
  }
  return PostActions.getPost(props.params.slug);
}])
export default class Post extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  constructor(props){
    super(props);
    this.onKeyup = this.onKeyup.bind(this);
  }
  onKeyup(e){
    if(e.which === 65){
      this.handleSwipe('left');
    } else if (e.which === 83){
      this.handleSwipe('right');
    }
  }
  handleSwipe(direction){
    let picture = this.getPicture();
    if(picture){
      if(direction === 'left'){
        picture.handleGotoNext();
      } else if (direction === 'right'){
        picture.handleGotoPrevious();
      }
    }
  }
  handleClick(){
    let picture = this.getPicture();
    if(picture){
      picture.close();
    }
  }
  getPost(){
    return this.props.posts.get(this.props.params.slug) || {
      pictures: new Map(),
      latest: []
    };
  }
  getPicture(){
    let ref = this.refs['picture-' + this.props.location.pathname];
    return ref ? ref.getWrappedInstance() : false;
  }
  componentDidMount(){
    window.addEventListener('keyup', this.onKeyup);
  }
  componentWillUnmount(){
    window.removeEventListener('keyup', this.onKeyup);
  }
  render() {
    return(
      <main className="post">
        {/* helmet */}
        <Helmet
          title={`${this.getPost().title} | Czech My Pixels`}
          meta={[
            {property: "og:type", content: "article"},
            {property: "og:title", content: this.getPost().title},
            {property: "og:description", content: this.getPost().excerpt},
            {property: "og:image", content: `${this.getPost().banner ? Utils.normalizeUrl(this.getPost().banner.content) : ''}`}
          ]} />
        {/* picture navigation */}
        <Swipeable
          className={classnames('modal-pictures', this.props.params.picture ? 'visible' : 'hidden')}
          onSwipedLeft={() => this.handleSwipe('left')}
          onSwipedRight={() => this.handleSwipe('right')}
          onClick={() => this.handleClick()}>
          <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
            {this.props.children ? React.cloneElement(this.props.children, {
              key: this.props.location.pathname,
              post: this.getPost(),
              ref: 'picture-' + this.props.location.pathname
            }) : null}
          </ReactCSSTransitionGroup>
        </Swipeable>
        {/* page content => post */}
        <PostDetail
          dispatch={this.props.dispatch}
          slug={this.props.params.slug}
          posts={this.props.posts}
          post={this.getPost()} />
      </main>
    )
  }
}
