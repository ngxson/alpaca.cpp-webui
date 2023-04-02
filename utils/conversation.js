import _ from 'lodash';

// inspiration: https://colab.research.google.com/drive/115ba3EFCT0PvyXzFNv9E18QnKiyyjsm5?usp=sharing

const CONVERSATION_TEMPLATE = ({ prompt, history, input }) => `${prompt.trim()}

Conversation:
${history}
Human: ${input}
AI:`;

export const getConversationPrompt = (messages, input, historyLength, prompt) => {
  const history = _.takeRight(messages, parseInt(historyLength)).map(m =>
    `${m.role === 'user' ? 'Human' : 'AI'}: ${m.content || '(say nothing)'}`  
  ).join('\n');
  return CONVERSATION_TEMPLATE({ prompt, history, input });
};
