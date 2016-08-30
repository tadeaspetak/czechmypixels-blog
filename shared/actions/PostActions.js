import request from 'axios';
import Utils from 'lib/utils';

/**
 * Post actions.
 */


//get post details from the given slug
export function getPost(slug) {
  return {
    type: 'GET_POST',
    promise: request.get(Utils.normalizeUrl(`api/v1/posts/${slug}`))
  }
}

//set the `preloaded` property of a post indicated by its slug
export function setPreloaded(slug, isPreloaded){
  return {
    type: 'SET_PRELOADED',
    slug,
    isPreloaded
  }
}

//change picture, keeping note of the change's direction (important for transition)
export function changePicture(direction){
  return {
    type: 'CHANGE_PICTURE',
    direction
  }
}
