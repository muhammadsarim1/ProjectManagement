import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CommentAttachment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
   public comment_id: number

   @column()
   public attachment: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
