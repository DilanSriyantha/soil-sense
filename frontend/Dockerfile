# use node.js base image
FROM node:18

# set up working directory
WORKDIR /soil_sense_app

# copy package.json and package-lock.json
COPY package.json package-lock.json ./
RUN npm install

# copy all files
COPY . .

# build react app
RUN npm run build

# use nginx to serve frontend
FROM nginx:alpine
COPY --from=0 /soil_sense_app/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run react app
CMD ["nginx", "-g", "daemon off;"]