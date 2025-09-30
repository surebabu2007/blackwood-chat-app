#!/bin/bash

# Simple deployment script for AWS S3
BUCKET_NAME="blackwood-manor-chat-$(date +%s)"
REGION="us-west-2"

echo "🚀 Deploying Blackwood Manor Chat to AWS S3..."

# Create unique bucket name
echo "📦 Creating S3 bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Configure for static website hosting
echo "🌐 Configuring static website hosting..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document 404.html

# Set public read policy
echo "🔓 Setting public read permissions..."
cat > /tmp/bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file:///tmp/bucket-policy.json

# Upload files
echo "📤 Uploading files to S3..."
aws s3 sync out s3://$BUCKET_NAME --delete

# Get website URL
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo "✅ Deployment complete!"
echo "🌍 Website URL: $WEBSITE_URL"
echo "📋 Bucket name: $BUCKET_NAME"
echo ""
echo "🎮 Widget Integration URL for your game:"
echo "$WEBSITE_URL/widget-demo"