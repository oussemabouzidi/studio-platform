-- Studio ↔ artist messaging (numeric studio_id / artist_id from the Express booking API)

CREATE TABLE `studio_chat_threads` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studio_id` INTEGER NOT NULL,
    `artist_id` INTEGER NOT NULL,
    `preview` VARCHAR(512) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `uq_studio_chat_thread_studio_artist`(`studio_id`, `artist_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `studio_chat_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `thread_id` INTEGER NOT NULL,
    `sender` VARCHAR(16) NOT NULL,
    `body` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    INDEX `idx_studio_chat_msg_thread_created`(`thread_id`, `created_at`),
    CONSTRAINT `studio_chat_messages_thread_id_fkey` FOREIGN KEY (`thread_id`) REFERENCES `studio_chat_threads`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
