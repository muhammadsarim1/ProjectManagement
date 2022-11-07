import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import Project from 'App/Models/Project';
import Section from 'App/Models/Section'

export default class SectionsController {

  public async index(ctx:HttpContextContract){
    let inputs = ctx.params;
    
    
    let query = await Project.query().where("id", inputs.project_id).preload("sections", function(query){
      query.preload("tasks", function(query){
        query.preload("myuser", function(qr){
          qr.preload("myprofile")
        })
      }).preload("myuser")
    })
    ctx.response.json({data:query})
  }

  public async store({request,response , params}: HttpContextContract) {
    let output = {message : ""}
    const input = request.all()

    //to take input fom user

    const SectionSchema = schema.create({
        name:schema.string({}, [rules.required()]),
        project_id:schema.number()
    })

    try {
        const SectionInput = await validator.validate({
            schema:SectionSchema,
            data: {
                name:input.name,
                project_id:params.project_id
            },
            messages: {
                'required': "The {{ field }} is requried!",
            }
        })
        const createSection = await Section.create(SectionInput)
        if (createSection.$isPersisted) {
            response.json({ message: 'Section is registered' })
        } 
    }catch (error) {
        output.message = error
        response.badRequest(output)
        return false  
    }
 
  }
  public async update({request, response, params}: HttpContextContract) {
    const section = await Section.findOrFail(params.id)
       section.name = request.input('name')
        await section.save();
        return response.json(section)
  }

  public async destroy({params}: HttpContextContract) {
    const section = await Section.findOrFail(params.id)
    await section.delete()
  }
}
