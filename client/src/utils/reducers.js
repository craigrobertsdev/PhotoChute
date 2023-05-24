import { useReducer } from "react";
import { UPDATE_GROUP } from "./actions";

export const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_GROUP:
      return {
        ...state,
        group: action.group,
      };
    default:
      return state;
  }
};

export function usePhotochuteReducer(initialState) {
  return useReducer(reducer, initialState);
}
