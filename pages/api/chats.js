// pages/api/chats.js

import { ChatModel, MessageModel } from "../../utils/db";
import { uuidv4 } from "../../utils/uuid";

const getMessageObj = (id, chat_id, data) => {
  return {
    id,
    chat_id,
    ...JSON.parse(data),
  }
};

export const getAllChats = async () => {
  const [
    allChatsMetadata,
    allMessages,
  ] = await Promise.all([
    ChatModel.findAll(),
    MessageModel.findAll(),
  ]);
  const metadatas = Object.fromEntries(
    allChatsMetadata.map(({id, title}) => [id, {title}])
  );
  const chats = {};
  allMessages.forEach(({ id, chat_id, data }) => {
    if (!chats[chat_id]) {
      const metadata = metadatas[chat_id] || {};
      chats[chat_id] = {
        id: chat_id,
        title: metadata.title || 'New Chat',
        messages: []
      };
    }
    chats[chat_id].messages.push(getMessageObj(id, chat_id, data));
  });

  const allChats = Object.values(chats);
  allChats.sort((a,b) => b.messages?.at(-1)?.createdAt - a.messages?.at(-1)?.createdAt);

  return allChats;
};

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      res.status(200).json(await getAllChats());
      break;
    case "POST":
      try {
        const msg = {
          id: uuidv4(),
          chat_id: uuidv4(),
          data: JSON.stringify({
            role: 'assistant',
            content: 'Hi, how can I help you?',
            createdAt: Date.now(),
          })
        };
        await MessageModel.bulkCreate([msg]);
        await ChatModel.bulkCreate([{
          id: msg.chat_id,
          title: 'New Chat',
          data: '{}',
        }]);
        return res.status(201).json(getMessageObj(msg.id, msg.chat_id, msg.data));
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;
    case "PATCH":
      try {
        const { id, title } = req.body;
        const row = await ChatModel.findOne({ where: { id } });
        row.title = title;
        await row.save();
        return res.status(201).json({});
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;
    case "DELETE":
      try {
        const { id } = req.body;
        if (id) {
          await MessageModel.destroy({ where: { chat_id: id } });
          await ChatModel.destroy({ where: { id } });
        } else {
          await MessageModel.destroy({ where: {} });
          await ChatModel.destroy({ where: {} });
        }
        return res.status(201).json({});
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
