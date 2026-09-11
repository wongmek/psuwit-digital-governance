INSERT INTO settings (key_name,value_text,updated_at) VALUES
('schoolName','โรงเรียน มอ.วิทยานุสรณ์',NOW()),
('allowedDomain','psuwit.ac.th',NOW()),
('driveFolderId','',NOW()),
('incidentEmail','security@psuwit.ac.th',NOW()),
('reviewReminderDays','30',NOW())
ON DUPLICATE KEY UPDATE key_name=VALUES(key_name);
