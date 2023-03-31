import Sequelize from 'sequelize';
import path from 'path';
import fs from 'fs';

const getDataDir = () => {
  let dir = __dirname;
  if (__dirname.match(/\.next/)) {
    dir = dir.replace(/\.next.*/, '');
  } else {
    dir = dir.replace(/utils(\\|\/)/, '');
  }
  dir = path.join(dir, '.data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  return dir;
};

const dbDir = path.join(getDataDir(), 'db.sqlite');
console.log('load sqlite from', dbDir);

/** @type {Sequelize} */
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbDir,
});


//////////////////////////////////////////////////////

/** @type {Sequelize.Model} */
export const MessageModel = sequelize.define('message', {
  id: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
  chat_id: { type: Sequelize.STRING, allowNull: false },
  data: { type: Sequelize.STRING, allowNull: false },
}, {
  timestamps: false
});

(async () => {
  await MessageModel.sync();
  const query = 'CREATE INDEX IF NOT EXISTS message_chat_id_idx ON messages(chat_id)';
  await sequelize.query(query);
})();

//////////////////////////////////////////////////////

/** @type {Sequelize.Model} */
export const ChatModel = sequelize.define('chat', {
  id: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
  title: { type: Sequelize.STRING },
  data: { type: Sequelize.STRING },
}, {
  timestamps: false
});

(async () => {
  await ChatModel.sync();
})();
