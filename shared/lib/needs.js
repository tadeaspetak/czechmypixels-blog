import _ from 'lodash';

/**
 * Decorator marking necessary resources for a component.
 */

export function needs(needs) {
  return function(component) {
    //set the static needs of this component
    component.needs = needs;

    //delete the initial state on `componentDidMount`, making sure
    //we will query the data again next time it is needed
    const original = component.prototype.componentDidMount;
    component.prototype.componentDidMount = function() {
      if (window.state) {
        delete window.state;
      } else {
        needs.forEach(need => {
          //safer to pass `props` as binding this wouldn't work if the decorator was written using an arrow function
          let result = need(this.props);
          return result ? this.props.dispatch(result) : false;
        });
      }

      //call the original `componentDidMount` function (if there is one)
      if(original){
        original.bind(this)();
      }
    }
  }
}
