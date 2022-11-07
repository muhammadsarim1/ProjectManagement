import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Section from './Section'
import User from './User'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
   public name: string
    
   @column()
   public privacy: number  

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Section, {
    localKey: 'id',
    foreignKey: 'project_id', // defaults to userId
  })
  public sections: HasMany<typeof Section>

  @belongsTo(() => User, {
    foreignKey: 'user_id',  
    localKey: 'id',
  })
  public myuser: BelongsTo<typeof User>
}
