import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator } from '@ioc:Adonis/Core/Validator'
import Comment from 'App/Models/Comment'
import Application from '@ioc:Adonis/Core/Application'

export default class CommentsController {


  public async create({ }: HttpContextContract) { }

  public async index(ctx: HttpContextContract) {
    let inputs = ctx.params

    const comments = await Comment.query().where("task_id", inputs.task_id).preload("myuser").preload("myprofile")
    
    ctx.response.json({comments:comments})
    
    return false
   }

  public async store({ request, auth, params ,response }: HttpContextContract) {

    let output = { message: "" }
    const input = request.all()

    const addCommentSchema = schema.create({
      user_id: schema.number(),
      task_id: schema.number(),
      message: schema.string()
    })
    try {
      await auth.use('api').check()
      const user = auth.use('api').user
      const addcommentInput = await validator.validate({
        schema: addCommentSchema,
        data: {
          user_id: user?.id,
          task_id: params.task_id,
          message: input.message
        },
        messages: {
          'required': "The {{ field }} is requried!",
        }
      })
      const createComment = await Comment.create(addcommentInput)
      if (createComment.$isPersisted) {
        response.json({ message: 'your message is sent' })
      }
    } catch (error) {
      output.message = error;
      response.badRequest(output)
      return false
    }

  }
  public async attachFile({ request }: HttpContextContract) {
    
    const coverImageSchema = request.file('cover_images')

    if (coverImageSchema) {
      await coverImageSchema.move(Application.tmpPath('uploads'))
    }
  }

}
