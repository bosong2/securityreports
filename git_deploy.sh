#!/bin/bash

# Git Deploy Script
# 사용법: ./git_deploy.sh "커밋 메시지"

if [ -z "$1" ]; then
  echo "Usage: ./git_deploy.sh \"Commit message\""
  echo "Example: ./git_deploy.sh \"UI update and bug fixes\""
  exit 1
fi

echo "Adding all changes..."
git add .

echo "Committing with message: $1"
git commit -m "$1"

echo "Pushing to remote..."
git push origin main

echo "Done!"
