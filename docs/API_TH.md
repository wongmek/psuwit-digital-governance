# รายการ API

Base URL: `/api` การเรียกจาก Frontend ส่ง Bearer session หรือ cookie session ทุกครั้ง ยกเว้น Health และ Login

| Method | Endpoint | วัตถุประสงค์ |
|---|---|---|
| GET | `/health` | ตรวจสถานะบริการ |
| POST | `/auth/google` | ตรวจ Google ID Token และสร้างเซสชัน |
| POST | `/auth/demo` | เข้าระบบสาธิตเมื่อเปิด `DEMO_MODE` |
| GET/POST | `/requests` | ดูและสร้างคำขอ |
| GET | `/requests/:id` | รายละเอียด คำเห็น และ Timeline |
| POST | `/requests/:id/decision` | บันทึกผลพิจารณา |
| POST | `/requests/:id/timeline` | บันทึกความเห็น/กิจกรรม |
| GET/POST | `/registers` | ทะเบียนกลาง |
| PATCH | `/registers/:id` | เปิดใช้หรือระงับรายการทะเบียน |
| GET/POST | `/risks` | ทะเบียนความเสี่ยง |
| PATCH | `/risks/:id` | ปรับมาตรการ ความเสี่ยงคงเหลือ หรือปิดรายการ |
| GET/POST | `/incidents` | ทะเบียนและรับแจ้งเหตุ |
| PATCH | `/incidents/:id` | ปรับการตอบสนองและสถานะเหตุการณ์ |
| POST | `/files/upload-session` | ขอ Google Drive resumable upload URL |
| POST | `/files/confirm` | ยืนยัน metadata ของหลักฐาน |
| GET | `/reports/summary` | สรุปตัวชี้วัด |
| GET | `/reports/export/:type` | CSV: requests/registers/risks/incidents/audit |
| GET/PUT | `/admin/settings` | อ่านและแก้ค่าระบบ |
| GET | `/admin/users` | รายชื่อผู้ใช้ |
| PUT | `/admin/users/:id/roles` | กำหนดบทบาท |
