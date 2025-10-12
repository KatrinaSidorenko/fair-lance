#!/bin/bash

# Usage: ./script.sh <directory> <filename>
# Example: ./script.sh ./internal "main.go"

# Exit if any command fails
set -e

# Check args
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <directory> <filename>"
    exit 1
fi

TARGET_DIR=$1
TARGET_NAME=$2

# Verify directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: Directory '$TARGET_DIR' does not exist."
    exit 1
fi

# Find all matching files and loop through them
find "$TARGET_DIR" -type f -name "$TARGET_NAME" | while read -r file; do
    echo "==== File: $file ===="
    cat "$file"
    echo -e "\n"
done
