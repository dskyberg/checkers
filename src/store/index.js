/**
 * This code shows how to establish mobx observable classes for use as both
 * HOC wrappers around component classes and as hooks for functional components.
 *
 * Add the StoreProvider as an element above whatever components will need to
 * observe for changes.  I suggest wrapping the <App /> component in the top
 * level index.jsx
 *
 * Remember, when wrapping an FC with observer, the FC should use the function
 * form, rather than arrow notation, so that the component displays properly in
 * DevTools.  Ie,
 * const MyComponent = observer(function MyComponent(props){})
 * And not
 * const MyComponent = observer((props) =>{})
 */
import React from 'react'
import Settings from './Settings';
import Colors from './Colors'

const StoreContext = React.createContext(null)

/**
 * Wrap the app with StoreProvide context, so that the useStore hook works correctly, like
 * this:
 *  <StoreProvider>
 *    <App />
 * </StoreProvider>
 *
 */
export const StoreProvider = ({ children }) => {

  const store = {
    settings: new Settings(),
    colors: new Colors(),
  }

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

/**
 * @typedef Stores
 * @type {object}
 * @property {Settings} settings
 * @property {Colors} colors
 */

/**
 * hook to return the store from the StoreProvider context.
 * @returns {Stores}
 */
export const useStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
};
