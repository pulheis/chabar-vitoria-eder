# Render Deploy Script
# =====================

echo "🚀 Starting Render Build Process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Install dev dependencies needed for build
echo "🔧 Installing build dependencies..."
npm install --save-dev @types/node @types/react @types/react-dom typescript

# Build the application
echo "🏗️ Building application..."
NODE_ENV=production npm run build

echo "✅ Build completed successfully!"
