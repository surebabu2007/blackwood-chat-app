#!/bin/bash

# EC2 Setup Script for Ubuntu
sudo apt update
sudo apt install -y nodejs npm nginx

# Install PM2 for process management
sudo npm install -g pm2

# Clone and setup application
cd /var/www
sudo git clone <your-repo-url> blackwood-chat
cd blackwood-chat
sudo npm install
sudo npm run build

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'blackwood-chat',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Configure Nginx
sudo tee /etc/nginx/sites-available/blackwood-chat << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/blackwood-chat /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx