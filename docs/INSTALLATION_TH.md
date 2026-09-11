# คู่มือติดตั้งและตั้งค่าระบบ

## 1. สิ่งที่ต้องจัดเตรียม

1. GitHub Repository สำหรับเก็บซอร์สโค้ดและเผยแพร่ Frontend
2. บัญชี Vercel สำหรับเผยแพร่ Backend
3. TiDB Cloud Cluster และบัญชีฐานข้อมูล
4. Google Cloud Project ภายใต้การกำกับดูแลของโรงเรียน
5. Google Shared Drive หรือโฟลเดอร์กลางที่กำหนดสิทธิ์แก่ Service Account
6. ผู้ดูแล Google Workspace ที่สามารถกำหนด OAuth แบบ Internal

> Vercel Hobby และ TiDB Cloud Starter มีข้อจำกัดด้านโควตาและเงื่อนไขการใช้งาน ควรตรวจสอบเงื่อนไขล่าสุดก่อนประกาศใช้เป็นระบบทางราชการ และกำหนดแนวทางสำรองเมื่อบริการถึงโควตา

## 2. นำซอร์สโค้ดขึ้น GitHub

สร้าง Repository ใหม่ แล้วดำเนินการจากโฟลเดอร์โครงการ

```bash
git init
git add .
git commit -m "Initial PSUWIT Digital Governance System"
git branch -M main
git remote add origin https://github.com/ORGANIZATION/REPOSITORY.git
git push -u origin main
```

## 3. จัดเตรียม TiDB Cloud

1. สร้าง Cluster ประเภท Starter และเลือก Region ที่เหมาะสม
2. สร้างฐานข้อมูลชื่อ `psuwit_governance`
3. สร้างผู้ใช้เฉพาะระบบ ไม่ใช้บัญชีผู้ดูแลหลัก
4. เปิดหน้า Connect เลือก General/MySQL และคัดลอก connection string แบบ TLS
5. บนเครื่องผู้ติดตั้ง สร้าง `backend/.env` จาก `.env.example` แล้วกำหนด `DATABASE_URL`
6. กำหนด `DEMO_MODE=false` และเรียกคำสั่งต่อไปนี้หนึ่งครั้ง

```bash
npm install
npm --workspace backend run db:migrate
```

ผลที่ต้องได้คือ `Applied 001_initial.sql` และ `Applied 002_seed.sql` ห้ามเก็บ connection string ใน GitHub

หากผู้ให้บริการกำหนด CA เฉพาะ ให้แปลงไฟล์ CA เป็น Base64 แล้วกำหนดใน `TIDB_CA_BASE64` ทั้งเครื่องติดตั้งและ Vercel

## 4. ตั้งค่า Google Workspace OAuth

1. เปิด Google Cloud Console และสร้าง Project สำหรับระบบนี้
2. ตั้งค่า OAuth consent screen เป็น **Internal** เพื่อจำกัดผู้ใช้ภายใน Workspace
3. สร้าง OAuth Client ID ชนิด **Web application**
4. เพิ่ม Authorized JavaScript origins:
   - `http://localhost:5173` สำหรับทดสอบ
   - `https://ORGANIZATION.github.io`
   - ชื่อโดเมน Frontend ของโรงเรียน ถ้ามี เช่น `https://governance.psuwit.ac.th`
5. คัดลอก Client ID เพื่อกำหนดเป็น `GOOGLE_CLIENT_ID` ที่ Vercel และ `VITE_GOOGLE_CLIENT_ID` ที่ GitHub

Backend ตรวจสอบลายมือชื่อ ID Token, `email_verified` และโดเมน `@psuwit.ac.th` ซ้ำอีกชั้นหนึ่ง

## 5. ตั้งค่า Google Shared Drive

1. เปิดใช้ Google Drive API ใน Cloud Project
2. สร้าง Service Account สำหรับระบบโดยเฉพาะ และดาวน์โหลด JSON key เพียงครั้งเดียว
3. เพิ่มอีเมล Service Account เป็นสมาชิก Shared Drive หรือแชร์โฟลเดอร์หลักให้ Service Account ด้วยสิทธิ์สร้างและแก้ไขไฟล์
4. สร้างโฟลเดอร์ เช่น `PSUWIT Digital Governance Evidence` แล้วคัดลอก Folder ID จาก URL
5. เก็บ JSON ทั้งก้อนไว้ในตัวแปร `GOOGLE_SERVICE_ACCOUNT_JSON` ของ Vercel และเก็บ Folder ID ใน `GOOGLE_DRIVE_FOLDER_ID`
6. หลังเข้าสู่ระบบด้วยผู้ดูแล สามารถกำหนด Folder ID ซ้ำในเมนู “ตั้งค่าระบบ” ได้

หลักฐานถูกอัปโหลดจากเบราว์เซอร์เข้าสู่ Drive ด้วย resumable upload session จึงไม่ติดข้อจำกัดขนาด request body ของ Vercel โดยระบบจำกัดไฟล์ไม่เกิน 50 MB ต่อไฟล์

## 6. เผยแพร่ Backend บน Vercel

1. เลือก Add New Project และ Import GitHub Repository
2. กำหนด Root Directory เป็น `backend`
3. Framework Preset เลือก Other; Vercel จะอ่าน `vercel.json`
4. กำหนด Node.js เป็น 22
5. เพิ่ม Environment Variables ต่อไปนี้ใน Production และ Preview ตามความจำเป็น

| ตัวแปร | ค่า |
|---|---|
| `NODE_ENV` | `production` |
| `ALLOWED_ORIGINS` | URL GitHub Pages และโดเมนจริง คั่นด้วยเครื่องหมายจุลภาค |
| `ALLOWED_GOOGLE_DOMAIN` | `psuwit.ac.th` |
| `GOOGLE_CLIENT_ID` | Client ID จากข้อ 4 |
| `INITIAL_ADMIN_EMAIL` | อีเมลผู้ดูแลระบบคนแรก |
| `JWT_SECRET` | สุ่มอย่างน้อย 48 ตัวอักษร |
| `DATABASE_URL` | TiDB connection string |
| `TIDB_CA_BASE64` | กำหนดเมื่อ TiDB ระบุให้ใช้ CA |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | JSON key ทั้งก้อน บรรทัดเดียว |
| `GOOGLE_DRIVE_FOLDER_ID` | Folder ID จากข้อ 5 |
| `DEMO_MODE` | `false` |

6. Deploy แล้วตรวจ `https://YOUR-PROJECT.vercel.app/api/health` ต้องได้ `status: ok`

อีเมลใน `INITIAL_ADMIN_EMAIL` จะได้รับบทบาท `DIRECTOR` เมื่อเข้าสู่ระบบครั้งแรก จากนั้นให้ใช้เมนูตั้งค่ากำหนดสิทธิ์บุคลากรรายอื่น

## 7. เผยแพร่ Frontend บน GitHub Pages

1. ไปที่ Repository → Settings → Pages → Source และเลือก **GitHub Actions**
2. ไปที่ Settings → Secrets and variables → Actions → Variables แล้วเพิ่ม

| Variable | ตัวอย่าง |
|---|---|
| `VITE_API_URL` | `https://YOUR-PROJECT.vercel.app/api` |
| `VITE_GOOGLE_CLIENT_ID` | Client ID เดียวกับ Backend |

3. Push ไปยังสาขา `main` หรือสั่ง Run workflow “Deploy Frontend to GitHub Pages”
4. เปิด URL ที่ GitHub แสดงและทดสอบ Login

ระบบรองรับ Bearer session เป็นทางเลือกเพื่อให้ GitHub Pages ติดต่อ Vercel ได้แม้เบราว์เซอร์จำกัด third-party cookies หากโรงเรียนมีโดเมน ควรใช้ `governance.psuwit.ac.th` และ `api-governance.psuwit.ac.th` เพื่อให้ควบคุมชื่อบริการและนโยบายเบราว์เซอร์ได้ชัดเจน

## 8. ตรวจรับก่อนเปิดใช้

1. ตั้ง `DEMO_MODE=false` ทั้ง Frontend และ Backend
2. ตรวจว่าบัญชีนอก `@psuwit.ac.th` เข้าไม่ได้
3. สร้างคำขอ ทะเบียน ความเสี่ยง และเหตุการณ์ทดสอบอย่างละหนึ่งรายการ
4. อัปโหลดไฟล์ทดสอบและตรวจว่าไฟล์อยู่ใน Shared Drive
5. ดาวน์โหลดรายงาน CSV และตรวจภาษาไทย
6. ตรวจสิทธิ์ผู้ใช้งานทุกบทบาท
7. ทดสอบจากโทรศัพท์และคอมพิวเตอร์ของโรงเรียน
8. ลบข้อมูลทดสอบหรือสร้างฐานข้อมูล Production ใหม่ก่อนประกาศใช้

รายละเอียดการตรวจรับอยู่ใน `docs/UAT_CHECKLIST_TH.md`
