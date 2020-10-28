import React, {useState} from 'react'
import { Typography, Button, Form, message, Input, Icon } from'antd';
import DropZone from 'react-dropzone';
import Axios from 'axios';


const { Title } = Typography;
const { TextArea } = Input; 

const PrivateOptions = [
    {value : 0, label : "Private"},
    {value : 1, label : "Public"}
]

const CategoryOptions = [
    {value : 0, label : "Film & Animation"},
    {value : 1, label : "Autos & Vehicles"},
    {value : 2, label : "Music"},
    {value : 3, label : "Pets & Animals"}
]


function VideoUploadPage() {

    const [videoTitle, setvideoTitle] = useState("")
    const [Discription, setDiscription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film & Animation")

    const onTitleChange = (event) =>{
        setvideoTitle(event.currentTarget.value)
    }
    
    const onDescriptionChange = (event) => {
        setDiscription(event.currentTarget.value)
    }

    const onPrivateChange = (event) => {
        setPrivate(event.currentTarget.value);
    }

    const onCategoryChange = (event) => {
        setCategory(event.currentTarget.value);
    }

    const onDrop = (files) => {
        let formData = new FormData;
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append('file', files[0])

        console.log(files)

        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if(response.data.success){
                    console.log(response.data)
                } else {
                    alert('비디오 업로드를 실패하였습니다.')
                }
            })
    }

    return (
        <div style ={{ maxWidth: '700px', margin:'2rem auto'}}>
            <div style = {{ textAlign: 'center', marginBottom:'2rem'}}>
                <Title level ={2}>Upload Video</Title>
            </div>
            <Form onSubmit>
                <div style ={{ display: 'flex' , justifyContent:'space-between'}}>
                    {   /* Drop Zone */    }
                    <DropZone
                    onDrop = {onDrop}
                    multiple = {false}
                    maxSize ={1000000000}>
                    {({getRootProps, getInputProps}) => (
                        <div style ={{width: '300px', height: '240px', border:'1px solid lightgray', 
                                      display: 'flex', alignItems:'center',justifyContent:'center'}}{...getRootProps()}>
                                          <input {...getInputProps()}/>
                                          <Icon type="plus" style={{ fontSize: '3rem'}}/>

                        </div>
                    )}
                    </DropZone>

                    {   /* Thumbnail */    }
                    <div>
                        <img src alt/>
                    </div>
                </div>
            <br />
            <br />
            <label>Title</label>
            <Input
                onChange = {onTitleChange}
                value = {videoTitle}
            />
            <br />
            <br />
            <label>Discription</label>
            <TextArea
                onChange = {onDescriptionChange}
                value = {Discription} />
            <br />
            <br />

            <select onChange = {onPrivateChange}>
                {PrivateOptions.map((item, index) =>(
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
            </select>
            <br />
            <br />

            <select onChange= {onCategoryChange}>
                {CategoryOptions.map((item, index) => (
                    <option key ={index} value ={item.value}>{item.label}</option>
                ))}
            </select>
            <br />
            <br />

            <Button type ="primary" size="large" onClick>
                Submit
            </Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage
