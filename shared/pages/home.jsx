import React from 'react';
import {connect} from 'react-redux';
import {needs} from 'lib/needs';
import * as PostStubActions from 'actions/PostStubActions';

import PostStub from 'components/postStub';

/**
 * Home page.
 */

@connect(state => ({postStubs: state.postStubs}))
@needs([() => PostStubActions.getPostStubs()])
export default class Home extends React.Component {
  render() {
    var posts = this.props.postStubs.valueSeq().map(post => <PostStub key={post.id} post={post}/>);
    return (
      <main>
        <div className="container">
          <div className="posts-stubs">{posts}</div>
        </div>
      </main>
    )
  }
}
