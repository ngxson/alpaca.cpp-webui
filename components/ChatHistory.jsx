import React from "react";
import axios from "axios";

function ChatHistory({
  chats,
  userText,
  setUserText,
  setChats,
  selectedChat,
  setSelectedChat,
}) {
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
  return (
    <div className="hidden md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col bg-gray-1000 dark z-50">
      <div className="flex h-full min-h-0 flex-col">
        <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
          <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
            <button
              className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
              onClick={() => {
                //if (userText.length) {
                //  setUserText("");
                //}
                //setSelectedChat(null);

                // TODO
                window.alert('Not yet implemented');
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
                  <button
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
                      {chat.title.split(" ").slice(0, 5).join(" ")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {chats.length > 0 && (
              <button
                className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
                onClick={() => {
                  //console.log("clicked mayne")
                  //deleteChats();
                  // TODO
                  window.alert('Not yet implemented');
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
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Clear conversations
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default ChatHistory;
