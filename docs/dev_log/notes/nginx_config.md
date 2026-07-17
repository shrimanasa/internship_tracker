# Nginx Reverse Proxy Config

```nginx
server {
    listen 80;
    server_name interntrack.college.edu;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name interntrack.college.edu;

    ssl_certificate /etc/ssl/certs/interntrack.pem;
    ssl_certificate_key /etc/ssl/private/interntrack.key;

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header X-Request-ID $request_id;
    }

    location / {
        proxy_pass http://localhost:3001;
    }
}
```
