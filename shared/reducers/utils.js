// create a reducer from the given initial state and a reducer map
export function createReducer(initial, map) {
  return (state = initial, action) => {
    const reducer = map[action.type];
    return reducer ? reducer(state, action) : state;
  };
}

export function silly() { return undefined; }
