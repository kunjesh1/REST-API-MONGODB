const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../model/order');
const Product = require('../model/product');

//Handle incoming GET request for the orders
router.get("/", (req, res, next) => {

    Order.find()
        .select('product quantity _id')
        .exec()
        .then(docs => {
            res.status(201).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                }),

            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

});

//Handling Request for the particular Order ID

router.get("/:id",(req,res,next)=>{

    id=req.params.id;
    Order.findById(id)
           .exec()
           .then(order=>{

            if(!order){
               return res.status(404).json({
                    message:"Order not found"
                });
            }
            
            res.status(200).json({
                order:order,
                request:{
                    type:"GET",
                    url:"http://localhost:3000/orders"
                } 
            });
            }
           )
           .catch(err=>{
               res.status(500).json({
                   error:err
                });
           });


});

//Handle incoming POST request for the orders

router.post("/", (req, res, next) => {
    Product.findById(req.body.productId)
      .then(product => {
        if (!product) {
          return res.status(404).json({
            message: "Product not found"
          });
        }
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId
        });
        return order.save();
      })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Order stored",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + result._id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

  //DELETE the request for the particular ID

  router.delete("/:id",(req,res,next)=>{
      id=req.params.id;
      Order.deleteMany({_id:id})
      .exec()
      .then(orders=>{
          res.status(201).json({
               orders:orders,
               request:{
                   type:"DELETE",
                   url:"http://local-host:3000/id"
               }

          })
      }

      ).catch(err=>{
          res.status(500).json({
              error:err
          });
      })


  });

module.exports = router;