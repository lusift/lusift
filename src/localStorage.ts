import { window, document } from 'global';
/**
 * This function accepts the app state, and saves it to localStorage
 * @param state
 */

if(!window) {
    console.log('window is undefined')
}

export const saveState = (state) => {
    try {
        // Convert the state to a JSON string
        const serialisedState = JSON.stringify(state);

        // Save the serialised state to localStorage against the key 'lusift_state'
        window.localStorage.setItem('lusift_state', serialisedState);
    } catch (err) {
        // Log errors here, or ignore
    }
};

/**
 * This function checks if the lusift_state is saved in localStorage
 */
export const loadState = () => {
    try {
        // Load the data saved in localStorage, against the key 'lusift_state'
        const serialisedState = window.localStorage.getItem('lusift_state');

        // Passing undefined to createStore will result in our app getting the default state
        // If no data is saved, return undefined
        if (!serialisedState) return undefined;

        // De-serialise the saved state, and return it.
        return JSON.parse(serialisedState);
    } catch (err) {
        // Return undefined if localStorage is not available,
        // or data could not be de-serialised,
        // or there was some other error
        return undefined;
    }
};
