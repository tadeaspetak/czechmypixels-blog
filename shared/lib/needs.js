// decorator marking necessary resources for a component.
export default function needs(dependencies) {
  return function (c) {
    const component = c;

    // set the static needs of this component
    component.dependencies = dependencies;

    // delete the initial state on `componentDidMount`, making sure
    // we will query the data again next time it is needed
    const original = component.prototype.componentDidMount;
    component.prototype.componentDidMount = function () {
      if (window.state) {
        delete window.state;
      } else {
        dependencies.forEach((dependency) => {
          // safer to pass `props` as binding this wouldn't
          // work if the decorator was written using an arrow function
          const result = dependency(this.props);
          return result ? this.props.dispatch(result) : false;
        });
      }

      // call the original `componentDidMount` function (if there is one)
      if (original) {
        original.bind(this)();
      }
    };
  };
}
