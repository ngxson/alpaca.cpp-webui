import React, { useState, useRef, useEffect } from "react";
import SocketIOClient from "socket.io-client";

export default ({ setChats, setGlobalState }) => {
  useEffect(() => {
    // connect to socket server
    if (!window) window = {};
    window._socket = SocketIOClient.connect(`ws://${window.location.hostname}:13030`);

    const socket = window._socket;

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
      //setConnected(true);
    });

    socket.on("update", (data) => {
      console.log('update', data)

      if (data.done) {
        setGlobalState(state => ({...state, assistantTypingMsgId: null}));
        return;
      }

      const { chatId, messageId, input, output } = data;
      setGlobalState(state => ({...state, assistantTypingMsgId: messageId}));
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
  }, []);

  return <></>;
};