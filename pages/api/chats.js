// pages/api/chats.js

export default async function handler(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      //try {
      //  const allChats = await Chat.find({});
      //  res.status(200).json(allChats);
      //} catch (error) {
      //  res.status(500).json({ error: "Internal Server Error" });
      //}
      res.status(200).json([
        {id: 1, title: 'hi', messages: [
          {role: 'user', content: 'abcdef', createdAt: Date.now()},
          {role: 'assistant', content: 'xyzabc', createdAt: Date.now()},
        ]}
      ]);
      break;
    case "POST":
      try {
        /*const { id, title, messages } = req.body;

        // If an ID is provided, update the existing chat with the new messages
        if (id) {
          // Try to find and update the chat with the given ID
          let updatedChat = await Chat.findOneAndUpdate(
            { id },
            { messages: messages },
            { new: true }
          );

          // If the chat with the given ID doesn't exist, create a new chat
          if (!updatedChat) {
            updatedChat = await Chat.create({ id, title, messages });
            return res.status(201).json(updatedChat);
          }

          return res.status(200).json(updatedChat);
        } else {
          // If no ID is provided, create a new chat
          const newChat = await Chat.create({ title, messages });
          return res.status(201).json(newChat);
        }*/
        return res.status(201).json({});
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;
    case "DELETE":
      try {
        /*
        const { id } = req.body;
        if (id) {
          const deletedChat = await Chat.deleteOne({ id });
          console.log(deletedChat)
          res.status(200).json(deletedChat);
        } else {
          const allChats = await Chat.deleteMany();
          res.status(200).json(allChats);
        }
        */
        return res.status(201).json({});
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
