import Axios from 'axios'
import React, {useEffect, useState} from 'react'

function Subscribe(props) {

    const userTo = props.userTo;
    const userFrom = props.userFrom

    const [subscribeNumbers, setsubscribeNumbers] = useState(0)
    const [Subscribed, setSubscribed] = useState(false);  

    const onSubscribe = () => {

        let subscribeVariable = {
            userTo: userTo, 
            userFrom: userFrom
        }

        if(Subscribed) {            
            Axios.post('/api/subscribe/unSubscribe', subscribeVariable)
                .then(response => {
                    if(response.data.success) {
                        setsubscribeNumbers(subscribeNumbers -1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독 취소에 실패하였습니다.')
                    }
                })
        } else {
            Axios.post('/api/subscribe/subscribe', subscribeVariable)
                .then(response => {
                    if(response.data.success) {
                        setsubscribeNumbers(subscribeNumbers + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독에 실패하였습니다.')
                    }
                })
        }
    }

    useEffect(() => {

        const subNumVariable = {
            userTo : userTo,
        }        

        Axios.post('/api/subscribe/subscribeNumber', subNumVariable)
            .then( response => {
                if(response.data.success){
                    setsubscribeNumbers(response.data.subscribeNumbers)
                } else {
                    alert('구독자 수 정보를 받아오지 못했습니다.')
                }
            })

            const subscribedVariable = {
                userTo : userTo,
                userFrom : userFrom
            } 

        Axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then( response => {
                if(response.data.success){
                    setSubscribed(response.data.subscribed)
                    
                } else {
                    alert('해당 구독 정보를 받아오지 못했습니다.')
                }
            })

    }, [])
    
    return (
        <div>
            <button
            style = {{ 
                backgroundColor : `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px',
                color : 'white', padding: '10px 16px', fontWeight : '500',
                fontSize : '1rem', textTransform: 'uppercase'
            }}
            onClick = {onSubscribe}
            >
                {subscribeNumbers} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
