import React from 'react';
import {connect} from 'react-redux';
import {needs} from 'lib/needs';
import * as PostStubActions from 'actions/PostStubActions';
import Helmet from 'react-helmet';

import PostStub from 'components/postStub';

/**
 * Home page.
 */

@connect(state => ({postStubs: state.postStubs}))
@needs([() => PostStubActions.getPostStubs()])
export default class Home extends React.Component {
  render() {
    let posts = this.props.postStubs.valueSeq().map(post => <PostStub key={post.id} post={post}/>);
    let helmet = (<Helmet
      title="Home | Czech My Pixels"
      meta={[
        {property: "og:type", content: "article"},
        {property: "og:title", content: "Czech My Pixels"},
        {property: "og:description", content: "Cool description"},
        {property: "og:image", content: "http://czechmypixels/pictures/2015-12-15-cu-chi-tunnels/IMG_6038_colourBanner.jpg"}
      ]}
      onChangeClientState={(newState) => console.log(newState)}/>);
    return (
      <main>
        {helmet}
        <div className="container">
          <div className="posts-stubs">{posts}</div>
        </div>
      </main>
    )
  }
}
