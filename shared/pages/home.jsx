import React from 'react';
import { connect } from 'react-redux';
import { needs } from 'lib/needs';
import * as PostStubActions from 'actions/PostStubActions';
import Helmet from 'react-helmet';
import PostStub from 'components/postStub';
import classnames from 'classnames';
import nprogress from 'nprogress';
import { Map } from 'immutable';

/**
 * Home page.
 */

@connect(state => ({postStubs: state.postStubs}))
@needs([props => PostStubActions.getPostStubs()])
export default class Home extends React.Component {
  constructor(params){
    super(params);
    this.state = {
      loadingMore: false
    };
  }
  //get all the stubs
  getStubs(){
    return this.props.postStubs.get('stubs') || new Map();
  }
  //get stub total
  getTotal(){
    return this.props.postStubs.get('total') || 0;
  }
  //load more stubs
  handleLoadMore(){
    nprogress.start();
    this.setState({loadingMore: true});
    this.props.dispatch(PostStubActions.getPostStubs(this.getStubs().size)).then(response => {
      this.setState({loadingMore: false});
      nprogress.done();
    });
  }
  render() {
    return (
      <main className="home">
        <Helmet
          title="Home | Czech My Pixels"
          meta={[
            {property: "og:type", content: "article"},
            {property: "og:title", content: "Czech My Pixels"},
            {property: "og:description", content: "Pictures and scribbles from some of our travels 'round this blue planet."},
            {property: "og:image", content: "http://czechmypixels/pictures/2015-12-15-cu-chi-tunnels/IMG_6038_colourBanner.jpg"}
          ]}/>
        <div className="container">
          <div className="post-stubs">{this.getStubs().valueSeq().map(stub => <PostStub key={stub.id} dispatch={this.props.dispatch} stub={stub}/>)}</div>
          <button
            className={classnames('load-more', 'button-block', 'button-green', {hidden: this.getStubs().size >= this.getTotal()})}
            onClick={this.handleLoadMore.bind(this)} disabled={this.state.loadingMore}><i className="fa fa-angle-double-down"></i>Show Me a Few More</button>
        </div>
      </main>);
  }
}
