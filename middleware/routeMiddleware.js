export default function(context){
   context.app.router.beforeEach((to,from,next)=>{
       next()
   })
}