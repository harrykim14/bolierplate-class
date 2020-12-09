import React, { useState } from 'react'
import { Collapse, Checkbox } from 'antd';

const { Panel } = Collapse; 

function CheckBox(props) {

    const [Checked, setChecked] = useState([]);

    const handleToggle = (value) => {
        // 누른 항목의 index를 구하기 -> 값이 없다면 -1값으로 리턴됨
        const currentIndex = Checked.indexOf(value)

        // checked 배열에서 index값을 구하고
        const newChecked = [...Checked]

        // checked 배열로 새 배열을 초기화 한 후에

        // currentIndex값이 -1이라면 없다는 뜻이므로 push를, 있다면 splice로 값을 빼줌
        if(currentIndex === -1){            
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }

        setChecked(newChecked)
        props.handleFilters(newChecked)
    }  

    const renderCheckBoxLists = () => props.list && props.list.map((value, index) => (
        <React.Fragment key={index}>
            <Checkbox
                style = {{ margin: '0px 10px auto'}} 
                onChange={() => handleToggle(value._id)} 
                checked={Checked.indexOf(value._id) === -1 ? false : true}
            />
                <span>{value.name}</span>
        </React.Fragment>
    ))

    return (
        <div>
           <Collapse defaultActiveKey={['0']}>
                <Panel header="Continents" key="1">
                    {renderCheckBoxLists()}
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox
