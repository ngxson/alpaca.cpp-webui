import _ from 'lodash';

// inspiration: https://colab.research.google.com/drive/115ba3EFCT0PvyXzFNv9E18QnKiyyjsm5?usp=sharing

const CONVERSATION_TEMPLATE = ({ history, input }) => `The following is a friendly conversation between a human and an AI called Alpaca. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know. 

Current conversation:
${history}
Human: ${input}
AI:`;

export const getConversationPrompt = (messages, input, historyLength) => {
  const history = _.takeRight(messages, parseInt(historyLength)).map(m =>
    `${m.role === 'user' ? 'Human' : 'AI'}: ${m.content || '(say nothing)'}`  
  ).join('\n');
  return CONVERSATION_TEMPLATE({ history, input });
};
