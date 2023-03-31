const config = {
  // The ./chat can be downloaded from alpaca.cpp
  EXECUTABLE_FILE: './chat',
  MODEL_FILE: './ggml-alpaca-7b-q4.bin',

  // Alternatively, the gpt4all-lora-quantized can be downloaded from nomic-ai/gpt4all
  // BIN_FILE: './gpt4all-lora-quantized-linux-x86',
  // MODEL_FILE :'./gpt4all-lora-quantized.bin',

  // arguments suggested by @AIbottesting
  // https://github.com/antimatter15/alpaca.cpp/issues/171

  ARGUMENTS: ({modelPathAbs}) => [
    '--threads', '8',
    '--seed', '42',
    '--top_p', '2',
    '--top_k', '160',
    '--n_predict', '200',
    '--temp', '0.50',
    '--repeat_penalty', '1.1',
    '--ctx_size', '5121',
    '--repeat_last_n', '128',
    '--interactive-start',
    '--model', modelPathAbs,
  ],
}

module.exports = config;