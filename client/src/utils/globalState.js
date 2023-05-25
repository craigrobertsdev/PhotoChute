import React, { createContext, useContext, useEffect } from "react";
import { usePhotochuteReducer } from "./reducers";
import { useQuery } from "@apollo/client";
import { GET_ME } from "./queries";
import { SET_CURRENT_USER } from "./actions";
const PhotoChuteContext = createContext();
const { Provider } = PhotoChuteContext;

const PhotoChuteProvider = ({ value = [], ...props }) => {
  const { data } = useQuery(GET_ME);
  const [state, dispatch] = usePhotochuteReducer({
    group: "The Walruses",
    currentUser: {},
  });

  useEffect(() => {
    console.log(data);
    if (data?.me) {
      dispatch({
        type: SET_CURRENT_USER,
        currentUser: data.me,
      });
    }
  }, [data]);

  return <Provider value={[state, dispatch]} {...props} />;
};

const usePhotochuteContext = () => {
  return useContext(PhotoChuteContext);
};

export { PhotoChuteProvider, usePhotochuteContext };
