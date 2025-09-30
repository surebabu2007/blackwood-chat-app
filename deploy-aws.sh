#!/bin/bash

# AWS S3 + CloudFront Deployment Script
BUCKET_NAME="blackwood-manor-chat-$(date +%s)"
REGION="us-west-2"

echo "Creating S3 bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

echo "Configuring bucket for static website hosting"
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document 404.html

echo "Setting bucket policy for public read access"
cat > bucket-policy.json << EOF
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

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

echo "Building application for static export"
npm run build

echo "Uploading files to S3"
aws s3 sync .next/static s3://$BUCKET_NAME/_next/static --delete
aws s3 sync out s3://$BUCKET_NAME --delete

echo "Website URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo "Bucket name: $BUCKET_NAME"