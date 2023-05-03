import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import mongoose from "mongoose"
import blogRouter from "./routes/blog-routes.js";
import router from "./routes/user-routes.js";
import cors from "cors";
import path from 'path';
const __dirname = path.resolve();




const PORT = process.env.PORT ;
// const uri = process.env.MONGODB_URI;




const app = express();
app.use(cors());
app.use(express.json());
app.use( "/user",router)
app.use("/blog" , blogRouter)

//   : step heroku


app.use(express.static(path.join(__dirname, "./frontend/build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./frontend/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});






mongoose.set("strictQuery", false);
mongoose
.connect(process.env.MONGODB_URI)
    .then(() => app.listen( PORT))
    .then(() => console.log("Connected to Database or listening to the port 5000"))
    .catch(function(err){ console.log(err)});

    


//middleware
// app.use("/api" , function(req , res , next){
//     res.send("Hello WOrld")
// });


// app.listen(5000)
// app.listen(3000 , function(req , res){
//     console.log("Server is running on port 3000");
// });





// password mongoDB Atlas Cluster =  admin123
