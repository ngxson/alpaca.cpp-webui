import React, { useState, useEffect } from "react";
import axios from "axios";
import { uuidv4 } from "../utils/uuid";

function Chatbox({
  setError,
  userText,
  setUserText,
  chats,
  setChats,
  selectedChat,
  setSelectedChat,
  globalState,
  setGlobalState,
}) {
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setUserText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (userText.length >= 2) {
      const selectedIndex = chats.findIndex(
        (chat) => chat.id === selectedChat
      );
      const selectedChatData = chats[selectedIndex];
      console.log(selectedChatData);

      // add message
      const newAssistantMsgId = uuidv4();
      const newMsgUser = {
        id: uuidv4(),
        chat_id: selectedChat,
        role: 'user',
        content: userText,
        createdAt: Date.now(),
      }
      const newMsgAssitant = {
        id: newAssistantMsgId,
        chat_id: selectedChat,
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
      }
      const newChat = {
        ...selectedChatData,
        messages: [
          ...selectedChatData.messages,
          newMsgUser,
          newMsgAssitant,
        ],
      };
      setChats(chats => chats.map(c => c.id === newChat.id ? newChat : c));
      setGlobalState(state => ({...state, assistantTypingMsgId: newAssistantMsgId}));

      // send request to backend
      const req = {
        chatId: selectedChat,
        messageId: newAssistantMsgId,
        input: userText,
      };
      window._socket.emit('ask', req);
      setUserText('');

      // save to backend
      await axios.post('/api/messages', newMsgUser).catch(console.error);
      await axios.post('/api/messages', newMsgAssitant).catch(console.error);
    } else {
      setError("Please enter a valid prompt");
    }
  };

  return (
    // <div className="h-15% absolute bottom-0 w-4/6  border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white fade">
    <div
      className="pl-[260px] absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent 
      md:dark:border-transparent dark:bg-gray-800"
    >
      <form
        className="flex flex-col flex-grow mx-auto my-4 py-3 px-3 relative border border-black/10 bg-white 
        dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md md:max-w-2xl lg:max-w-3xl md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-3xl"
        onSubmit={handleSubmit}
        style={{boxShadow:"0 0 20px 0 rgba(0, 0, 0, 0.1)"}}
      >
        <div className="w-full p-0 m-0">
          <textarea
            className="resize-none h-full w-full m-0 overflow-hidden border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 focus:outline-none focus:border-0 dark:bg-transparent md:pl-1 text-base align-top"
            tabIndex="0"
            data-id="root"
            value={userText}
            onChange={handleChange}
            minLength="1"
            spellCheck="false"
            rows={1}
            style={{
              minHeight: "1rem",
              fontSize: "1rem",
              maxHeight: "10rem",
              lineHeight: "1.5rem"
            }}
            onInput={(e) => {
              //shrink/grow on input logic
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          ></textarea>
        </div>

        <button
          type="submit"
          className={`absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent ${loading ? "loading-icon" : null}`}
          disabled={loading}
        >
          {!loading && (
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 mr-1"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}

export default Chatbox;
