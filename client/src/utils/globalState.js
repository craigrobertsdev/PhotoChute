import React, { createContext, useContext } from "react";
import { usePhotochuteReducer } from "./reducers";

const PhotoChuteContext = createContext();
const { Provider } = PhotoChuteContext;

const PhotoChuteProvider = ({ value = [], ...props }) => {
  const [state, dispatch] = usePhotochuteReducer({
    group: "The Walruses",
  });

  return <Provider value={[state, dispatch]} {...props} />;
};

const usePhotochuteContext = () => {
  return useContext(PhotoChuteContext);
};

export { PhotoChuteProvider, usePhotochuteContext };
