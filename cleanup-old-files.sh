#!/bin/bash

# Cleanup Script for Next.js Migration
# This removes old React + Express files that are no longer needed

echo "🧹 Acceptly - Cleanup Old Files"
echo "================================"
echo ""
echo "This will remove:"
echo "  - server/ (replaced by pages/api/)"
echo "  - src/ (replaced by root-level components/)"
echo "  - Old package-lock.json (will be regenerated)"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Cleanup cancelled"
    exit 1
fi

echo "🗑️  Removing old files..."

# Backup first
if [ ! -d "backup_pre_cleanup" ]; then
    echo "📦 Creating backup..."
    mkdir backup_pre_cleanup
    cp -r server backup_pre_cleanup/ 2>/dev/null || true
    cp -r src backup_pre_cleanup/ 2>/dev/null || true
    echo "✅ Backup created in backup_pre_cleanup/"
fi

# Remove old directories
echo "🗑️  Removing server/..."
rm -rf server/

echo "🗑️  Removing src/..."
rm -rf src/

echo "🗑️  Removing old build artifacts..."
rm -rf build/
rm -rf .next/
rm -rf node_modules/

echo "🗑️  Removing old package-lock..."
rm -f package-lock.json

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. npm install"
echo "   2. Create .env.local (see .env.local.example)"
echo "   3. npm run dev"
echo ""
echo "🚀 Ready to deploy to Vercel!"

