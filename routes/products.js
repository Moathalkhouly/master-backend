const {Product} = require('../models/product')
const { Category } = require('../models/category');
const express = require('express')
const router = express.Router();
const mongoose=require('mongoose');


router.get(`/`, async (req, res) => {

    let filter ={}
    if(req.query.categories)
    {
        filter ={ category:req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).populate('category');

    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList)
})

router.get("/:id", async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send(product)
})


router.post(`/`, async (req, res) => {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category')

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    product = await product.save();

    if (!product)
        return res.status(500).send('the product cannot be created')

    res.send(product)
})


router.patch('/:id', async (req, res) => {

    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid product Id')
    }

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        },
        { new: true }
    )
    if (!product)
        return res.status(500).send('Product could not be updated')
    res.status(200).send(product);
})


router.delete('/:id',(req,res)=>{
    Product.findByIdAndRemove(req.params.id)
    .then(product=>{
        if(product){
            return res.status(200).json({sucess:true , message :"the product is deleted"})
        }
        else{
            return res.status(400).json({sucess:false , message :"product not found"})
        }
    })
    .catch(err=>{
        return res.status(500).json({success:false, error:err})
    })
})

//Number of products I have
router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments()
    if (!productCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        productCount :productCount
    })
})

//feautered products
router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({isFeatured:true}).limit(+count);
    if (!products) {
        res.status(500).json({ success: false })
    }
    res.send(products)
})


module.exports=router