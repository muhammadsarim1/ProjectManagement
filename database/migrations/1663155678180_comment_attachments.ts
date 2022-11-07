import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'comment_attachments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()
      table.integer('comment_id').unsigned().references('id').inTable('comments').onDelete('CASCADE')
      table.text('attachment')
      table.timestamps()

    })
  }
  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
