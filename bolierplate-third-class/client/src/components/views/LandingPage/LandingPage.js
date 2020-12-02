import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Icon, Col, Card, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider'

function LandingPage() {


    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0);
    const [Limit, setLimit] = useState(8);
    const [PostSize, setPostSize] = useState(0);

    useEffect(() => {

        let body = {
            skip: Skip,
            limit: Limit
        }

        getProducts(body)

    }, [])

    const getProducts = (body) => {
        Axios.post('/api/products/products', body)
        .then(response => {
            if(response.data.success) {
                if (body.loadMore){
                    setProducts([...Products, ...response.data.productsInfo])
                } else {
                    setProducts(response.data.productsInfo)
                }
                setPostSize(response.data.postSize)
            } else {
                alert('상품들을 가져오는데 실패했습니다.')
            }
        })
    }

    
    const moreContentHandler = () => {

        let newSkip = Skip + Limit;

        let body = {
            skip: newSkip,
            limit: Limit,
            loadMore: true
        } 

        getProducts(body)
        setSkip(newSkip);
    }

    const renderCards = Products.map((product, index) => {
        // Col의 최대사이즈 24, lg, md, xs에서 지정하는 사이즈는 24의 공약수로 지정할 것 
        return <Col lg={6} md= {8} sm={12} xs={24} key = {index}>
        <Card 
        cover={
            <ImageSlider image={product.images} />
        }
        >
            <Meta 
                title={product.title}
                description ={`$${product.price}`}
            />
        </Card>
        </Col>

    })


    return (
        <div style ={{width: '75%', margin: '3rem auto'}}>
            <div style ={{ textAlign: 'center'}}>
                <h2>Check out new Voices <Icon type ="sound"/> </h2>
            </div>

            { /* Filter */}

            { /* Search */}

            { /* Cards */}
            <Row gutter={16, 16}>
            {renderCards}
            </Row>
            {PostSize >= Limit &&
            <div style = {{display: 'flex', justifyContent: 'center', margin: '1rem'}}>
                <button onClick={moreContentHandler}>더보기</button>
            </div>
            }
        </div>
    )
}

export default LandingPage
