# File Upload Security

## Layers
1. Extension whitelist: pdf, doc, docx, png, jpg
2. Size limit: 5MB maximum
3. Magic byte check: Header signature
4. UUID renaming: Prevents path traversal

## Signatures
| Ext | Bytes |
|-----|-------|
| PDF | %PDF |
| PNG | 89 50 4E 47 |
| JPEG | FF D8 FF |
| DOC | D0 CF 11 E0 |
| DOCX | PK 03 04 |
