import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Profile from './Profile'


export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
   public section_id: number
  
   @column()
   public user_id: number

   @column()
   public name: string

   @column()
   public desc: string

   @column()
   public due_date: string

   @column()
   public status: number

   @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

   @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

    
  @belongsTo(() => User, {
    foreignKey: 'user_id',  
    localKey: 'id',
  })
  public myuser: BelongsTo<typeof User>

  @belongsTo(() => Profile, {
    foreignKey: 'user_id',  
    localKey: 'id',
  })
  public myprofile: BelongsTo<typeof Profile>

  @belongsTo(() => Task, {
    foreignKey: 'user_id',  
    localKey: 'id',
  })
  public Task: BelongsTo<typeof Task>
}
