import axios from 'axios';
import Utils from '../lib/utils';

export const GET_POST = 'GET_POST';
export const SET_PRELOADED = 'SET_PRELOADED';
export const CHANGE_PICTURE = 'CHANGE_PICTURE';

// get post details from the given slug
export function getPost(slug) {
  return {
    type: GET_POST,
    promise: axios.get(Utils.normalizeUrl(`/api/v1/posts/${slug}`))
  };
}

// set the `preloaded` property of a post indicated by its slug
export function setPreloaded(slug, isPreloaded) {
  return {
    type: SET_PRELOADED,
    slug,
    isPreloaded
  };
}

// change picture, keeping note of the change's direction (important for transition)
export function changePicture(direction) {
  return {
    type: CHANGE_PICTURE,
    direction
  };
}
