#!/bin/bash

# Initialize the repository if it hasn't been already
git init

# Add the remote repository, or update it if it already exists
git remote add origin https://github.com/kropbookcodebase/kropbook-presentation.git 2>/dev/null || git remote set-url origin https://github.com/kropbookcodebase/kropbook-presentation.git

# Rename the default branch to main
git branch -M main

# Add all files to staging
git add .

# Commit the changes
git commit -m "Upload Kropbook HTML Presentation"

# Push to the remote repository
echo "Pushing to GitHub..."
git push -u origin main
