ALTER TABLE aurum_dev.core_tenant_settings
ADD smtp_host varchar(255) default NULL;

ALTER TABLE aurum_dev.core_tenant_settings
ADD smtp_port int default NULL;

ALTER TABLE aurum_dev.core_tenant_settings
ADD smtp_user varchar(255) default NULL;

ALTER TABLE aurum_dev.core_tenant_settings
ADD smtp_password varchar(255) default NULL;

ALTER TABLE aurum_dev.core_tenant_settings
ADD smtp_email varchar(255) default NULL;

ALTER TABLE aurum_dev.core_tenant_settings
ADD is_smtp_enabled tinyint(1) default NULL;

ALTER TABLE aurum_dev.core_tenant_settings
ADD is_school_esc_enabled tinyint(1) default NULL;


ALTER TABLE aurum_dev.core_tenant_settings
ADD is_administrative_esc_enabled tinyint(1) default NULL;

ALTER TABLE aurum_dev.core_tenant_settings
ADD is_college_esc_enabled tinyint(1) default NULL;

ALTER TABLE aurum_dev.core_tenant_settings
ADD is_users_enabled tinyint(1) default NULL;