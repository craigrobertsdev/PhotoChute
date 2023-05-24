import React, { createContext, useContext } from "react";
import { usePhotochuteReducer } from "./reducers";

const PhotoChuteContext = createContext();
const { Provider } = PhotoChuteContext;

const PhotoChuteProvider = ({ value = [], ...props }) => {
  const [state, dispatch] = usePhotochuteReducer({
    group: null,
  });

  return <Provider value={[state, dispatch]} {...props} />;
};

const usePhotochuteContext = () => {
  return useContext(PhotoChuteContext);
};

export { PhotoChuteProvider, usePhotochuteContext };
