import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import Task from 'App/Models/Task'
import TaskUser from 'App/Models/TaskUser'




export default class TasksController {

    public async store({ request, response, params , auth }: HttpContextContract) {
        let output = { message: "" }
        const input = request.all()

        await auth.use('api').check()

         const user = auth.use('api').user
       
        
        //to take input fom user

        const TaskSchema = schema.create({
            name: schema.string({}, [rules.required()]),
            desc: schema.string({}, [rules.required()]),
            due_date: schema.string({}, [rules.required()]),
            section_id: schema.number(),
            user_id: schema.number()
        })

        try {
            const taskInput = await validator.validate({
                schema: TaskSchema,
                data: {
                    name: input.name,
                    desc: input.desc,
                    section_id: params.section_id,
                    due_date: input.due_date,
                    user_id: user?.id ?? 0
                },
                messages: {
                    'required': "The {{ field }} is requried!",
                }
            })
            const createTask = await Task.create(taskInput)           
            if (createTask.$isPersisted) {
                const taskcreator = await Task.query().where("id",createTask.id).preload("myuser", function(rq){
                    rq.preload("myprofile");
                }).first();
                response.json({ message: 'Task is registered', taskcreator:taskcreator })
            }
        } catch (error) {
            output.message = error
            response.badRequest(error.message)
            return false
        }
    }


    public async update({ request, response, params }: HttpContextContract) {
        const task = await Task.findOrFail(params.id)
        task.name = request.input('name')
        task.desc = request.input('desc')
        task.due_date = request.input('due_date')
        await task.save();
        return response.json(task)
    }

    public async destroy({ params }: HttpContextContract) {
        const task = await Task.findOrFail(params.id)
        await task.delete()
    }
        public async addTaskUser({ request, response }: HttpContextContract) {
        let output = { message: "" }
        const input = request.all()

        //to take input fom user

        const addTaskSchema = schema.create({
            user_id: schema.number(),
            task_id: schema.number()
        })

        try {
            const addtaskInput = await validator.validate({
                schema: addTaskSchema,
                data: {
                    user_id: input.user_id,
                    task_id: input.task_id
                },
                messages: {
                    'required': "The {{ field }} is requried!",
                }
            })
            const createTaskUser = await TaskUser.create(addtaskInput)
            if (createTaskUser.$isPersisted) {
                response.json({ message: 'Task is registered' })
            }
        } catch (error) {
            output.message = error
            response.badRequest(error.message)
            return false
        }
    }

    public async getTaskUsers(ctx :HttpContextContract){
        let inputs = ctx.request.all();

            

        const tasks = await TaskUser.query().where("task_id", inputs.task_id).preload("myuser")
        console.log(tasks)
        ctx.response.json({tasks:tasks})
        
        return false


    }

    public async taskUpdate({ params, response }: HttpContextContract) {
        const taskUpdate = await Task.findOrFail(params.id)
        taskUpdate.status == 20?taskUpdate.status=10 : taskUpdate.status=20;
        await taskUpdate.save();
        return response.json(taskUpdate)
    }

    public async Completedtask(ctx: HttpContextContract) {       
        let output = {message:''}
        await ctx.auth.use('api').check()
            
        const Users =  ctx.auth.use('api').user?.id
        
        try {
           
          const data = await Task.query().where('user_id',`${Users}`).where("status", 20)
            ctx.response.json({data})

        } catch (error) {
            output.message = error.message
            ctx.response.badRequest(output)
            return false;
        }
    }


    public async InCompletedtask(ctx: HttpContextContract) {       
        let inputs = ctx.request.all();
        let output = {message:''}

        await ctx.auth.use('api').check()
            
        const Users =  ctx.auth.use('api').user?.id
        
    
        try {
           
            const data = await Task.query().where('user_id',`${Users}`).where("status", 10);
            ctx.response.json({data})

        } catch (error) {
            output.message = error.message
            ctx.response.badRequest(output)
            return false;
        }
    }
}
