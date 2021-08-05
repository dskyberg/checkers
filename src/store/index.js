import React from 'react'
import Settings from './Settings';

const StoreContext = React.createContext(null)

/**
 * Wrap the app with StoreProvide, so that the useStore hook works correctly, like
 * this:
 *  <StoreProvider>
 *    <App />
 * </StoreProvider>
 *
 */
export const StoreProvider = ({ children }) => {

    const store = {
      settings: new Settings(),
    }

    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
};

/**
 * hook to return the store from the StoreProvider context.
 * @returns object with an entry for each store class.
 */
export const useStore = () => {
    const store = React.useContext(StoreContext);
    if (!store) {
      throw new Error('useStore must be used within a StoreProvider.');
    }
    return store;
  };
