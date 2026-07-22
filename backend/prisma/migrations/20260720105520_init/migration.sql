-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'member');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('offline', 'online');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'offline',
    "public_key" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Room" (
    "room_id" TEXT NOT NULL,
    "room_name" TEXT NOT NULL,
    "room_password" TEXT NOT NULL,
    "max_capacity" INTEGER NOT NULL DEFAULT 10,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "admin_socket_id" TEXT,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("room_id")
);

-- CreateTable
CREATE TABLE "Task" (
    "task_id" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "description" TEXT,
    "room_id" TEXT NOT NULL,
    "assigned_to" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "deadline" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("task_id")
);

-- CreateTable
CREATE TABLE "room_members" (
    "room_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'member',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "room_members_pkey" PRIMARY KEY ("room_id","user_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "message_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "vector_clock" JSONB NOT NULL,
    "iv" TEXT,
    "sent_by" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "sent_to" TEXT,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "avatar" (
    "avatar_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "x_axis" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "y_axis" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "direction" TEXT NOT NULL DEFAULT 'down',
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avatar_pkey" PRIMARY KEY ("created_by")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Task_task_id_key" ON "Task"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "avatar_created_by_room_id_key" ON "avatar"("created_by", "room_id");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_members" ADD CONSTRAINT "room_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sent_by_fkey" FOREIGN KEY ("sent_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sent_to_fkey" FOREIGN KEY ("sent_to") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avatar" ADD CONSTRAINT "avatar_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avatar" ADD CONSTRAINT "avatar_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;
