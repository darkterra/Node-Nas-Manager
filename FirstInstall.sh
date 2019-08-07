#!/bin/bash

# Update the RPI
echo "Update the RPI"
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
# curl -sSL https://get.docker.com | sh

# Test Docker
# sudo docker run hello-world

# Enable SSH by default
echo "Enable SSH by default"
sudo touch /boot/ssh

# Install all important tools
echo "Install all important tools"
sudo apt-get install mdadm samba samba-common-bin git usbmount htop -y

# Install Node.js
echo "Install Node.js"
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "Clone repo"
git clone https://github.com/darkterra/Node-Nas-Manager.git && cd Node-Nas-Manager

echo "Install dependencies"
npm i

# Install PM2
echo "Install PM2"
sudo npm install -g pm2
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi
pm2 save

echo "Launch the service"
pm2 start server.js


# TODO: Test and mound Disks

# This install is now finish => Time to remove this First Install Script...
# sudo rm -fr /boot/FirstInstall.sh

echo "Done..."
ifconfig | grep "inet 192"
sleep 3
sudo reboot