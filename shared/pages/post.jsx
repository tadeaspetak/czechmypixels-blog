import React from 'react';
import {connect} from 'react-redux';
import {needs} from 'lib/needs';
import * as PostActions from 'actions/PostActions';
import { Map } from 'immutable';


import classnames from 'classnames';
import moment from 'moment';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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
  render() {
    return(
      <main>
        <div className={classnames('modal-pictures', this.props.params.picture ? 'visible' : 'hidden')} onClick={this.handleOverlayClick.bind(this)}>
          <p>images: {console.log(this.props.routes[this.props.routes.length-1])}</p>

            <ReactCSSTransitionGroup
              transitionName="example"
              transitionEnterTimeout={300}
              transitionLeaveTimeout={300}>
            {this.props.children ? React.cloneElement(this.props.children, {
              key: this.props.location.pathname
            }) : null}
          </ReactCSSTransitionGroup>

          <p>asdf</p>
        </div>


        <img src={this.getPost().banner ? this.getPost().banner.banner : ''} alt="" className="banner" />
        <div className="container">
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
            <div className="description">
              <h1>{this.getPost().title}</h1>
              <span className="details">
                Published on <span className="date">{moment(this.getPost().date).format('MMM DD, YYYY')}</span>
              </span>
            </div>
            <div className="post-body" dangerouslySetInnerHTML={{__html: this.getPost().contentHtml}} />
            <div className="image-gallery">
              {this.getPost().pictures.map(picture => {
                return (<a key={picture.id} className="image" onClick={() => this.handlePicutreClick(picture)}>
                  <img src={picture.thumbnail} />
                  <span className={classnames('image-description', {visible: picture.html})} dangerouslySetInnerHTML={{__html: picture.html}} />
                </a>)
              })}
            </div>
          </article>
        </div>
      </main>
    )
  }
}
//by <span className="author">Marie</span>
