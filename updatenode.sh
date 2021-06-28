#!/bin/bash
#sudo yum -y update &&
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash &&
. ~/.bashrc &&
nvm install node
