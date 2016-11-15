const _ = require('lodash');
import classnames from 'classnames';
import moment from 'moment';
import nprogress from 'nprogress';

import React from 'react';

import * as PostActions from '../actions/PostActions';
import Utils from '../lib/utils';
import FunkyGallery from '../lib/FunkyGallery';

/**
 * Post gallery showing thumbnail images in a funky way.
 */

export default class PostGallery extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  //gallery size definitions for all possible screen sizes
  static sizes = [{
    min: 320,
    max: 480,
    gap: 1,
    rowHeight: () => 80 + _.random(0, 10) * 5,
    rowWidth: () => PostGallery.getAvailableWidth()
  }, {
    min: 480,
    max: 768,
    gap: 1,
    rowHeight: () => 120 + _.random(0, 10) * 5,
    rowWidth: () => PostGallery.getAvailableWidth()
  }, {
    min: 768,
    max: 1224,
    gap: 1,
    rowHeight: () => 150 + _.random(0, 10) * 5,
    rowWidth: 720
  }, {
    min: 1224,
    max: 0,
    gap: 1,
    //ideally, the row height would differ here too but older devices suck at scaling background images...
    rowHeight: () => 350,
    rowWidth: 1200
  }]
  static getAvailableWidth = () => {
    return Utils.getDimensions().width * .9;
  }
  constructor(props){
    super(props);
    this.state = {
      isFunky: false,
      pictures: []
    };
    this.onResize = this.onResize.bind(this);
  }
  componentWillMount(){
    //pictures are loaded on component mount
    if(this.props.post.pictures.length){
      this.repaint();
    }
  }
  componentDidMount(){
    window.addEventListener('resize', this.onResize);
  }
  componentWillReceiveProps(next){
    //pictures have changed (or arrived)
    if(!this.getPictures() || !_.isEqual(this.getPictures(), this.getPictures(next))){
      this.repaint(this.getSize(), next);
    }
  }
  componentDidUpdate(){
    //if scroll bar has been added due to content changes, pictures need to be re-rendered
    if(!this.width || Utils.getDimensions().width < this.width){
      this.width = Utils.getDimensions().width;
      this.repaint();
    }
  }
  componentWillUnmount(){
    window.removeEventListener('resize', this.onResize);
  }
  handlePicutreClick(picture){
    nprogress.start();
    Utils.loadImage(Utils.getDensityAwareUrl(picture.content)).then(() => {
      this.props.dispatch(PostActions.changePicture('none'));
      this.context.router.push(`/post/${this.props.post.slug}/${picture.name}`);
      nprogress.done();
    });
  }
  getPictures(props = this.props){
    return props.post ? props.post.pictures : false;
  }
  getSize(){
    let width = Utils.getViewport().width;
    return PostGallery.sizes.filter(size => (!size.min || size.min <= width) && (!size.max || size.max > width))[0];
  }
  repaint(size = this.getSize(), props = this.props){
    this.size = size;
    if(this.size){
      this.setState({
        isFunky: true,
        pictures: FunkyGallery
          .funkify(props.post.pictures, this.size)
          .reduce((previous, current) => {
            //tag the last element in the collection as last
            if(current.length) _.last(current).funky.isLast = true;
            return previous.concat(current);
          }, [])
      });
    } else {
      this.setState({
        isFunky: false,
        pictures: props.post.pictures
      });
    }
  }
  onResize(){
    // this is just a fake resize, mostl likely on a mobile device where resize is called
    // on scroll since scrollbar is added and removed from the window...
    if(this.width === Utils.getDimensions().width){
      return;
    }

    //repaint when resizing and viewport width lower than 768 (never happens in practice, I guess, but hey, I like stuff clean)
    this.width = Utils.getDimensions().width;
    let current = this.getSize();
    if(current !== this.size || Utils.getViewport().width < 768) this.repaint(current);
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
  render() {
    return (<div className="image-gallery">{this.state.isFunky ? this.getFunky() : this.getPlain()}</div>);
  }
}
