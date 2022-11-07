import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import Profile from 'App/Models/Profile'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'
export default class AuthController {
    public async login({ request, auth, response }: HttpContextContract) {
        const email = request.input('email')
        const password = request.input('password')
        try {
    
          const token = await auth.use('api').attempt(email, password)
          response.json(token)
    
        } catch (error) {
          return response.badRequest('invalid login')
        }    
      }   
      public async register({ request, response }: HttpContextContract) {
        let output = { message: '' };
        const inputs = request.all()
    
        const registerSchema = schema.create({
          email: schema.string({}, [rules.email(), rules.required()]),
          password: schema.string({}, [rules.minLength(8), rules.required()]),
          fullname: schema.string({}, [rules.minLength(4),rules.required()])
        })  
    
        try {
    
          const signUpInputs = await validator.validate({
            schema: registerSchema,
            data: {
              email: inputs.email,
              password: inputs.password,
              fullname: inputs.fullname,
            },
            messages: {
              'required': "The {{ field }} is requried!",
              'email.email': "Invalid email",
              'password.minLength': "Password must be greater than 7 characters",
              'fullname.minLength': "Name must be greater than 3 characters",
            }          
          })
          const createUser = await User.create({
            email: signUpInputs.email,
            password: signUpInputs.password,
            
            
          })
          if (createUser.$isPersisted) {
    
            const UserProfileSchema = await Profile.create({    
              user_id: createUser.id,
              fullname: inputs.fullname,
            })   

            if (UserProfileSchema.$isPersisted) {    
              response.json({ message: 'Profile is created' }) 
            }
    
          }
    
        } catch (error) {
          output.message = error.messages
          response.badRequest(output)
        }
      }
    
      public async sentCode({ }: HttpContextContract) { }
    
      public async verifyCode({ }: HttpContextContract) { }
    
      public async updatePassword({ request, response, auth }: HttpContextContract) {
        // we will send the output to the frontend as per condition
        let output = { message: "", status: false }
    
        // Get all inputs from frontend
        const inputs = request.all();
    
        // If confirm and password do not match then show error
        if (inputs.password !== inputs.confirm_password) {
          response.badRequest({ message: "Password and confirm password doesn't match!" })
          return false
        }
    
        try {
    
          // Check if user is logged in or not
          await auth.use("api").check();
    
          // Get User Information from Session
          const user = auth.use("api").user;
    
          // Get User complete information from database where id = user.id
          const getUser = await User.query().where("id", user?.id ?? 0).first()
    
          // If record not found then show something went wrong!
          if (!getUser) {
            output.message = "Something went wrong!"
            response.badRequest(output)
            return false;
          }
    
          // Verify encrypted password from database using hash.verify method
          if (!(await Hash.verify(getUser.password, inputs.password))) {
            output.message = "Invalid Credentials!";
            response.unauthorized(output)
          }
    
          // If everything went well then update the password
          const updateUser = await User.query().where("id", user?.id ?? 0).update({ password: inputs.password })
          if (updateUser) {
            output.status = true;
            output.message = "Password updated!"
            response.json(output)
          }
    
        } catch (error) {
          output.message = error.message
          response.badRequest(output)
          return false;
        }
      }

      public async logout({ response , auth}: HttpContextContract){ 
        let output = {message: "you are logged out"}
          await auth.use('api').logout()
          response.json(output)
      }    

      public async getuserinfo({auth ,response }:HttpContextContract){ 
      
       let output = {message :''}
       let data;

        try {

          // Check if user is logged in or not
          await auth.use("api").check();
          // Get User Information from Session
          const user = auth.use("api").user;
          data = await User.query().where("id", user?.id ?? 0).preload("myprofile").first()
          response.json({data})

      } catch (error) {
          output.message = error.message
          response.badRequest(output)
          return false;
      }
    }
    }
