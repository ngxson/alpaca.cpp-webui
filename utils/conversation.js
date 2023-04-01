import _ from 'lodash';

// inspiration: https://colab.research.google.com/drive/115ba3EFCT0PvyXzFNv9E18QnKiyyjsm5?usp=sharing

const CONVERSATION_TEMPLATE = ({ history, input }) => `The following is a friendly conversation between human and AI called Alpaca. AI is talkative and provides details from its context. 

Conversation:
${history}
Human: ${input}
AI:`;

export const getConversationPrompt = (messages, input, historyLength) => {
  const history = _.takeRight(messages, parseInt(historyLength)).map(m =>
    `${m.role === 'user' ? 'Human' : 'AI'}: ${m.content || '(say nothing)'}`  
  ).join('\n');
  return CONVERSATION_TEMPLATE({ history, input });
};
