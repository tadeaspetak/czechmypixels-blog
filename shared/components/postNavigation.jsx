import _  from 'lodash';
import React from 'react';
import * as PostActions from 'actions/PostActions';
import nprogress from 'nprogress';
import Utils from 'lib/utils';

/**
 * Post navigation.
 *
 * Depending on the screen size, there are two ways it can behave:
 *  - on large screens (>= 1200px), there is a sticky navigation staying in between
 *    the post's banner and gallery; simultaneously, there are navigation buttons
 *    below the gallery
 *  - on any other screen size (< 1200px), threre is a single navigation component
 *    shown below the gallery
 */

export default class PostNavigation extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  constructor(props){
    super(props);
    this.state = {
      style: {}
    };
    this.onResize = this.onResize.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }
  componentDidMount(){
    window.addEventListener('resize', this.onResize);
    window.addEventListener('scroll', this.onScroll);
  }
  componentWillUnmount(){
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onScroll);
  }
  onResize(){
    //make sure to clear the navigation style if the screen is not large
    if(Utils.getDimensions().width < 1224 && this.state.style.position){
      this.setState({style: {}});
    }
  }
  onScroll(){
    let style = this.getStyle();
    if(Utils.getDimensions().width >= 1224 && !_.isEqual(this.state.style, style)){
      this.setState({style: style});
    }
  }
  getStyle(){
    let contents = document.getElementById('post-contents');
    let contentsCoords = Utils.getCoords(contents);
    let scroll = Utils.getScroll();
    let navigation = document.getElementById('post-navigation-main');

    if(contentsCoords.top > scroll.top){
      return {position: 'absolute', top: `10px`, left: `0px`};
    } else if ((contentsCoords.bottom - navigation.offsetHeight - 14) < scroll.top){
      return {position: 'absolute', top: `${contents.offsetHeight - navigation.offsetHeight - 4}px`, left: `0px`};
    } else {
      return {position: `fixed`, top: `10px`, left: `${Utils.getCoords(document.getElementById('post-container')).left}px`};
    }
  }
  //as only parameter in the route is changing, the loading needs to be handled manually
  handleGotoPost(post){
    nprogress.start();
    this.props.dispatch(PostActions.getPost(post.slug)).then(loaded => {
      //load the banner first, feels much smoother then
      Utils.loadImage(this.props.posts.get(post.slug).banner.content).then(() => {
        this.context.router.push(`post/${post.slug}`);
        nprogress.done();
      });
    });
  }
  hasPrevious(){
    return this.props.post.previous;
  }
  getPrevious(){
    return !this.hasPrevious() ? undefined : (
      <button className="button-block post-previous" onClick={() => this.handleGotoPost(this.props.post.previous)}>
        <i className="fa fa-chevron-left"></i>{this.props.post.previous.title}
      </button>);
  }
  getSupplementaryPrevious(){
    return (<button className="post-previous" onClick={() => this.hasPrevious() ? this.handleGotoPost(this.props.post.previous) : ''} disabled={!this.hasPrevious()}>
        {this.hasPrevious() ? (<i className="fa fa-chevron-left"></i>) : ''}
        {this.hasPrevious() ? this.props.post.previous.title : '... this is the initial post of this trip.'}
      </button>);
  }
  hasNext(){
    return this.props.post.next;
  }
  getNext(){
    return !this.hasNext() ? undefined : (
      <button className="button button-block post-next" onClick={() => this.handleGotoPost(this.props.post.next)}>
        {this.props.post.next.title} <i className="fa fa-chevron-right"></i>
    </button>);
  }
  getSupplementaryNext(){
    return (<button className="post-next" onClick={() => this.hasNext() ? this.handleGotoPost(this.props.post.next) : ''} disabled={!this.hasNext()}>
        {this.hasNext() ? this.props.post.next.title : 'This is the final post of this trip...'}
        {this.hasNext() ? (<i className="fa fa-chevron-right"></i>) : ''}
    </button>);
  }
  render() {
    return (<div className="post-navigation">
      {/* main navigation */}
      <nav id="post-navigation-main" style={this.state.style.position ? {
          position: this.state.style.position,
          top: this.state.style.top,
          left: this.state.style.left
        } : {}}>
        {this.getPrevious()}
        {this.getNext()}
        <div className="latest">
          <h2><i className="fa fa-pencil-square-o"></i>Latest posts</h2>
          <ul>
            {this.props.post.latest.map(latest => {
              return (<li key={latest.id}><a onClick={() => this.handleGotoPost(latest)}>{latest.title}</a></li>)
            })}
          </ul>
        </div>

        <button className="button-block button-green post-all" onClick={() => this.context.router.push('/')}>
          <i className="fa fa-map-signs"></i>Back to All Posts
        </button>
      </nav>
      {/* supplementary navigation for larger screens */}
      <div className="post-navigation-supplementary">
        {this.getSupplementaryPrevious()}
        {this.getSupplementaryNext()}
        <button className="button-green post-all" onClick={() => this.context.router.push('/')}>
          <i className="fa fa-map-signs"></i>Back to All Posts
        </button>
      </div>
    </div>);
  }
}
