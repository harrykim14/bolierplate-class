import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { getCartItems, removeCartItem, onSuccessBuy } from '../../../_actions/user_actions';
import { Empty, Result } from 'antd';
import UserCardBlock from './Sections/UserCardBlock';
import Paypal from '../../utils/Paypal';

function CartPage(props) {

    const dispatch = useDispatch();
    const [Total, setTotal] = useState(0)
    const [ShowCartList, setShowCartList] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        
        let cartItems = [];

        if(props.user.userData && props.user.userData.cart) {
            if(props.user.userData.cart.length > 0){
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                })

                dispatch(getCartItems(cartItems, props.user.userData.cart))
                .then(response => { calTotal(response.payload)
                    
                })
            }
        }
// eslint-disable-next-line
    }, [props.user.userData])

    const calTotal = (cartDetail) => {
        let total = 0;

        cartDetail.map(item => (
            total += parseInt(item.price ,10) * parseInt(item.quantity, 10)
        ))

        setTotal(total)
        setShowCartList(true)
    }

    let removeFromCart = (productId) => {
        dispatch(removeCartItem(productId))
        .then(response=> {
            if(response.payload.productInfo.length <= 0){
                setShowCartList(false)
            }
        })
    }

    const transactionSuccess= (paymentData) => {

        dispatch(onSuccessBuy({
            paymentData : paymentData,
            cartDetail : props.user.cartDetail

        }))
        .then(response => {
            if(response.payload.success){
                setShowCartList(false)
                setShowSuccess(true);
            }
        })
    }

    return (
        <div style = {{ width: '85%', margin: '3rem auto' }}>
            <h1>My Cart</h1>
            <div>
                <UserCardBlock products = {props.user.cartDetail} removeItem={removeFromCart}/>
            </div>

            
        
        {ShowCartList ? 
        <div style={{ marginTop : '3rem' }}>
        <h2>Total Amount: $ {Total}</h2>
        </div>
        : ShowSuccess ? 
            <Result 
                    status="success"
                    title="Successfully Purchased Items"
                />
        :
            <Empty description={false} style={{marginTop: '2rem'}}/>
        }
            
        {ShowCartList && <Paypal total={Total} onSuccess={transactionSuccess}/>}
        

        </div>
    )
}

export default CartPage
