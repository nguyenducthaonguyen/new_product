#!/bin/bash

# Script để xóa tất cả môi trường development

echo "🧹 Cleaning up development environments..."

# 1. Xóa virtual environments
echo "📦 Removing virtual environments..."
find . -type d -name "venv" -exec rm -rf {} + 2>/dev/null
find . -type d -name ".venv" -exec rm -rf {} + 2>/dev/null
echo "✓ Virtual environments removed"

# 2. Xóa __pycache__ và .pyc files
echo "🗑️  Removing Python cache files..."
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
find . -type f -name "*.pyc" -delete 2>/dev/null
find . -type f -name "*.pyo" -delete 2>/dev/null
find . -type f -name "*.pyd" -delete 2>/dev/null
echo "✓ Python cache files removed"

# 3. Xóa Docker containers và volumes (nếu có)
echo "🐳 Stopping and removing Docker containers..."
cd functions/product_manager 2>/dev/null
if [ -f "docker-compose.yaml" ]; then
    docker-compose down -v 2>/dev/null || true
    echo "✓ Docker containers stopped and removed"
fi
cd ../..

# 4. Xóa cdk.out (CDK build artifacts)
echo "📦 Removing CDK build artifacts..."
if [ -d "cdk.out" ]; then
    rm -rf cdk.out
    echo "✓ CDK build artifacts removed"
fi

# 5. Xóa .pytest_cache và coverage reports
echo "🧪 Removing test artifacts..."
find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null
find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null
find . -type d -name ".coverage" -exec rm -rf {} + 2>/dev/null
find . -type f -name ".coverage" -delete 2>/dev/null
echo "✓ Test artifacts removed"

# 6. Xóa .mypy_cache
echo "🔍 Removing type check cache..."
find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null
echo "✓ Type check cache removed"

echo ""
echo "✨ Cleanup completed!"
echo ""
echo "Note: Database data is NOT deleted. To remove database:"
echo "  - Docker: docker volume rm product_manager_postgres"
echo "  - Local: Drop database manually in PostgreSQL"

