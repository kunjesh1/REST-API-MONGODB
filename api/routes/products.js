const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../model/product');

router.get('/', (req, res, next) => {

    Product.find().select("name price _id").exec().then(docs => {

        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    id: doc._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + doc.id
                    }
                };


            })


        };

        res.status(200).json(response);

    }).catch(err => {

        console.log(err);
        res.status(500).json({

            error: err
        });
    });



});


router.post("/", (req, res, next) => {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price
    });
    product
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Created product successfully",
          createdProduct: {
              name: result.name,
              price: result.price,
              _id: result._id,
              request: {
                  type: 'GET',
                  url: "http://localhost:3000/products/" + result._id
              }
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

router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).select("name price _id")
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});


//PATCH the products for the particular ID
router.patch("/:productId", (req, res, next) => {

    const id = req.params.productId;
    const updateOps = {};
    const Object_to_array = Object.keys(req.body).map(i => [i, req.body[i]]);


    for (const ops of Object_to_array) {
        //console.log(ops);
        updateOps[ops[0]] = ops[1];
    }
    console.log(id);
    console.log(updateOps);

    Product.findOneAndUpdate(id, {
        $set: updateOps
    }, { new: true })
        .exec()
        .then(result => {

            res.status(200).json(result);


        }
        ).catch(err => console.log(err));


});

router.delete("/:productId", (req, res, next) => {

    const id = req.params.productId;

    Product.deleteMany({ _id: id })
        .exec()
        .then(result => {

            res.status(200).json(result);
        })
        .catch(err => console.log(err));


});

module.exports = router;