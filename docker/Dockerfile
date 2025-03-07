FROM node:18.13.0 

# Update and install dependencies
RUN apt-get update && apt-get -y install git python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY ./ /make-sense

# Set working directory
WORKDIR /make-sense

# Install dependencies
RUN npm install --save-exact @tensorflow/tfjs-node@3.18.0 --legacy-peer-deps

# Set the entry point
ENTRYPOINT ["npm", "run", "dev"]