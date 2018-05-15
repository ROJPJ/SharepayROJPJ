CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "public"."user" (
   "id" uuid DEFAULT gen_random_uuid() NOT NULL,
   "name" varchar,
   "email" varchar,
   PRIMARY KEY ("id")
);

CREATE TABLE "event" (
   "id" uuid DEFAULT gen_random_uuid() NOT NULL,
   "label" varchar,
   "description" text,
   "date" date,
   "currency" varchar,
   "status_id" bpchar(1),
   "user_id" uuid not null,
   CONSTRAINT "event_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id"),
   PRIMARY KEY ("id")
);

CREATE TABLE "event_user" (
   "event_id" uuid,
   "user_id" uuid not null,
   CONSTRAINT "event_user_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id"),
   CONSTRAINT "event_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id"),
   PRIMARY KEY ("event_id","user_id")
);

CREATE TABLE "expense" (
   "id" uuid DEFAULT gen_random_uuid() NOT NULL,
   "label" varchar,
   "event_id" uuid not null,
   "amount" int4,
   "date" date,
   "user_id" uuid not null,
   CONSTRAINT "expense_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id"),
   CONSTRAINT "expense_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id"),
   PRIMARY KEY ("id")
);

CREATE TABLE "public"."expense_user" (
   "expense_id" uuid,
   "user_id" uuid,
   CONSTRAINT "expense_user_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "public"."expense"("id"),
   CONSTRAINT "expense_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id"),
   PRIMARY KEY ("expense_id","user_id")
);
