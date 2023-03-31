import React, { useState, useRef, useEffect, useCallback } from "react";
import { nl2br } from "../utils/nl2br";
import Chatbox from "./Chatbox";

function Chats({
  userText,
  setUserText,
  setError,
  chats,
  setChats,
  selectedChat,
  setSelectedChat,
  globalState,
  setGlobalState,
}) {
  const chatRef = useRef(null);
  const [scrollHeight, setScrollHeight] = useState();
  const [prevMsgCount, setPrevMsgCount] = useState(-1);
  const scrollToBottom = useCallback(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth", // use "auto" for instant scrolling
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, scrollToBottom]);

  useEffect(() => {
    const chat = chats.find(c => c.id === selectedChat);
    if (!chat) return;
    const msgCount = chat.messages.length;
    if (msgCount !== prevMsgCount) {
      scrollToBottom();
      setPrevMsgCount(msgCount);
    }
  }, [chats, selectedChat, prevMsgCount, scrollToBottom]);

  return (
    <div className="md:pl-[260px] h-screen p-0 m-0 overflow-x-hidden w-full dark:bg-gray-700">
      <div className="chat h-full w-full overflow-y-scroll m-0 p-0 flex">
        {/* <div class="flex w-full items-center justify-center gap-1 border-b border-black/10 bg-gray-50 p-3 text-gray-500 dark:border-gray-900/50 dark:bg-gray-700 dark:text-gray-300">Model: Default (GPT-3.5)</div> */}

        {selectedChat !== null &&
        chats[chats.findIndex((chat) => chat.id === selectedChat)] ? (
          <div
            className="dark:bg-gray-700 overflow-y-scroll p-0 w-full h-full "
            ref={chatRef}
            key={selectedChat}
            onScroll={() => {
              setScrollHeight(chatRef.current.scrollTop);
            }}
          >
            <div className="h-10 w-full"></div>
            
            {chats[
              chats.findIndex((chat) => chat.id === selectedChat)
            ].messages.map((message, index) =>
              message.role === "system" ? null : (
                <p
                  key={index}
                  className={`py-6 px-24 text-xxl${
                    message.role === "user" ? " bg-transparent" : " bg-white bg-opacity-5"
                  } break-words`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {message.role === "assistant" ? (
                    <></>// <span className="font-semibold">ChatGPT: </span>
                  ) : null}
                  {nl2br(message.content)}
                  {globalState.assistantTypingMsgId === message.id &&
                    <span className="bot_cursor">{
                      !!(message.content || '').length ? <>&nbsp;&nbsp;</> : null
                    }▌</span>
                  }
                </p>
              )
            )}
            <div className="bg-transparent h-1/5" />
            {/* scroll-to-bottom button */}
            {chatRef.current
              ? scrollHeight + chatRef.current.clientHeight * 1.1 <
                  chatRef.current.scrollHeight && (
                  <button
                    className="cursor-pointer absolute right-6 bottom-[124px] md:bottom-[120px] z-10 rounded-full border border-gray-200 bg-gray-50 text-gray-600 dark:border-white/10 dark:bg-white/10 dark:text-gray-200"
                    onClick={() => {
                      if (chatRef.current) {
                        chatRef.current.scrollTo({
                          top: chatRef.current.scrollHeight,
                          behavior: "smooth", // use "auto" for instant scrolling
                        });
                      }
                    }}
                  >
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 m-1"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </button>
                )
              : null}
          </div>
        ) : (
          <h1 className="text-4xl font-semibold text-center text-gray-300 dark:text-gray-600 ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center flex-grow">
            Alpaca.cpp
            {/* <span className="bg-yellow-200 text-yellow-900 py-0.5 px-1.5 text-xs md:text-sm rounded-md uppercase">
              Clone
            </span> */}
          </h1>
        )}

        <Chatbox
          setError={setError}
          userText={userText}
          setUserText={setUserText}
          chats={chats}
          setChats={setChats}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          globalState={globalState}
          setGlobalState={setGlobalState}
          chatRef={chatRef}
        />
      </div>
    </div>
  );
}

export default Chats;
