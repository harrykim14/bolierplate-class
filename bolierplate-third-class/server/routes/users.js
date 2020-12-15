const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");
const { response } = require('express');
const { Product } = require('../models/Product');
const { Payment } = require('../models/Payment');

const async = require('async');

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post("/addToCart", auth, (req, res) => {
    // User Collection에서 해당 유저의 정보를 가져오기
    User.findOne({ _id : req.user._id }, 
        (err, userInfo) => {
            // 카트 내 해당 상품 유무를 확인
            let duplicate = false;
            userInfo.cart.forEach((item) => {
                if(item.id === req.body.productId){
                    duplicate = true;
                }
            })  

            // 이미 있을경우    
            if(duplicate) {
                User.findOneAndUpdate(
                { _id : req.user._id, "cart.id" : req.body.productId }, 
                { $inc : { "cart.$.quantity" : 1 }},
                { new : true},
                // $inc로 업데이트된 정보를 받기 위해 {new :true}를 사용한다
                ( err, userInfo ) => {
                    if(err) return res.status(400).json({ success : false, err})
                    res.status(200).send(userInfo.cart);
                })
            }
            // 없을 경우
            else {
                User.findOneAndUpdate(
                    { _id : req.user._id },
                    { $push : {
                        cart : {
                            id : req.body.productId,
                            quantity : 1,
                            date : Date.now()
                        }
                    }},
                    { new : true},
                    ( err, userInfo ) => {
                        if(err) return res.status(200).json({ success : false, err})
                        res.status(200).send(userInfo.cart);
                    }
                )
            }
    })
})

router.get('/removeFromCart', auth, (req, res) => {
    // 카트 안에서 상품 하나 지움
    User.findOneAndUpdate(
        {_id : req.user._id},
        {
            "$pull" : {
                "cart" : { "id" : req.query.id }
            }
        },
        { new : true},
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })

        // product collection에서 남아있는 상품 정보를 불러오기
        Product.find({_id: { $in: array }})
            .populate("writer")
            .exec((err, productInfo) => {
                return res.status(200).json({ productInfo, cart}) 
        })

        }
    )
    
})

router.post("/successBuy", auth, (req, res) => {
    
    // User collection의 history field 내에 간단한 결제 정보 넣어주기
    let history = [];
    let transactionData = {};

    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: Date.now(),
            name : item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId : req.body.paymentData.paymentID
        })
    })

    // Payment collection에도 결제정보 넣어주기
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    };
    transactionData.data = req.body.paymentData;
    transactionData.product = history;


    // history 정보 저장
        User.findOneAndUpdate(
            {_id: req.user._id},
            { $push: { history: history }, $set : {cart : []}},
            {new : true},
            (err, userInfo) => {
                if(err) return res.json({success : false, err})

                // paymnet에 정보 저장
                const payment = new Payment(transactionData)
                payment.save((err, doc) => {
                    if(err) return res.json({success: false, err})

                    // Product collection 내 sold field 정보 업테이트

                    // 상품 당 몇개를 샀는지

                    let products = [];                    
                    doc.product.forEach(item => {
                        products.push({id: item.id, quantity: item.quantity })
                    })
                    async.eachSeries(products, (item, callback) => {
                        Product.update(
                            { _id: item.id },
                            { $inc: 
                                { "sold": item.quantity}
                            },
                            {new : false },
                            callback
                        )
                    }, (err) => { 
                        if(err) return res.status(400).json({ success: false, err })
                        res.status(200).json({
                            success: true,
                            cart: userInfo.cart, 
                            cartDetail: []
                        })
                    })
                })


            }

        )
    

});

module.exports = router;
