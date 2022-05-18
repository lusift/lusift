import { window, document } from "global";
import { error } from "../logger";

if (!window) {
    error("window is undefined");
}

const STATE_ITEM_NAME = "lusift_state";

/**
 * This function checks if the lusift_state is saved in localStorage
 */
export const loadState = () => {
    try {
        // Load the data saved in localStorage, against the key 'lusift_state'
        const serialisedState = window.localStorage.getItem(STATE_ITEM_NAME);

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


/**
 * This function accepts the app state, and saves it to localStorage
 * @param state
 */

export const saveState = state => {
    try {
        // Convert the state to a JSON string
        const serialisedState = JSON.stringify(state);

        // Save the serialised state to localStorage against the key 'lusift_state'
        window.localStorage.setItem(STATE_ITEM_NAME, serialisedState);
    } catch (err) {
        // Log errors here, or ignore
    }
};


export const setDefaultState = (): void => {
    saveState({});
}
