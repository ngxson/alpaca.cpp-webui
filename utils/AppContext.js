import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import SocketIOClient from "socket.io-client";

const AppContext = createContext({});

export const AppContextProvider = ({ children, prefetchedChats, wsPort }) => {
  const [chats, setChats] = useState(prefetchedChats);
  const [selectedChat, setSelectedChat] = useState(null);
  const [userText, setUserText] = useState("");
  const [error, setError] = useState(null);
  const [assistantTypingMsgId, setAssistantTypingMsgId] = useState(null);
  const [socket, setSocket] = useState();
  const [userConfig, setUserConfig] = useState({});
  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    setError(null);
  }, [selectedChat]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const protocol = window.location.protocol.match(/https/) ? 'wss' : 'ws';
      setSocket(
        SocketIOClient.connect(`${protocol}://${location.host}`, {
          path: '/api/socketio'
        })
      );
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
      setError(null);
    });

    socket.on("connect_error", () => setError({ type: 'ERR_WS' }));
    socket.on("disconnect", () => setError({ type: 'ERR_WS' }));
    socket.on("error_missing_file", ({ pathExecAbs, modelPathAbs }) => setError({
      type: 'ERR_NO_MODEL',
      pathExecAbs,
      modelPathAbs,
    }));

    socket.on("user_config", (cfg) => setUserConfig(cfg));

    socket.on("update", (data) => {
      console.log('update', data)

      if (data.done) {
        setAssistantTypingMsgId(null);
        return;
      }

      const { chatId, messageId, input, output } = data;
      setAssistantTypingMsgId(messageId);
      setChats(chats => {
        return chats.map(c => {
          if (c.id === chatId) {
            //console.log(c.messages)
            const message = c.messages.find(m => m.id === messageId);
            if (message) { // already exist
              const messages = c.messages.map(m => m.id === messageId ? {
                ...m,
                content: output,
              } : m)
              return {...c, messages};
            } else { // new message
              const newMessage = {
                id: messageId,
                role: 'assistant',
                content: output,
                createdAt: Date.now(),
              };
              return {...c, messages: [...c.messages, newMessage]};
            }
          } else {
            return c;
          }
        })
      });
    });

    // socket disconnet onUnmount if exists
    if (socket) return () => socket.disconnect();
  // eslint-disable-next-line
  }, [socket]);

  return <AppContext.Provider
    value={{
      chats,
      setChats,
      selectedChat,
      setSelectedChat,
      userText,
      setUserText,
      error,
      setError,
      socket,
      assistantTypingMsgId,
      setAssistantTypingMsgId,
      userConfig,
      showMenu,
      setShowMenu,
    }}
    children={children}
  />;
};

export const useAppContext = () => useContext(AppContext);
export const withAppContext = Component => props => (
  <AppContext.Consumer>
    {store => <Component {...props} {...store} />}
  </AppContext.Consumer>
);