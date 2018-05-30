const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");
const path = require('path');

const app = express();


// mongoose.connect('mongodb://localhost/restful_blog_app');
mongoose.connect('mongodb://satish:satish@ds135750.mlab.com:35750/blogpost')





app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname) + '/public/'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Schema

const blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{ type:Date,default:Date.now }
});



const Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title:"Test Blog",
//     image:"https://images.unsplash.com/photo-1509653183608-c9bd54cc583b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=83061a131cc145d2c25d5f16d626f0e6&auto=format&fit=crop&w=1301&q=80",
//     body:"Hello, This is a blog post"
// }, (err, saved) => {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log("Success");
//     }
// });

// RESTFULL routes 
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

//index route
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err) {
            console.log(err);
        } else {
            res.render('index',{blogs:blogs});
        }
    })
});
// new 

app.get('/blogs/new', (req, res) => {
   res.render('new'); 
});

// create 
app.post('/blogs',(req, res) => {
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err) {
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    });
});

app.get('/blogs/:id', (req,res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render('show', {blog:foundBlog});
        }
    })
});

app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog:foundBlog});
        }
    })
})

//update 

app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err, updatedBlog) => {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    })
})

//delete

app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id,(err) => {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    })
});

app.listen(process.env.PORT, process.env.IP, (err) => {
    if(err) {
        throw err;
    } else {
        console.log('BlogPost Server  is up and running');
    }
});
