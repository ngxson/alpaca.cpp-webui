#!/bin/sh

BASEDIR=$(dirname "$0")
cd "$BASEDIR"

chmod +x ./gpt4all-lora-quantized-linux-x86

./gpt4all-lora-quantized-linux-x86 -t 8 \
  -s 42 --top_p 2 --top_k 160 --n_predict 100 --temp 0.50 \
  --repeat_penalty 1.1 -i -c 5121 --repeat_last_n 128 \
  --interactive-start
