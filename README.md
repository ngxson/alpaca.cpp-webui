# Alpaca.cpp Web UI (Next.js)

This is a web UI wrapper for alpaca.cpp

Thanks to:
- [github.com/AidanGuarniere/chatGPT-UI-template](https://github.com/AidanGuarniere/chatGPT-UI-template)
- [github.com/antimatter15/alpaca.cpp](https://github.com/antimatter15/alpaca.cpp) and [github.com/ggerganov/llama.cpp](https://github.com/ggerganov/llama.cpp)
- [github.com/nomic-ai/gpt4all](https://github.com/nomic-ai/gpt4all)
- [Suggestion for parameters](https://github.com/antimatter15/alpaca.cpp/issues/171)

## Features

- [x] Save chat history to disk
- [x] Implement context memory
- [x] Conversation history
- [x] Interface for tweaking parameters
- [x] Better guide / documentation
- [x] Ability to stop / regenerate response
- [x] Detect code response / use monospace font
- [x] Responsive UI
- [ ] [Configuration presets](https://www.reddit.com/r/LocalLLaMA/comments/1227uj5/my_experience_with_alpacacpp/)

Screenshot:

![](./doc/screenshot_0.png)

<p>
  <img src="https://raw.githubusercontent.com/ngxson/alpaca.cpp-webui/master/doc/screenshot_1.png" width="49%">
  <img src="https://raw.githubusercontent.com/ngxson/alpaca.cpp-webui/master/doc/screenshot_2.png" width="49%">
</p>

## How to use

Pre-requirements:
- You have nodejs v18+ installed on your machine (or if you have Docker, you don't need to install nodejs)
- You are using Linux (Windows should also work, but I have not tested yet)

**For Windows user**, these is a detailed guide here: [doc/windows.md](./doc/windows.md)

🔶 **Step 1**: Clone this repository to your local machine

🔶 **Step 2**: Download the model and binary file to run the model. You have some options:

- 👉 (Recommended) `Alpaca.cpp` and `Alpaca-native-4bit-ggml` model => This combination give me very convincing responses most of the time
  - Download `chat` binary file and place it under `bin` folder: https://github.com/antimatter15/alpaca.cpp/releases
  - Download `ggml-alpaca-7b-q4.bin` and place it under `bin` folder: https://huggingface.co/Sosaka/Alpaca-native-4bit-ggml/blob/main/ggml-alpaca-7b-q4.bin

- 👉 Alternatively, you can use `gpt4all`: Download `gpt4all-lora-quantized.bin` and `gpt4all-lora-quantized-*-x86` from [github.com/nomic-ai/gpt4all](https://github.com/nomic-ai/gpt4all), put them into `bin` folder

🔶 **Step 3**: Edit `bin/config.js` so that the executable name and the model file name are correct  
(If you are using `chat` and `ggml-alpaca-7b-q4.bin`, you don't need to modify anything)

🔶 **Step 4**: Run these commands

```
npm i
npm start
```

Alternatively, you can just use `docker compose up` if you have Docker installed.

Then, open [http://localhost:13000/](http://localhost:13000/) on your browser

## TODO

- [x] Test on Windows
- [x] Proxy ws via nextjs
- [x] Add Dockerfile / docker-compose
- [ ] UI: add avatar