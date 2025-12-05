#!/bin/bash

# Script to create a clean source archive for submission
# Excludes: .git, node_modules, build files, and other non-essential files

ARCHIVE_NAME="csi-final-source-submission"
TEMP_DIR="submission-temp"

# Clean up any existing temp directory
rm -rf "$TEMP_DIR"
rm -f "${ARCHIVE_NAME}.zip" "${ARCHIVE_NAME}.tar.gz"

# Create temp directory
mkdir -p "$TEMP_DIR"

# Copy essential files and directories
echo "Copying source files..."

# Source code
cp -r src "$TEMP_DIR/"
cp -r server "$TEMP_DIR/"
cp -r public "$TEMP_DIR/"

# Configuration files
cp package.json "$TEMP_DIR/"
cp package-lock.json "$TEMP_DIR/"
cp .gitignore "$TEMP_DIR/"

# Deployment configuration
if [ -f "vercel.json" ]; then
    cp vercel.json "$TEMP_DIR/"
fi
if [ -f "render.yaml" ]; then
    cp render.yaml "$TEMP_DIR/"
fi

# Documentation (keep essential ones)
cp README.md "$TEMP_DIR/"
cp LOCAL_SETUP.md "$TEMP_DIR/" 2>/dev/null || true

# Tests
if [ -d "tests" ]; then
    cp -r tests "$TEMP_DIR/"
fi

# Create archive
echo "Creating archive..."
cd "$TEMP_DIR"
zip -r "../${ARCHIVE_NAME}.zip" . -x "*.DS_Store" "*.log"
tar -czf "../${ARCHIVE_NAME}.tar.gz" . --exclude="*.DS_Store" --exclude="*.log"
cd ..

# Clean up temp directory
rm -rf "$TEMP_DIR"

echo ""
echo "✅ Archive created successfully!"
echo "📦 Files:"
echo "   - ${ARCHIVE_NAME}.zip"
echo "   - ${ARCHIVE_NAME}.tar.gz"
echo ""
echo "Archive includes:"
echo "  ✓ src/ (all source code)"
echo "  ✓ server/ (backend code)"
echo "  ✓ public/ (public assets)"
echo "  ✓ package.json & package-lock.json"
echo "  ✓ Deployment configs (vercel.json, render.yaml)"
echo "  ✓ README.md"
echo "  ✓ Tests (if present)"
echo ""
echo "Excluded:"
echo "  ✗ .git/ (git repository)"
echo "  ✗ node_modules/ (dependencies - install with npm install)"
echo "  ✗ build/ (build artifacts)"
echo "  ✗ Documentation files (except README.md)"
echo ""


