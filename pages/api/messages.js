// pages/api/chats.js

import { MessageModel } from "../../utils/db";

const getMessageObj = (id, chat_id, data) => {
  return {
    id,
    chat_id,
    ...JSON.parse(data),
  }
};

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { id } = req.query;
        const row = await MessageModel.findOne({ where: { id } });
        if (row) {
          res.status(200).json(getMessageObj(row.id, row.chat_id, row.data));
        } else {
          res.status(404).json({ error: 'not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;
    case "POST":
      try {
        const { id, chat_id, role, content } = req.body;
        const row = await MessageModel.findOne({ where: { id } });
        if (!row) {
          const data = JSON.stringify({ role, content, createdAt: Date.now() });
          await MessageModel.bulkCreate([{
            id, chat_id, data
          }]);
          res.status(200).json(getMessageObj(id, chat_id, data));
        } else {
          row.data = JSON.stringify({
            ...JSON.parse(row.data),
            content,
          });
          await row.save();
          res.status(200).json(getMessageObj(id, chat_id, row.data));
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
