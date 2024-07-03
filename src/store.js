// store.js
import { createStore } from 'redux';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (error) {
    // Ignore write errors.
  }
};

const persistedState = loadState();

const initialState = {
  user: null,
  ...persistedState, // Merge persisted state with initial state
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const store = createStore(reducer);

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
