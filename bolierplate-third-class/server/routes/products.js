const express = require('express');
const multer = require('multer');

const { Product } = require('../models/Product');

const router = express.Router();

//=================================
//             Products
//=================================


/* 이미지를 저장하기 위해 multer 모듈을 사용함
   저장소의 destination(경로)과 filename 옵션을 설정
   
   .single(fieldname)
    fieldname 인자에 명시된 이름의 단수 파일을 전달 받습니다. 이 파일은 req.file 에 저장될 것 입니다.

    -> 그래서 나중에 성공 후에 response 보낼 때 res.req.file.filename, res.req.file.path로 저장
    
*/
var storage = multer.diskStorage({
    // 어디에 파일이 저장되는지
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
   
var upload = multer({ storage: storage }).single("file")

router.post('/image', (req, res) => {
    
    //가져온 이미지를 저장
    upload(req, res, err => {
        if(err) return req.json({ success : false, err })
        return res.json({
            success : true, 
            filePath: res.req.file.path, 
            fileName: res.req.file.filename
        })
    })
})

router.post('/products', (req, res) => {
    // DB에 저장된 모든 정보를 가져오기

    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let term = req.body.searchTerm ;

    let findArgs = {};
    
    for(let key in req.body.filters){
        if(req.body.filters[key].length > 0){
            if(key === "price"){
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    // Greater than equal
                    $lte: req.body.filters[key][1]
                    // Less than equal
                }
            } else {
                findArgs[key] = req.body.filters[key]
            }            
        }
    }

    if (term) {
        Product.find(findArgs)
        .find({$text: {$search: term}})
        .populate("writer")
        .skip(skip)
        .limit(limit)
        .exec((err, productsInfo) => {
            if(err) return res.status(400).json({success: false, err})

            return res.status(200)
                    .json({success : true, 
                            productsInfo, 
                            postSize: productsInfo.length
                            })
        })
    } else {

        Product.find(findArgs)
        .populate("writer")
        .skip(skip)
        .limit(limit)
        .exec((err, productsInfo) => {
            if(err) return res.status(400).json({success: false, err})

            return res.status(200)
                    .json({success : true, 
                            productsInfo, 
                            postSize: productsInfo.length
                            })
        })
    }
})

router.post('/upload', (req, res) => {
    
    //받아온 정보들을 DB에 넣어주기
    const product = new Product(req.body)
    product.save((err) => {
        if(err) return res.status(400).json({success: false, err})
        return res.status(200).json({ success: true})
    })
})

router.get('/products_by_id', (req, res) => {

    //productId로 DB에서 정보 가져오기
    let type = req.query.type;
    let productIds = req.query.id;

    if (type === "array") {
        productIds = req.query.id.split(',')
    }

    Product.find({ _id : {$in : productIds}})
    .populate('writer')
    .exec((err, product) => {
        if(err) return res.status(400).send(err)
        return res.status(200).send(product)
    })

})


module.exports = router;
