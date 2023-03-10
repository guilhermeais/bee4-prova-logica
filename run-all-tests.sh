#!/bin/bash

# Run all tests in the current directory and subdirectories with the extension .spec.js
echo "Running all tests in the current directory and subdirectories with the extension .spec.js...\n"
for file in ./**/*.spec.js; do
  if [ -f "$file" ]; then
    echo "Running file: $file"
    node $file
    echo "\n"
  fi

done