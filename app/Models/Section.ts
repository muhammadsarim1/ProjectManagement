import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Task from './Task'
import User from './User'

export default class Section extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
   public project_id: number

   @column()
   public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Task, {
    localKey: 'id',
    foreignKey: 'section_id', // defaults to userId
  })
  public tasks: HasMany<typeof Task>

  @belongsTo(() => User, {
    foreignKey: 'user_id',  
    localKey: 'id',
  })
  public myuser: BelongsTo<typeof User>
}
