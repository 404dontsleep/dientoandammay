# Sử dụng Node.js LTS version
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci --only=production

# Sao chép source code
COPY . .

# Tạo thư mục logs
RUN mkdir -p logs

# Expose port
EXPOSE 9999

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Chạy ứng dụng
CMD ["node", "server.js"] 