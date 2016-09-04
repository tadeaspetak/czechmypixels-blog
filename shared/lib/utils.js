let Utils = {
  getViewport() {
    return {
      width: process.env.BROWSER ? window.innerWidth : 0,
      height: process.env.BROWSER ? window.innerHeight : 0
    };
  },
  getDimensions(){
    return {
      width: process.env.BROWSER ? document.body.clientWidth : 0,
      height: process.env.BROWSER ? document.body.clientHeight : 0
    };
  },
  loadImage(url){
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.onload = () => resolve(image);
      image.src = url;
    });
  },
  getPixelDensity(){
    return typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
  },
  getDensityAwareUrl(url){
    if(Utils.getPixelDensity() > 1 && Utils.getViewport().width > 1000){
      let dot = url.lastIndexOf('.');
      return `${url.substring(0, dot)}@2x${url.substring(dot)}`;
    }
    return url;
  },
  //prefix the URL with a host if this runs on the server (necessary as relative URLs naturally cannot suffice)
  normalizeUrl(url) {
    return process.env.BROWSER ? url : Utils.absoluteUrl(url);
  },
  absoluteUrl(url){
    return `http://${process.env.BROWSER ? document.domain : process.env.HOST}${url.startsWith('/') ? '' : '/'}${url}`;
  },
  //get coordinations
  getCoords(element) {
    let box = element.getBoundingClientRect();
    let scroll = Utils.getScroll();
    let client = Utils.getClient();

    return {
      top: Math.round(box.top +  scroll.top - client.top),
      right: Math.round(box.right +  scroll.left - client.left),
      bottom: Math.round(box.bottom +  scroll.top - client.top),
      left: Math.round(box.left + scroll.left - client.left)
    };
  },
  //get client coordinations
  getClient(){
    return {
      top: document.documentElement.clientTop || document.body.clientTop || 0,
      left: document.documentElement.clientLeft || document.body.clientLeft || 0
    }
  },
  //get client scroll
  getScroll(){
    return {
      top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
      left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft
    }
  }
};

module.exports = Utils;
