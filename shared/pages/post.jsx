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
import utils from 'lib/utils';

/**
 * Post detail.
 */

@connect(state => ({posts: state.posts}))
@needs([params => PostActions.getPost(params.slug)])
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
    return utils.getDimensions().width * .9;
  }
  constructor(props){
    super(props);
    this.state = {
      isShownFull: false,
      isReadOnNecessary: false,
      isFunky: false,
      pictures: []
    };
    this.onResize = this.onResize.bind(this);
    this.onKeyup = this.onKeyup.bind(this);
  }
  handlePicutreClick(picture){
    this.props.dispatch(PostActions.changePicture('none'));
    this.context.router.push(`post/${this.getPost().slug}/${picture.name}`);
  }
  onResize(){
    // this is just a fake resize, mostl likely on a mobile device where resize is called
    // on scroll since scrollbar is added and removed from the window...
    if(this.width === utils.getDimensions().width){
      return;
    }

    this.width = utils.getDimensions().width;
    let current = this.getSize();
    if(current !== this.size || utils.getViewport().width < 768) this.repaint(current);
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
  repaint(size = this.getSize(), props = this.props){
    this.size = size;
    if(this.size){
      this.setState({
        isFunky: true,
        pictures: FunkyGallery
          .funkify(props.posts.get(this.props.params.slug).pictures, this.size)
          .reduce((previous, current) => {
            //tag the last element in the collection as last
            if(current.length) _.last(current).funky.isLast = true;
            return previous.concat(current);
          }, [])
      });
    } else {
      this.setState({
        isFunky: false,
        pictures: props.posts.get(this.props.params.slug).pictures
      });
    }
    this.resolveReadOn();
  }
  getSize(){
    let width = utils.getViewport().width;
    return Post.sizes.filter(size => (!size.min || size.min <= width) && (!size.max || size.max > width))[0];
  }
  getPost(){
    return this.props.posts.get(this.props.params.slug) || {
      pictures: new Map()
    };
  }
  getPicture(){
    let ref = this.refs['picture-' + this.props.location.pathname];
    return ref ? ref.getWrappedInstance() : false;
  }
  getPictures(props = this.props){
    let post = props.posts.get(this.props.params.slug);
    return post ? post.pictures : false;
  }
  componentWillMount(){
    if(this.getPost().pictures.length){
      this.repaint();
    }
  }
  componentDidMount(){
    window.addEventListener('resize', this.onResize);
    window.addEventListener('keyup', this.onKeyup);
  }
  componentWillUnmount(){
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keyup', this.onKeyup);
  }
  componentWillReceiveProps(next){
    if(!this.getPictures() || this.getPictures() !== this.getPictures(next)){
      this.repaint(this.getSize(), next);
    }
  }
  componentDidUpdate(){
    this.resolveReadOn();

    //if scroll bar has been added due to content changes, pictures need to be re-rendered
    if(!this.width || utils.getDimensions().width < this.width){
      this.width = utils.getDimensions().width;
      this.repaint();
    }
  }
  getPlain(){
    return this.state.pictures.map(picture => {
      return (<a key={picture.id} className={classnames('plain-image')} onClick={() => this.handlePicutreClick(picture)}>
          <img src={picture.thumbnail} alt="" />
          <span className={classnames('image-description', {visible: picture.description})}>{picture.description}</span>
      </a>);
    })
  }
  getFunky(){
    return this.state.pictures.map(picture => {
      return (<a key={picture.id} className={classnames('funky-image', {last: picture.funky.isLast})} onClick={() => this.handlePicutreClick(picture)} style={{
        height: `${picture.funky.height}px`,
        width: `${picture.funky.cropWidth}px`,
        backgroundImage: `url("${picture.thumbnail}")`,
        backgroundSize: `${picture.funky.resizedWidth}px ${picture.funky.height}px`
      }}>
        <span className={classnames('image-description', {visible: picture.html})} dangerouslySetInnerHTML={{__html: picture.html}} />
      </a>)
    });
  }
  resolveReadOn(){
    //execute only on client
    if(process.env.BROWSER){
      let postBody = document.getElementsByClassName("post-body")[0];
      if(postBody && this.state.isReadOnNecessary !== postBody.scrollHeight > postBody.offsetHeight){
        this.setState({isReadOnNecessary: postBody.scrollHeight > postBody.offsetHeight});
      }
    }
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
        <div className="banner" style={{backgroundImage: this.getPost().banner ? `url("${this.getPost().banner.banner}")` : false}} />
        <img className="banner" alt="" src={this.getPost().banner ? this.getPost().banner.banner : ''} />
        {/* page content => post */}
        <div className="container">
          <article className="post">
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
            <div className={classnames('show-more', {'visible': !this.state.isShownFull && this.state.isReadOnNecessary})}>
              <a className="button show-more" onClick={() => this.setState({isShownFull: true})}><i className="fa fa-level-down" />... read on!</a>
            </div>
          </article>
          {/* image gallery */}
          <div className="image-gallery">{this.state.isFunky ? this.getFunky() : this.getPlain()}</div>
        </div>
      </main>
    )
  }
}
/* navigation
<nav>
  <p className="smaller">
    <em>You are reading part #3 in the Southeast Asia 2015/2016 trip.
      There are <strong>13</strong> posts in total from this trip, make
      sure to check them out all!
    </em>
  </p>
  <a className="button button-block button-green"><i className="fa fa-map-o"></i>All posts from the trip</a>

  <h2 className="latest">Latest posts</h2>
  <ul className="latest">
    <li><a href="#">Hué (16.12.2015)</a></li>
    <li><a href="#">Sa Pa (23.12.2015)</a></li>
    <li><a href="#">Ha Noi (1.1.2016)</a></li>
  </ul>
</nav> */
