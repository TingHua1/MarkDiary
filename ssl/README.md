# SSL证书配置

## 生成自签名证书（仅用于开发）

```bash
# 生成私钥
openssl genrsa -out ssl/private.key 2048

# 生成证书签名请求
openssl req -new -key ssl/private.key -out ssl/certificate.csr

# 生成自签名证书
openssl x509 -req -days 365 -in ssl/certificate.csr -signkey ssl/private.key -out ssl/certificate.crt
```

## 使用真实证书

将您的真实证书文件放在此目录：
- private.key - 私钥文件
- certificate.crt - 证书文件
