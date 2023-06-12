import { useState, useContext, createContext } from "react";

const WebSocketContext = createContext();

export default WebSocketProvider = ({ children }) => {
  const [webSocket, setWebSocket] = useState();

  return (
    <WebSocketContext.Provider value={{ webSocket, setWebSocket }}>
      {...children}
    </WebSocketContext.Provider>
  );
};
