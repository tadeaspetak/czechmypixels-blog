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
  truncate(string, max) {
    let trimmed = string.substring(0, max);
    return trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')));
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
    let density = Utils.getPixelDensity();
    if(density > 1){
      let dot = url.lastIndexOf('.');
      return `${url.substring(0, dot)}@2x${url.substring(dot)}`;
    }
    return url;
  }
};

module.exports = Utils;
