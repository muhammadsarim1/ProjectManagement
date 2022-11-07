import { DateTime } from 'luxon'
import { BaseModel , BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Task from './Task'
import TaskUser from './TaskUser'



export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column()
   public user_id: number
   
   @column()
   public fullname: string
   
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Task, {

    foreignKey: 'user_id',

    localKey: 'id',

  })
 public myprofile: HasOne<typeof Task> // profile

 @belongsTo(() => TaskUser, {
  foreignKey: 'user_id',  
  localKey: 'id',
})
public myuser: BelongsTo<typeof TaskUser>


}


