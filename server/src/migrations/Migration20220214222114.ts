import { Migration } from '@mikro-orm/migrations';

export class Migration20220214222114 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" drop constraint if exists "post_created_at_check";');
    this.addSql('alter table "post" alter column "created_at" drop default;');
    this.addSql('alter table "post" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "post" drop constraint if exists "post_updated_at_check";');
    this.addSql('alter table "post" alter column "updated_at" drop default;');
    this.addSql('alter table "post" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" drop constraint if exists "post_created_at_check";');
    this.addSql('alter table "post" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "post" alter column "created_at" set default \'NOW()\';');
    this.addSql('alter table "post" drop constraint if exists "post_updated_at_check";');
    this.addSql('alter table "post" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');
    this.addSql('alter table "post" alter column "updated_at" set default \'NOW()\';');
  }

}
