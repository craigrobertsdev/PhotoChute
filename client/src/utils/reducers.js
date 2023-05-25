import { useReducer } from "react";
import { SET_CURRENT_USER, UPDATE_GROUP } from "./actions";

export const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_GROUP:
      return {
        ...state,
        group: action.group,
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.currentUser,
      };
    default:
      return state;
  }
};

export function usePhotochuteReducer(initialState) {
  return useReducer(reducer, initialState);
}
