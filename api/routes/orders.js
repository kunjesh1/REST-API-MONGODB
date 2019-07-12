const express=require('express');
const router=express.Router();

//Handle incoming GET request for the orders
router.get("/",(req,res,next)=>{

    res.status(200).json({

        message:"Orders were fetched"
    });
});

//Handle incoming POST request for the orders

router.post("/",(req,res,next)=>{

    const order={

        productId:req.body.productId,
        quantity:req.body.quantity
    };

    res.status(201).json({

        message:"Order was created",
        order:order

    });
 });

 module.exports=router;