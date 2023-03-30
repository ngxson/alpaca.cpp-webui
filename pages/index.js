import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Inter } from "@next/font/google";
const inter = Inter({ subsets: ["latin"] });
import ChatHistory from "../components/ChatHistory";
import Chats from "../components/Chats";
import ErrorDisplay from "../components/ErrorDisplay";
import axios from "axios";
import NativeBridge from "../components/NativeBridge";

export default function Home() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [userText, setUserText] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalState, setGlobalState] = useState({
    assistantTypingMsgId: null,
  });

  // Fetch chats from the server instead of local storage
  useEffect(() => {
    /*
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

    fetchChats();
    */
    const FAKE_DATA = [
      {id: 1, title: 'New Chat', messages: [
        {role: 'assistant', content: 'Hi, how can I help you?', createdAt: Date.now()},
      ]}
    ];
    setChats(FAKE_DATA);
    setSelectedChat(1);
  }, []);
  return (
    <>
      <Head>
        <title>Alpaca.cpp Web UI</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NativeBridge
        setChats={setChats}
        setGlobalState={setGlobalState}
      />
      <main className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div className="w-screen h-screen mx-auto overflow-hidden bg-white p-0">
          <div className="flex overflow-x-hidden items-bottom">
            <ChatHistory
              chats={chats}
              userText={userText}
              setUserText={setUserText}
              setChats={setChats}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              globalState={globalState}
            />
            {error && <ErrorDisplay error={error} />}
            <Chats
              userText={userText}
              setUserText={setUserText}
              setError={setError}
              chats={chats}
              setChats={setChats}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              globalState={globalState}
              setGlobalState={setGlobalState}
            />
          </div>
        </div>{" "}
      </main>
    </>
  );
}