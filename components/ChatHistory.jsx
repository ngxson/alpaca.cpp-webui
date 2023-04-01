import React, { useState } from "react";
import axios from "axios";
import { useAppContext } from "../utils/AppContext";
import Dialog from "./Dialog";

const IconEdit = ({ className, onClick }) => <svg onClick={onClick} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={"h-4 w-4 " + className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>

const IconDelete = ({ className, onClick }) => <svg onClick={onClick} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={"h-4 w-4 " + className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>

const IconUser = ({ className, onClick }) => <svg onClick={onClick} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={"h-4 w-4 " + className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>

const IconOpen = ({ className, onClick }) => <svg onClick={onClick} stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={"h-4 w-4 " + className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>

function ChatHistory() {
  const {
    chats,
    userText,
    setUserText,
    setChats,
    selectedChat,
    setSelectedChat,
  } = useAppContext();

  const [showSettings, setShowSettings] = useState(false);

  const fetchChats = async () => {
    try {
      const response = await axios.get("/api/chats");
      if (response.data) {
        setChats(response.data);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const deleteChats = async (id) => {
    if (id) {
      await axios.delete("/api/chats", { data: { id } });
      fetchChats();
    } else {
      await axios.delete("/api/chats");
      setChats([]);
    }
    setSelectedChat(null);
  };

  const createChat = async () => {
    const { data } = await axios.post("/api/chats");
    fetchChats();
    setSelectedChat(data.chat_id);
  };

  const editChat = async (id, title) => {
    await axios.patch("/api/chats", { id, title });
    fetchChats();
  };

  const handleClickDelete = async (chat) => {
    if (window.confirm(`Are you sure to delete "${chat.title}"?`)) {
      deleteChats(chat.id);
    }
  };

  const handleClickEdit = async (chat) => {
    const newTitle = window.prompt('Change title', chat.title);
    if (newTitle) {
      await editChat(chat.id, newTitle);
      fetchChats();
    }
  };

  return (
    <div className="hidden md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col bg-gray-1000 dark z-50">
      <div className="flex h-full min-h-0 flex-col">
        <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
          <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
            <button
              className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
              onClick={() => {
                if (userText.length) {
                  setUserText("");
                }
                createChat();
              }}
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New chat
            </button>
            <div className="w-full flex-col flex-1 overflow-y-auto border-b border-white/20 -mr-2 h-1/2">
              <div className="flex flex-col gap-2 text-gray-100 text-sm">
                {chats.map((chat, index) => (
                  <div
                    className={`text-left flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-14 ${
                      selectedChat === chat.id
                        ? "bg-gray-800"
                        : "bg-gray-1000 hover:bg-[rgba(52,53,65,.5)]"
                    } group animate-flash `}
                    key={index}
                    onClick={() => {
                      if (userText.length) {
                        setUserText("");
                      }
                      setSelectedChat(chat.id);
                    }}
                  >
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
                      {chat.title}
                    </span>

                    {chat.id === selectedChat &&
                      <div className="absolute flex right-1 z-10 text-gray-300 visible">
                        <IconEdit className="m-1 opacity-70 hover:opacity-100" onClick={() => handleClickEdit(chat)} />
                        <IconDelete className="m-1 opacity-70 hover:opacity-100" onClick={() => handleClickDelete(chat)} />
                      </div>
                    }
                  </div>
                ))}
              </div>
            </div>
            {chats.length > 0 && <>
              <button
                className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
                onClick={() => {
                  if (window.confirm('This will delete all conversations. Are you sure?')) {
                    deleteChats();
                  }
                }}
              >
                <IconDelete />
                Clear conversations
              </button>
              <button
                className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
                onClick={() => {
                  setShowSettings(true);
                }}
              >
                <IconUser />
                Settings
              </button>
            </>}
          </nav>
        </div>
      </div>

      {showSettings && <Dialog.Settings setShowSettings={setShowSettings} />}
    </div>
  );
}

export default ChatHistory;
