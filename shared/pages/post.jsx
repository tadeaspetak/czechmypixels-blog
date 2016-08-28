import React from 'react';
import {connect} from 'react-redux';
import {needs} from 'lib/needs';
import * as PostActions from 'actions/PostActions';
import { Map } from 'immutable';
const _ = require('lodash');
import Helmet from 'react-helmet';

import classnames from 'classnames';
import moment from 'moment';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import FunkyGallery from 'lib/FunkyGallery';
import Swipeable from 'react-swipeable';
import Utils from 'lib/utils';
import nprogress from 'nprogress';

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
  static sizes = [{
    min: 320,
    max: 480,
    gap: 8,
    rowHeight: () => 80 + _.random(0, 10) * 5,
    rowWidth: () => Post.getAvailableWidth()
  }, {
    min: 480,
    max: 768,
    gap: 8,
    rowHeight: () => 120 + _.random(0, 10) * 5,
    rowWidth: () => Post.getAvailableWidth()
  }, {
    min: 768,
    max: 1224,
    gap: 8,
    rowHeight: () => 150 + _.random(0, 10) * 5,
    rowWidth: 720
  }, {
    min: 1224,
    max: 0,
    gap: 8,
    rowHeight: () => 300 + _.random(0, 10) * 5,
    rowWidth: 1200
  }]
  static getAvailableWidth = () => {
    return Utils.getDimensions().width * .9;
  }
  constructor(props){
    super(props);
    this.state = {
      isShownFull: false,
      isReadOnNecessary: false,
      isFunky: false,
      pictures: [],
      nav: {position: 'absolute', top:'20px', left: '0px'}
    };

    //event handlers (bind them to `this`)
    this.onKeyup = this.onKeyup.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }
  handlePicutreClick(picture){
    nprogress.start();
    Utils.loadImage(Utils.getDensityAwareUrl(picture.content)).then(() => {
      this.props.dispatch(PostActions.changePicture('none'));
      this.context.router.push(`post/${this.getPost().slug}/${picture.name}`);
      nprogress.done();
    });
  }
  onKeyup(e){
    if(e.which === 65){
      this.handleSwipe('left');
    } else if (e.which === 83){
      this.handleSwipe('right');
    }
  }
  onResize(){
    // this is just a fake resize, mostl likely on a mobile device where resize is called
    // on scroll since scrollbar is added and removed from the window...
    if(this.width === Utils.getDimensions().width){
      return;
    }

    this.width = Utils.getDimensions().width;
    let current = this.getSize();
    if(current !== this.size || Utils.getViewport().width < 768) this.repaint(current);
  }
  onScroll(){
    let nav = this.getNav();
    if(!_.isEqual(this.state.nav, nav)){
      this.setState({nav: nav});
    }
  }
  getNav(){
    let contents = document.getElementById('post-contents');
    let contentsCoords = this.getCoords(contents);
    let scroll = this.getScroll();

    let navigation = document.getElementById('post-navigation');
    //console.log(contents.offsetHeight, navigation.offsetHeight);

    if(contentsCoords.top > scroll.top){
      return {position: 'absolute', top: `30px`, left: `0px`};
    } else if ((contentsCoords.bottom - navigation.offsetHeight - 30) < scroll.top){
      return {position: 'absolute', top: `${contents.offsetHeight - navigation.offsetHeight - 20}px`, left: `0px`};
    } else {
      return {position: `fixed`, top: `30px`, left: `${this.getCoords(document.getElementById('post-container')).left}px`};
    }
  }
  getCoords(element) {
    let box = element.getBoundingClientRect();
    let scroll = this.getScroll();
    let client = this.getClient();

    return {
      top: Math.round(box.top +  scroll.top - client.top),
      right: Math.round(box.right +  scroll.left - client.left),
      bottom: Math.round(box.bottom +  scroll.top - client.top),
      left: Math.round(box.left + scroll.left - client.left)
    };
  }
  getClient(){
    return {
      top: document.documentElement.clientTop || document.body.clientTop || 0,
      left: document.documentElement.clientLeft || document.body.clientLeft || 0
    }
  }
  getScroll(){
    return {
      top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
      left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft
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
  //as only parameter in the route is changing, the loading needs to be handled manually
  handleGotoPost(post){
    nprogress.start();
    this.props.dispatch(PostActions.getPost(post.slug)).then(() => {
      this.context.router.push(`post/${post.slug}`);
      nprogress.done();
    });
  }
  repaint(size = this.getSize(), props = this.props){
    this.size = size;
    if(this.size){
      this.setState({
        isFunky: true,
        pictures: FunkyGallery
          .funkify(props.posts.get(props.params.slug).pictures, this.size)
          .reduce((previous, current) => {
            //tag the last element in the collection as last
            if(current.length) _.last(current).funky.isLast = true;
            return previous.concat(current);
          }, [])
      });
    } else {
      this.setState({
        isFunky: false,
        pictures: props.posts.get(props.params.slug).pictures
      });
    }
    this.resolveReadOn();
  }
  getSize(){
    let width = Utils.getViewport().width;
    return Post.sizes.filter(size => (!size.min || size.min <= width) && (!size.max || size.max > width))[0];
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
  getPictures(props = this.props){
    let post = props.posts.get(props.params.slug);
    return post ? post.pictures : false;
  }
  componentWillMount(){
    if(this.getPost().pictures.length){
      this.repaint();
    }
  }
  componentDidMount(){
    window.addEventListener('keyup', this.onKeyup);
    window.addEventListener('resize', this.onResize);
    window.addEventListener('scroll', this.onScroll);
  }
  componentWillUnmount(){
    window.removeEventListener('keyup', this.onKeyup);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onScroll);
  }
  componentWillReceiveProps(next){
    //changing
    /*if(this.props.params.slug !== next.params.slug){
      this.repaint(this.getSize(), next);
    }*/

    if(!this.getPictures() || !_.isEqual(this.getPictures(), this.getPictures(next))){
      this.repaint(this.getSize(), next);
    }
  }
  componentDidUpdate(){
    this.resolveReadOn();

    //if scroll bar has been added due to content changes, pictures need to be re-rendered
    if(!this.width || Utils.getDimensions().width < this.width){
      this.width = Utils.getDimensions().width;
      this.repaint();
    }
  }
  getPlain(){
    return this.state.pictures.map(picture => {
      return (<a key={picture.id} className={classnames('plain-image')} onClick={() => this.handlePicutreClick(picture)}>
          <img src={Utils.getDensityAwareUrl(picture.thumbnail)} alt="" />
          <span className={classnames('image-description', {visible: picture.description})}>{picture.description}</span>
      </a>);
    })
  }
  getFunky(){
    return this.state.pictures.map(picture => {
      return (<a key={picture.id} className={classnames('funky-image', {last: picture.funky.isLast})} onClick={() => this.handlePicutreClick(picture)} style={{
        height: `${picture.funky.height}px`,
        width: `${picture.funky.cropWidth}px`,
        backgroundImage: `url("${Utils.getDensityAwareUrl(picture.thumbnail)}")`,
        backgroundSize: `${picture.funky.resizedWidth}px ${picture.funky.height}px`
      }}>
        <span className={classnames('image-description', {visible: picture.html})} dangerouslySetInnerHTML={{__html: picture.html}} />
      </a>)
    });
  }
  resolveReadOn(){
    //execute only on client
    /*if(process.env.BROWSER){
      let postBody = document.getElementsByClassName("post-body")[0];
      if(postBody && this.state.isReadOnNecessary !== postBody.scrollHeight > postBody.offsetHeight){
        this.setState({isReadOnNecessary: postBody.scrollHeight > postBody.offsetHeight});
      }
    }*/
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
            {property: "og:description", content: this.getPost().excerptHtml},
            {property: "og:image", content: `http://czechmypixels.com${this.getPost().banner ? this.getPost().banner.content : ''}`}
          ]} />
        {/* pictures */}
        <Swipeable
          className={classnames('modal-pictures', this.props.params.picture ? 'visible' : 'hidden')}
          onSwipedLeft={() => this.handleSwipe('left')}
          onSwipedRight={() => this.handleSwipe('right')}
          onClick={() => this.context.router.push(`post/${this.props.params.slug}`)}>
          <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
            {this.props.children ? React.cloneElement(this.props.children, {
              key: this.props.location.pathname,
              ref: 'picture-' + this.props.location.pathname
            }) : null}
          </ReactCSSTransitionGroup>
        </Swipeable>
        {/* banner */}
        <div className="banner" style={{backgroundImage: this.getPost().banner ? `url("${Utils.getDensityAwareUrl(this.getPost().banner.banner)}")` : false}} />
        <img className="banner" alt="" src={this.getPost().banner ? Utils.getDensityAwareUrl(this.getPost().banner.banner) : ''} />
        {/* page content => post */}
        <div id="post-container" className="container">
          <article id="post-contents" className="post">
            {/* post meta*/}
            <div className="post-meta">
              <h1 className="post-heading">{this.getPost().title}</h1>
              <span className="post-details">
                Published on <span className="post-details-date">{moment(this.getPost().date).format('MMM DD, YYYY')}</span>
              </span>
            </div>
            {/* post body & show more button */}
            <div
              className={classnames('post-body', {'full': this.state.isShownFull})}
              dangerouslySetInnerHTML={{__html: this.getPost().contentHtml}}></div>
            {/* <div className={classnames('show-more', {'visible': !this.state.isShownFull && this.state.isReadOnNecessary})}>
              <a className="button show-more" onClick={() => this.setState({isShownFull: true})}><i className="fa fa-level-down" />... read on!</a>
            </div> */}
          </article>
          {/* image gallery */}
          <div className="image-gallery">{this.state.isFunky ? this.getFunky() : this.getPlain()}</div>
          {/* post navigation */}
          <nav id="post-navigation" style={{
              position: this.state.nav.position,
              top: this.state.nav.top,
              left: this.state.nav.left
            }}>
            <h2 className="latest">Latest posts</h2>
            <ul className="latest">
              {this.getPost().latest.map(latest => {
                return (<li key={latest.id}><a onClick={() => this.handleGotoPost(latest)}>{latest.title}</a></li>)
              })}

            </ul>
          </nav>
        </div>
      </main>
    )
  }
}

/*

<li><a onClick={() => this.handleGotoPost(this.getPost().previous)}>Previous: {this.getPost().previous.title}</a></li>
<li><a onClick={() => this.handleGotoPost(this.getPost().next)}>Next: {this.getPost().next.title}</a></li>

<p className="smaller">
  <em>You are reading part #3 in the Southeast Asia 2015/2016 trip.
    There are <strong>13</strong> posts in total from this trip, make
    sure to check them out all!
  </em>
</p>
<a className="button button-block button-green"><i className="fa fa-map-o"></i>All posts from the trip</a>
 */
