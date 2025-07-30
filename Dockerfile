# Dockerfile cho frontend Angular (phát triển)
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install --legacy-peer-deps
RUN npm install -g @angular/cli
# Copy toàn bộ code
COPY . .

# Mở cổng 4200 (mặc định của ng serve)
EXPOSE 4200

# Lệnh mặc định (có thể override trong docker-compose.yml)
CMD ["npm", "start"]
