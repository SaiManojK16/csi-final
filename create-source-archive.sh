#!/bin/bash

# Script to create source code archive for Milestone 6 submission
# Team B (SVSMC)

echo "Creating source code archive for Milestone 6 submission..."
echo "This will create TeamB-milestone6-source.zip with all project source files"
echo ""

# Create archive excluding unnecessary files
# Note: Using src/ directory as primary source (components/ appears to be duplicate/legacy)
zip -r TeamB-milestone6-source.zip \
  src/ \
  server/ \
  public/ \
  tests/ \
  package.json \
  package-lock.json \
  README.md \
  vercel.json \
  render.yaml \
  .gitignore \
  LOCAL_SETUP.md \
  -x "*.log" \
  -x "node_modules/*" \
  -x ".git/*" \
  -x "build/*" \
  -x ".env" \
  -x ".env.local" \
  -x "*.DS_Store" \
  -x ".vscode/*" \
  -x ".idea/*" \
  -x "coverage/*" \
  -x ".nyc_output/*" \
  -x "components/*" \
  -x "data/data/*" \
  -x "tours/tours/*"

echo ""
echo "✓ Archive created: TeamB-milestone6-source.zip"
echo "File size:"
ls -lh TeamB-milestone6-source.zip

echo ""
echo "Archive contents preview:"
unzip -l TeamB-milestone6-source.zip | head -30

echo ""
echo "Please verify the archive contains all necessary source files."
echo "Do NOT include: node_modules, .git, build, .env files"
echo ""
echo "Next steps:"
echo "1. Review the archive contents"
echo "2. Submit TeamB-milestone6-source.zip to Dropbox"
echo "3. Submit TeamB-milestone6-summary.md and TeamB-milestone6-access.md"

