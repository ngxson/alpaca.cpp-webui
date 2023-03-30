# Alpaca.cpp Web UI (Next.js)

Thanks to:
- [github.com/AidanGuarniere/chatGPT-UI-template](https://github.com/AidanGuarniere/chatGPT-UI-template)
- [github.com/nomic-ai/gpt4all](https://github.com/nomic-ai/gpt4all)
- [Suggestion for parameters](https://github.com/antimatter15/alpaca.cpp/issues/171)

Screenshot:

![](./doc/screenshot_0.png)

⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

**This project is in very early development stage. BUGs are expected**

⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

## How to use

1. Download `gpt4all-lora-quantized.bin` and `gpt4all-lora-quantized-*-x86` from [github.com/nomic-ai/gpt4all](https://github.com/nomic-ai/gpt4all), put them into `bin` folder
2. Edit `bin/run-chat.sh` if needed
3. Run these commands:

```
npm i
npm run dev
```

Then, open `http://localhost:3000/` on your browser

## TODO

- [ ] Support Windows
- [ ] Save history to disk
- [ ] Implement context memory
- [ ] Conversation history
- [ ] Interface for tweaking parameters
- [ ] Better guide / documentation
