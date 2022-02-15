import { Migration } from '@mikro-orm/migrations';

export class Migration20220214221731 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null default \'NOW()\', "updated_at" timestamptz(0) not null default \'NOW()\', "title" text not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "post" cascade;');
  }

}
