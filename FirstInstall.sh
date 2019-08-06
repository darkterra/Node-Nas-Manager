#!/bin/bash

# Update the RPI
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
# curl -sSL https://get.docker.com | sh

# Test Docker
# sudo docker run hello-world

# Install all important tools
sudo apt-get install mdadm git usbmount -y

# Install Node.js
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs

git clone git@github.com:darkterra/Node-Nas-Manager.git && cd Node-Nas-Manager

npm i
node server.js &

# TODO: Test and mound Disks

# This install is now finish => Time to remove this First Install Script...
# sudo rm -fr /boot/FirstInstall.sh

echo "Done..."
sleep 2
# sudo reboot