ALTER TABLE `folder`
    MODIFY COLUMN `index` double(16, 8) NULL DEFAULT NULL AFTER `parent_id`;