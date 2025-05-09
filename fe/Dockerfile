# Sử dụng Node.js làm base image để build ứng dụng
FROM node:18-alpine as build

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Build ứng dụng
RUN npm run build

# Sử dụng Nginx làm web server
FROM nginx:alpine

# Sao chép kết quả build từ stage trước vào thư mục web của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Cấu hình Nginx để chuyển hướng tất cả các request đến index.html (cho SPA)
RUN echo 'server { \
    listen 9988; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Mở cổng 9988
EXPOSE 9988

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]
