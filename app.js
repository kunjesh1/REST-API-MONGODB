const express=require('express');
const app=express();
const morgan=require('morgan');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const multer=require('multer'); //for multipart of the body parser
const upload=multer();


const productRoutes=require('./api/routes/products');

const orderRoutes=require('./api/routes/orders');

mongoose.connect("mongodb://localhost/node-rest",
{ useNewUrlParser: true }).then((res)=>{ console.log("Connected to database successfully");}).catch(err=>{
    console.log("Connection with database failed");
});


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); 
app.use(upload.array());// middleware for handling the multipart of bodyparser

app.use((req,res,next)=>{

    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');

    if(req.method==='OPTIONS'){

        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});

    }
    next();

});


//Routes should handle request
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

app.use((req,res,next)=>{

    const error=new Error('Not found');
    error.status=404;
    next(error);
});

app.use((error,req,res,next)=>{

    res.status(error.status||500);

    res.json({

        error:{
            message:error.message
        }
    })
});

mongoose.Promise=global.Promise;
module.exports=app;