

import Route from '@ioc:Adonis/Core/Route'



Route.group(() => {
  
Route.post("/login", 'AuthController.login')

Route.post("/register", 'AuthController.register')

}).middleware('IsLoggedIn')



Route.get("/logout", 'AuthController.logout').middleware('Authenticated')

Route.group(() => {

    
Route.resource("projects", 'ProjectsController').except(['create', 'edit'])

Route.resource("projects.sections", 'SectionsController').except(['create', 'edit'])

Route.resource("projects.sections.tasks",'TasksController').except(['create', 'edit'])

Route.post("/projects/users",'ProjectsController.addProjectUser')

Route.post("/tasks/users",'TasksController.addTaskUser')

Route.put("/tasks/:id",'TasksController.taskUpdate')

Route.get("/completed/tasks",'TasksController.Completedtask')

Route.get("/incompleted/tasks",'TasksController.InCompletedtask')

Route.post("/get/users","ProjectsController.getUsers")


Route.post("/get/projectusers","ProjectsController.getProjectUsers")

Route.resource("tasks.comments",'CommentsController')

Route.post("/get/tasksusers","TasksController.getTaskUsers")

Route.get("/get/userinfo","AuthController.getuserinfo")
}).middleware('Authenticated')
