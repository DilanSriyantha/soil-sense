# use node.js base image
FROM node:20

# set up work directory
WORKDIR /soil_sense_app

# copy package.json and package-lock.json
COPY package.json package-lock.json ./
RUN npm install

# copy all files to the working director
COPY . .

# expose port 5000
EXPOSE 5000

# run server
CMD [ "node", "server.js" ]