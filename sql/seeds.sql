INSERT INTO "public"."user" ("id", "name", "mail", "mp") VALUES ('059bd697-3d1b-4c61-b9fa-76a249bd519e', 'Julian', 'julianboes@decathlon.com', 'test'),
('3b21268e-8e00-4ca3-91ea-0cac02bd4cf0', 'Olivier', 'olivier.masurel@decathlon.com', 'test'),
('661a1ebe-ad31-4c35-8520-af24e26c8a57', 'Remi', 'remi.deliance@decathlon.com', 'test'),
('e49ded9b-b08d-4e9e-a8ba-6b77504dc9d9', 'Jean Philippe', 'jeanphilippe.bornier@decathlon.com', 'test');

INSERT INTO "public"."event" ("id", "label", "description", "date", "currency", "status_id", "user_id") VALUES ('440e057d-f0ab-4da6-bb64-00b55895cd31', 'Dégustation Lille', 'Bières', '2018-05-14', NULL, 'A', 'e49ded9b-b08d-4e9e-a8ba-6b77504dc9d9'),
('c08f74b1-5246-4b76-a153-c7f0a4e1f2e2', 'TMB', 'Tour du Mt Blanc', '2018-05-14', NULL, 'A', 'e49ded9b-b08d-4e9e-a8ba-6b77504dc9d9');


INSERT INTO "public"."event_user" ("event_id", "user_id") VALUES ('440e057d-f0ab-4da6-bb64-00b55895cd31', '661a1ebe-ad31-4c35-8520-af24e26c8a57'),
('440e057d-f0ab-4da6-bb64-00b55895cd31', 'e49ded9b-b08d-4e9e-a8ba-6b77504dc9d9'),
('c08f74b1-5246-4b76-a153-c7f0a4e1f2e2', '3b21268e-8e00-4ca3-91ea-0cac02bd4cf0');


INSERT INTO "public"."expense" ("id", "label", "event_id", "amount", "date", "user_id") VALUES ('a07fc862-82af-4dad-b275-74eeacd5c0e3', 'Taxi pour rentrer', '440e057d-f0ab-4da6-bb64-00b55895cd31', NULL, NULL, 'e49ded9b-b08d-4e9e-a8ba-6b77504dc9d9'),
('c72c4df5-6b7e-4d8f-9e12-e9b3e9a97be1', 'Refuge Elisabetta', 'c08f74b1-5246-4b76-a153-c7f0a4e1f2e2', '5000', '2018-05-14', '3b21268e-8e00-4ca3-91ea-0cac02bd4cf0');


INSERT INTO "public"."expense_user" ("expense_id", "user_id") VALUES ('a07fc862-82af-4dad-b275-74eeacd5c0e3', 'e49ded9b-b08d-4e9e-a8ba-6b77504dc9d9'),
('c72c4df5-6b7e-4d8f-9e12-e9b3e9a97be1', '3b21268e-8e00-4ca3-91ea-0cac02bd4cf0');
