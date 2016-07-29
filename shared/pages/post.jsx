import React from 'react';
import {connect} from 'react-redux';
import {needs} from 'lib/needs';
import * as PostActions from 'actions/PostActions';
import { Map } from 'immutable';
const _ = require('lodash');
import Helmet from 'react-helmet';
import Truncate from 'truncate';


import classnames from 'classnames';
import moment from 'moment';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import FunkyGallery from 'lib/FunkyGallery';

/**
 * Picture detail.
 */

@connect(state => ({posts: state.posts}))
@needs([params => PostActions.getPost(params.slug)])
export default class Post extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  handlePicutreClick(picture){
    this.props.dispatch(PostActions.changePicture('none'));
    this.context.router.push(`post/${this.getPost().slug}/${picture.name}`);
  }
  handleOverlayClick(){
    this.context.router.push(`post/${this.props.params.slug}`);
  }
  getPost(){
    return this.props.posts.get(this.props.params.slug) || {
      banner:{},
      pictures: new Map()
    };
  }
  getPictures(){
    if(!this.pictures || !this.pictures.length){
      this.pictures = FunkyGallery.funkify(this.getPost().pictures, {
        gap: 8,
        rowHeight: () => 300 + _.random(0, 10) * 5,
        rowWidth: 1000
      }).reduce((previous, current) => {
        //tag the last element in the collection as last
        if(current.length) {
          _.last(current).funky.isLast = true;
        }
        return previous.concat(current);
      }, []);
    }
    return this.pictures;
  }
  render() {
    if(document){
      let truncated = new Truncate(document.getElementById('#postBody'), {
        lines: 2
      });
    }

    return(
      <main>
        <Helmet
          title={`${this.getPost().title} | Czech My Pixels`}
          meta={[
            {property: "og:type", content: "article"},
            {property: "og:title", content: this.getPost().title},
            {property: "og:description", content: this.getPost().excerptHtml},
            {property: "og:image", content: `http://czechmypixels.com${this.getPost().banner.content}`}
          ]} />
        <div className={classnames('modal-pictures', this.props.params.picture ? 'visible' : 'hidden')} onClick={this.handleOverlayClick.bind(this)}>
          <ReactCSSTransitionGroup
            transitionName="example"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}>
          {this.props.children ? React.cloneElement(this.props.children, {
            key: this.props.location.pathname
          }) : null}
        </ReactCSSTransitionGroup>
        </div>

        <img src={this.getPost().banner ? this.getPost().banner.banner : ''} alt="" className="banner" />
        <div className="container">
          <div className="article-description">
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
            </nav>
            <article>
              <div className="funky-image"></div>
              <div className="description">
                <h1 className="article-heading">{this.getPost().title}</h1>
                <span className="details">
                  Published on <span className="date">{moment(this.getPost().date).format('MMM DD, YYYY')}</span>
                </span>
              </div>
              <div className="post-body" id="postBody" dangerouslySetInnerHTML={{__html: this.getPost().contentHtml}} />
            </article>
          </div>

          <div className="image-gallery">
            {this.getPictures().map(picture => {
              return (<a key={picture.id} className={classnames('funky-image', {last: picture.funky.isLast})} onClick={() => this.handlePicutreClick(picture)} style={{
                height: `${picture.funky.height}px`,
                width: `${picture.funky.cropWidth}px`,
                backgroundImage: `url("${picture.content}")`,
                backgroundSize: `${picture.funky.resizedWidth}px ${picture.funky.height}px`,
                backgroundPositionX: `-${picture.funky.shiftBy}px`
              }}>
                <span className={classnames('image-description', {visible: picture.html})} dangerouslySetInnerHTML={{__html: picture.html}} />
              </a>)
            })}
          </div>
        </div>
      </main>
    )
  }
}
