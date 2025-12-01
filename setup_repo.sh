#!/bin/bash

# Script to create GitHub repository and push commits

REPO_NAME="csi-final-project"
REPO_DESCRIPTION="CSI Final Project - Acceptly: Finite Automata Learning Platform"

echo "🚀 Setting up GitHub repository: $REPO_NAME"
echo ""

# Check if already authenticated
if gh auth status &>/dev/null; then
    echo "✅ Already authenticated with GitHub"
else
    echo "🔐 Please authenticate with GitHub..."
    echo "   A browser window will open. Please complete the authentication."
    gh auth login --web
fi

echo ""
echo "📦 Creating repository '$REPO_NAME'..."
gh repo create "$REPO_NAME" --public --source=. --remote=origin --description "$REPO_DESCRIPTION"

if [ $? -eq 0 ]; then
    echo ""
    echo "🚀 Pushing all 20 commits to remote..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Success! Repository created and all commits pushed!"
        echo "📍 Repository URL: https://github.com/$(gh api user --jq .login)/$REPO_NAME"
    else
        echo "❌ Error pushing commits"
        exit 1
    fi
else
    echo "❌ Error creating repository"
    exit 1
fi

