import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sections'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()
      table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('sections').onDelete('CASCADE')
      table.text('name')
      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
