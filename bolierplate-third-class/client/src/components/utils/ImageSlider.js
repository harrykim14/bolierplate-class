import React from 'react'
import { Carousel } from 'antd'

function ImageSlider(props) {
    return (
        <div>
        <Carousel autoplay autoplaySpeed={1000}>
                {props.image.map((image, index) => (
                    <div key = {index}>
                        <img style = {{ width: '100%', maxHeight: '240px'}}
                            src ={`http://localhost:5000/${image}`}
                            alt ="대표 이미지"
                        />
                    </div>
                ))}
        </Carousel>
        </div>
    )
}

export default ImageSlider
