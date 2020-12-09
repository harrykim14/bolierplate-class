import Axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Icon, Col, Card, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider'
import CheckBox from './Section/CheckBox';
import RadioBox from './Section/RadioBox';
import SearchFeature from './Section/SearchFeature';
import { Continents, Prices } from './Section/Datas'

function LandingPage() {


    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0);
    // eslint-disable-next-line
    const [Limit, setLimit] = useState(8);
    const [PostSize, setPostSize] = useState(0);
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })
    // eslint-disable-next-line
    const [SearchTerm, setSearchTerm] = useState('');

    useEffect(() => {

        let body = {
            skip: Skip,
            limit: Limit
        }

        getProducts(body)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            filters:Filters,
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
            <a href={`/product/${product._id}`}>
            <ImageSlider image={product.images} />
            </a>
        }
        >
            <Meta 
                title={product.title}
                description ={`$${product.price}`}
            />
        </Card>
        </Col>

    })

    const showFilteredResults = (filters) => {

        let body = {
            skip : 0,
            limit: Limit,
            filters:filters
        }

        getProducts(body)
        setSkip(0)
    }

    const handlePrice = (value) => {
        const data = Prices;
        let priceArr = [];

        for (let key in data){
            if(data[key]._id === parseInt(value, 10)){
                priceArr = data[key].array;
            }
        }
        return priceArr;
    }

    const handelFilters = (filters, category) => {
        const newFilters = {...Filters}

        if (category === "continents"){
            newFilters[category] = filters;
        }
        
        if(category === "price") {
            let priceValue = handlePrice(filters)
            newFilters[category] = priceValue
        }
        
        console.log('filters', filters)

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerm = (newSearchTerm) => {

        let body = {
            skip:0,
            limit:Limit,
            flters:Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body);
    }


    return (
        <div style ={{width: '75%', margin: '3rem auto'}}>
            <div style ={{ textAlign: 'center'}}>
                <h2>Check out new Voices <Icon type ="sound"/> </h2>
            </div>

            { /* Filter */}
            <Row gutter ={[16,16]}>
                <Col lg = {12} xs ={24}>
                 {/* CheckBox */}
                    <CheckBox list ={Continents} 
                    handleFilters={newChecked => handelFilters(newChecked, "continents")}
                    />
                </Col>
                <Col lg = {12} xs ={24}>
                 {/* RadioBox */}
                    <RadioBox list ={Prices}
                     handleFilters={selected => handelFilters(selected, "price")}
                    />
                </Col>
            </Row>

            { /* Search */}
            <div stlye = {{ display:'flex', flexFlow: 'row wrap', alignItems:'flex-end', margin:'2px auto' }}>
                <SearchFeature refreshFunction = {updateSearchTerm} />
            </div>
            { /* Cards */}
            <Row gutter={[16, 16]}>
            {(Products.length > 0) ? renderCards
                                   : <React.Fragment><div style={{textAlign:'center', marginTop: '10vh'}}>No Data for display</div></React.Fragment>}
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
