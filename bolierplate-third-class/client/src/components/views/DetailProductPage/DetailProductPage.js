import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { Row, Col } from 'antd';

import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';

function DetailProductPage(props) {

    const productId = props.match.params.productId;
    const [ProductObj, setProductObj] = useState({});

    useEffect(() => {
        Axios.get(`/api/products/products_by_id?id=${productId}&type=single`)
             .then(response => {
                 if(response.data.success){
                    setProductObj(response.data.product[0])
                 } else {
                     alert('상세 정보 가져오기를 실패했습니다.')
                 }
             })
         // eslint-disable-next-line
    }, [])

    return (
        <div style = {{ width: '100%', padding: '3rem 4rem' }}>
            <div style = {{ display: 'flex', justifyContent: 'center' }}>
                <h1>{ProductObj.title}</h1>
            </div>
            <br />

        <Row gutter = {[16, 16]}>
            <Col lg = {12} sm= {24}>
            {/* ProductImage */}
            <ProductImage detail ={ProductObj}/>
            </Col>
            
            <Col lg = {12} sm= {24}>
            {/* ProductInfo */}
            <ProductInfo detail ={ProductObj} />
            </Col>
        </Row>
            

            
        </div>
        
    )
}

export default DetailProductPage
