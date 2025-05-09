#!/bin/bash

# Tạo thư mục backup nếu chưa tồn tại
mkdir -p /backup

# Tạo timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup MongoDB
docker exec library-management-system-mongodb mongodump --out /backup/$TIMESTAMP

# Nén backup
tar -czf /backup/mongodb_$TIMESTAMP.tar.gz /backup/$TIMESTAMP

# Xóa thư mục backup tạm
rm -rf /backup/$TIMESTAMP

# Giữ lại 7 backup gần nhất
ls -t /backup/mongodb_*.tar.gz | tail -n +8 | xargs -r rm

# Gửi thông báo qua email (nếu cần)
# echo "Backup completed at $TIMESTAMP" | mail -s "Database Backup" your-email@example.com 