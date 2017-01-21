// decorator marking necessary resources for a component
export default function needs(dependencies, conditional) {
  return function (c) {
    const component = c;
    component.needs = dependencies;

    const request = props => dependencies.map((need) => {
      const result = need(props);
      return result ? props.dispatch(result) : false;
    });

    // fetch the needs on component mount
    const originalComponentDidMount = component.prototype.componentDidMount;
    component.prototype.componentDidMount = function () {
      if (window.state) {
        delete window.state;
      } else {
        request(this.props);
      }

      if (originalComponentDidMount) {
        originalComponentDidMount.call(this);
      }
    };

    // if e.g. only a URL parameter changes, component might stay the same
    // in such cases, the pass in a function returning whether the request should be resent
    if (typeof conditional === 'function') {
      const originalComponentWillReceiveProps = component.prototype.componentWillReceiveProps;
      component.prototype.componentWillReceiveProps = function (nextProps) {
        if (conditional(this.props, nextProps)) {
          request(nextProps);
        }

        if (originalComponentWillReceiveProps) {
          originalComponentWillReceiveProps.call(this);
        }
      };
    }
  };
}
