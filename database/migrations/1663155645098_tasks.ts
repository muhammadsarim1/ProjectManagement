import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned().primary()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')    
      table.integer('section_id').unsigned().references('id').inTable('sections').onDelete('CASCADE')
      table.text('name')
      table.string('desc').nullable()
      table.dateTime('due_date').nullable()
      table.string('status').defaultTo(10).comment("10 = pending, 20 = completed")
      table.timestamps()
    })
  }
  
  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
