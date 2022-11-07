import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column,  } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Profile from './Profile'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
   public user_id: number
   
   @column()
   public message: string
   
   @column()
   public task_id: number

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
}
