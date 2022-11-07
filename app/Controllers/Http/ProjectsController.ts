import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import Project from 'App/Models/Project'
import ProjectUser from 'App/Models/ProjectUser'
import User from 'App/Models/User'



export default class ProjectsController {
    public async index({auth, response}: HttpContextContract) {
        let output = {message:null, status:false}
        let data;
        
        try {

            // Check if user is logged in or not
            await auth.use("api").check();
            // Get User Information from Session
            const user = auth.use("api").user;
            data = await User.query().where("id", user?.id ?? 0).preload("projects");
            response.json({data})

        } catch (error) {
            output.message = error.message
            response.badRequest(output)
            return false;
        }
     }

    public async store({ request, response, auth }: HttpContextContract) {
        let output = { message: "" }
        const input = request.all()

        //to take input from user
        const ProjectSchema = schema.create({
            name: schema.string({}, [rules.required()]),
            privacy: schema.number([rules.nullable()])
        })

        try {

            // Check if user is logged in or not
            await auth.use("api").check();
            // Get User Information from Session
            const user = auth.use("api").user;

            const projectInput = await validator.validate({
                schema: ProjectSchema,
                data: {
                    name: input.name,
                    privacy: input.privacy
                },
                messages: {
                    'required': "The {{ field }} is requried!",
                }
            })
            const createProject = await Project.create(projectInput)
            if (createProject.$isPersisted) {
                await ProjectUser.create({
                    user_id: user?.id ?? 0,
                    project_id: createProject.id,
                })
                response.json({ message: 'Project Created!' })
            }
            

        } catch (error) {
            output.message = error.message
            response.badRequest(output)
            return false;
        }
    }

    public async update({ request, response, params }: HttpContextContract) {
        const project = await Project.findOrFail(params.id)
        project.name = request.input('name')
        project.privacy = request.input('privacy')
        await project.save();
        return response.json(project)
    }

    public async destroy({ params }: HttpContextContract) {
        const project = await Project.findOrFail(params.id)
        await project.delete()
    }

    public async addProjectUser({ request, response }: HttpContextContract) {
        let output = { message: "" }
        const input = request.all()

        //to take input fom user

        const AddProjectUserSchema = schema.create({
            user_id: schema.number(),
            project_id: schema.number()
        })

        try {
            const projectuserInput = await validator.validate({
                schema: AddProjectUserSchema,
                data: {
                      user_id: input.user_id,
                    project_id: input.project_id
                },
                messages: {
                    'required': "The {{ field }} is requried!",
                }
            })
            const createProjectUser = await ProjectUser.create(projectuserInput)
            if (createProjectUser.$isPersisted) {
                response.json({ message: 'ProjectUser is registered' })
            }
        } catch (error) {
            output.message = error
            response.badRequest(error.message)
            return false
        }
    }

    public async getUsers(ctx:HttpContextContract){

        let output = { status: false, message: '' }
    
    
    
        // Check and get the current user
    
        try{
    
          await ctx.auth.use('api').check()
    
          const current_user = ctx.auth.use('api').user
    
    
    
          let getInputs = ctx.request.all();
    
          let search = getInputs.query ?? '';
    
          let users;
    

          users = await User.query().where("id","!=", current_user?.id ?? 0).where("email","like","%"+search+"%").orWhereHas("myprofile", (query2)=>{
    
            query2.orWhere("fullname","like","%"+search+"%")
    
          })
    
          ctx.response.json(users)
    
        } catch (error) {
    
          output.message = error.message
    
          ctx.response.badRequest(output)
    
          return false
    
        }
    
      }  
      
      public async  getProjectUsers(ctx:HttpContextContract) {
        

         let output = { status: false, message: '' }
        let query;
    
    
        // Check and get the current user
    
        try{
    
          await ctx.auth.use('api').check()
                  
          let getInputs = ctx.request.all();
    
          let search = getInputs.search ?? '';
    
         

          query = await ProjectUser.query().where("project_id", getInputs.project_id).whereHas("myuser", (query)=>{

                query.where("email", "like", "%"+search+"%").orWhereHas("myprofile", (query2)=>{
                
                            query2.orWhere("fullname","like","%"+search+"%")
                
                })
            }).preload("myuser", (query2)=>{
            query2.preload("myprofile")
          })
           console.log(query);
          ctx.response.json(query)
    
        } catch (error) {
    
          output.message = error.message
    
          ctx.response.badRequest(output)
 
          return false
    
        }
    
      }  
    
    }    


