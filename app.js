const express = require("express")
const app = express();
const path = require('path');

const userModel = require("./models/user");
const taskModel = require("./models/task");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.set("view-engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// app.get("/",(req,res)=>{
//     res.send("hello");
// });

// app.get("/Home",(req,res)=>{
//     res.render("Home.ejs")
// })
app.get("/",(req,res)=>{
    res.render("index.ejs");
})
app.get("/login",(req,res)=>{
    res.render("login.ejs");
})

app.post("/register", async(req,res)=>{
    let {email,password,username,name,age} = req.body;

    let user = await userModel.findOne({email});

    if(user) return res.status(500).send("User Already Registered");

     bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password, salt, async (err,hash)=>{
            await userModel.create({
                username,
                email,
                age,
                name,
                password: hash

            });

            // let token = jwt.sign({email: email},"shhhh");
            // // console.log(token);
            // res.cookie("token",token);
            // console.log("Registered");
            // res.send("User Registered");
            res.redirect("/login")
        });
     });

});

app.post("/login", async(req,res)=>{
    let {email,password} = req.body;

    let user = await userModel.findOne({email});

    if(!user) return res.status(500).send("Something went Wrong");

    bcrypt.compare(password, user.password,function(err,result){
        if(result){
            let token = jwt.sign({email: email,userid : user.__id},"shhhh",{
                expiresIn : 60 * 60,
            });
            // console.log(token);
            res.cookie("token",token);
            // res.status(200).send("You can Login");
            res.status(200).redirect("/All_Tasks");
            
        } 
        else res.redirect("/login");
    });
});

app.get("/All_Tasks",isLoggedIn, async(req,res)=>{
    // console.log(req.user.email);
    let user = await userModel.findOne({email: req.user.email}).populate("tasks");
    // user.populate("posts");
    // console.log(user);
    res.render("All_Tasks.ejs",{user});

});

app.post("/post",isLoggedIn, async(req,res)=>{
    // console.log(req.user.email);
    let user = await userModel.findOne({email: req.user.email});
    // console.log(user._id);

    let {title,content} = req.body;
    // console.log(content)

    let task = await taskModel.create({
        user: user._id,
        title: title,
        content: content
        
    });
    
    // console.log(user.__id);
    user.tasks.push(task._id);
    await user.save();

    res.redirect("/All_Tasks");
    
});

app.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.redirect("/login");
});


// app.get("/All_Tasks",(req,res) =>{
//     res.render("All_Tasks.ejs");
// })

app.get("/Important_Tasks",(req,res) =>{
    res.render("Important_Tasks.ejs");
})

app.get("/Completed_Tasks",(req,res) =>{
    res.render("Completed_Tasks.ejs");
})

app.get("/InCompleted_Tasks",(req,res) =>{
    res.render("InCompleted_Tasks.ejs");
})

app.get("/Add_Task",(req,res)=>{
    res.render("Add_Task.ejs");
})

app.get("/signup",(req,res)=>{
    res.render("signup.ejs")
    
})

// MiddleWare
function isLoggedIn(req,res,next){
    if(req.cookies.token === '') res.redirect("/login")
    // if(req.cookies.token === "") res.send("You must Logged In");

    else{
        let data = jwt.verify(req.cookies.token,"shhhh");
        req.user = data;
        next();   
    }
    
}


app.listen(2000);
