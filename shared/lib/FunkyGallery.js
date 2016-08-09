'use strict';

const _ = require('lodash');

/**
 * Funky gallery a simple utility useful for displaying image galleries
 * in a sort of Flickr style, i.e. with (typically slightly) varying row
 * height and image width.
 *
 * The mechanism is rather simple: the `funkify` method takes an array of
 * image objects and returns them in rows, passing the suggested values
 * for width, height, etc. in a new `funky` property object on each of the
 * image objects.
 */

let FunkyGallery = {
  defaults: {
    //dimensions settings
    gap: 1, //horizintal gap between the elements
    rowWidth: 400, //row width (constant or function)
    rowHeight: () => 300 + _.random(0, 10) * 5, //row height (constant or function)
    //real width & height
    getWidth: element => element.width, //get the element's real height
    getHeight: element => element.height, //get the element's real width
    //resized width & crop potential
    getResizedWidth: (settings, element, rh) => rh * settings.getWidth(element) / settings.getHeight(element), //calculate width given row height
    getPotential: (settings, element, rw) => settings.getWidth(element) > settings.getHeight(element) ? rw * .4 : rw * .2, //get potential for cropping given element width
    //set the funky properties
    setFunky: (element, cropWidth, height, resizedWidth) => element.funky = {
      //suggested witdh of the image container
      cropWidth,
      //suggested height of the image container (corresponds to the current row's height)
      height,
      //real width of the resized image (useful e.g. when setting "background-size")
      resizedWidth,
      // horizontal shift required to center the image in its continer
      // (useful e.g. when setting "background-position-x", if not using background-position:center for some reason)
      shiftBy: (resizedWidth - cropWidth) / 2}
  },
  /**
   * Gateway method into funky-gallery.
   */
  funkify(elements, settings) {
    return this.arrange(elements, _.extend({}, this.defaults, settings), []);
  },
  /**
   * Pick a single row from an array of elements based on the given settings.
   */
  pickRow(elements, settings) {
    let widths = [],
      widthSum = 0,
      potentials = [],
      potentialSum = 0,
      rowWidth = _.isFunction(settings.rowWidth) ? settings.rowWidth() : settings.rowWidth,
      rowHeight = _.isFunction(settings.rowHeight) ? settings.rowHeight() : settings.rowHeight;

    //pick elements for a single row
    let row = _.takeWhile(elements, element => {
      let width = settings.getResizedWidth(settings, element, rowHeight);
      let potential = settings.getPotential(settings, element, width);
      let gaps = (_.size(widths) * settings.gap);

      //keep adding elements as long as they can (potentially) fit in one row
      if ((widthSum + width) - (potentialSum + potential) + gaps < rowWidth) {
        //widths & potentials + their sums
        widths.push(width);
        potentials.push(potential);
        widthSum += width;
        potentialSum += potential;

        return true;
      }
      return false;
    });
    return {row, widths, widthSum, potentials, potentialSum, rowHeight, rowWidth};
  },
  /**
   * Arrange elements into rows.
   * (Recursively calls self until there are no more elements to be processed.)
   */
  arrange(elements, settings, rows) {
    let {row, widths, widthSum, potentials, potentialSum, rowHeight, rowWidth} = this.pickRow(elements, settings);
    let gaps = (_.size(row) - 1) * settings.gap;
    let difference = widthSum - rowWidth + gaps;

    //a complete row
    if (difference > 0) {
      //all elements but last -> keep "cropping" the width by a random number using the element's potential as the crop maximum
      _.dropRight(row, 1).forEach((element, index) => {
        potentialSum -= potentials[index];
        let decrease = _.random(Math.max(0, difference - potentialSum), Math.min(potentials[index], difference));
        settings.setFunky(element, widths[index] - decrease, rowHeight, widths[index]);
        difference -= decrease;
      });

      //last -> simply crop by the remaining difference to maintain unified row width
      settings.setFunky(_.last(row), _.last(widths) - difference, rowHeight, _.last(widths))
    }
    // an incomplete row
    else {
      row.forEach((element, index) => settings.setFunky(element, widths[index], rowHeight, widths[index]));
    }
    rows.push(row);

    //continue recursively as long as there are elements to be processed
    let remaining = _.drop(elements, _.size(row));
    return _.isEmpty(remaining) ? rows : this.arrange(remaining, settings, rows);
  }
};

module.exports = FunkyGallery;
