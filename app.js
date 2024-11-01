require('dotenv').config();
const express = require('express');
const mongoose=require('mongoose');
mongoose.connect(process.env.DATABASE_URL);
const userModel = require('./model/user');
const postModel = require('./model/post');
const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const multiconfig=require('./config/multerconfig');
const upload = require('./config/multerconfig');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")))


app.get('/', (req, res) => {
    res.redirect("/profile");
});
app.get('/new', (req, res) => {
    res.render("index");
});

app.get('/profile/upload', (req, res) => {
    res.render("profileupload");
});

app.post('/upload',isLoggedIn, upload.single("image"),async(req, res) => {
    let user=await userModel.findOne({email:req.user.email});
    user.profilepic= req.file.filename;
    await user.save();
    res.redirect("/profile");
});

app.post('/create', async (req, res) => {
    let { name, username, email, age, password } = req.body;

    if (age > 18) {
        let user = await userModel.findOne({ username });
        if (user) {
            res.status(500).send("User Already Exists");
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                    const newUser = await userModel.create({
                        username,
                        email,
                        name,
                        age,
                        password: hash
                    });
                    let token = jwt.sign({ email: email, userid: newUser._id }, "priyu");
                    res.cookie("token", token);
                    res.redirect("/profile")
                });
            });
        }
    } else {
        res.send("Error:404");
    }
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                let token = jwt.sign({ email: email, userid: user._id }, "priyu");
                res.cookie("token", token);
                res.redirect("/profile");
            } else {
                res.redirect('/login');
            }
        });
    } else {
        res.status(500).send("User Not Exists \n Click Below");
    }
});

app.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.redirect('/login');
});

app.get("/profile", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    res.render("profile", { user });
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate("user");
    
    if (post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid);
    } else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }

    await post.save();
    res.redirect("/profile");
});

app.get("/edit/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate("user");

    res.render("edit",{post});
});

app.post("/update/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOneAndUpdate({ _id: req.params.id },{content:req.body.content});
    res.redirect("/profile");
});



function isLoggedIn(req, res, next) {
    if (!req.cookies.token) {
        res.redirect("/login");
    } else {
        let data = jwt.verify(req.cookies.token, "priyu");
        req.user = data;
        next();
    }
}

app.post('/post', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let { content } = req.body;
    let post = await postModel.create({
        user: user._id,
        content
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
});

const PORT = process.env.PORT || 3000;

// Log the port being used
console.log(`Server is running on port: ${PORT}`);

// Start the server and handle potential errors
app.listen(PORT, (err) => {
    if (err) {
        console.error("Error starting the server:", err);
        process.exit(1); // Exit the process if there's an error
    } else {
        console.log(`Server is listening on port ${PORT}`);
    }
});

