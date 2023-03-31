# Alpaca.cpp Web UI (Next.js)

Thanks to:
- [github.com/AidanGuarniere/chatGPT-UI-template](https://github.com/AidanGuarniere/chatGPT-UI-template)
- [github.com/antimatter15/alpaca.cpp](https://github.com/antimatter15/alpaca.cpp) and [github.com/ggerganov/llama.cpp](https://github.com/ggerganov/llama.cpp)
- [github.com/nomic-ai/gpt4all](https://github.com/nomic-ai/gpt4all)
- [Suggestion for parameters](https://github.com/antimatter15/alpaca.cpp/issues/171)

Screenshot:

![](./doc/screenshot_0.png)

⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

**This project is in very early development stage. BUGs are expected**

⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

## How to use

**Step 1**: Clone this repository to your local machine

**Step 2**: Download the model and binary file to run the model. You have some options:

(Recommended) `Alpaca.cpp` and `Alpaca-native-4bit-ggml` model => This combination give me very convincing responses most of the time
- Download `chat` binary file and place it under `bin` folder: https://github.com/antimatter15/alpaca.cpp/releases
- Download `ggml-alpaca-7b-q4.bin` and place it under `bin` folder: https://huggingface.co/Sosaka/Alpaca-native-4bit-ggml/blob/main/ggml-alpaca-7b-q4.bin

Alternatively, you can use `gpt4all`: Download `gpt4all-lora-quantized.bin` and `gpt4all-lora-quantized-*-x86` from [github.com/nomic-ai/gpt4all](https://github.com/nomic-ai/gpt4all), put them into `bin` folder

**Step 3**: Run these commands

```
npm i
npm start
```

Then, open `http://localhost:13000/` on your browser

## TODO

- [ ] Support Windows
- [x] Save chat history to disk
- [ ] Implement context memory
- [x] Conversation history
- [ ] Interface for tweaking parameters
- [x] Better guide / documentation
- [x] Ability to stop / regenerate response
