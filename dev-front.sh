#!/bin/bash
npm install
npm run husky

# set permissions
chmod 777 .husky/_/*
chmod +x .husky/commit-msg
chmod +x .husky/pre-commit
npm run start
