#!/bin/bash
# DIYPREFAB Website Deployment Script
# This script should be run on the VPS to deploy the latest changes

echo "=========================================="
echo "DIYPREFAB Website Deployment"
echo "=========================================="

# Navigate to the website directory
cd /var/www/diyprefab-website || cd /home/diyprefab/diyprefab-website || exit 1

echo "📦 Pulling latest changes from GitHub..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building the application..."
npm run build

echo "🚀 Restarting PM2 process..."
pm2 restart diy-frontend-react || pm2 start npm --name "diy-frontend-react" -- start

echo "✅ Deployment complete!"
echo "=========================================="
echo "Website URL: https://diyprefab.com"
echo "=========================================="
