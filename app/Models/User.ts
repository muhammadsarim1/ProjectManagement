import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, hasOne, HasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Project from './Project'
import Profile from './Profile'
import TaskUser from './TaskUser'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
      if (user.$dirty.password) {
        user.password = await Hash.make(user.password)
      }
  }

  @manyToMany(() => Project, {
    pivotTable: 'project_users',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    localKey: 'id', // defaults to id
  })
  public projects: ManyToMany<typeof Project>

  @hasOne(() => Profile, {

    foreignKey: 'user_id',

    localKey: 'id',

  })
 public myprofile: HasOne<typeof Profile> // profile
 
  @hasOne(() => TaskUser, {

    foreignKey: 'users_id',

    localKey: 'id',

  })
  
 public mytaskuser: HasOne<typeof TaskUser> // profile
  
}
