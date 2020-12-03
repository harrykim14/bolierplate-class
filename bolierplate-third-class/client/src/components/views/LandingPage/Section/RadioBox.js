import React, { useState } from 'react'
import { Collapse, Radio } from 'antd';

const { Panel } = Collapse; 

function RadioBox(props) {

    const [Selected, setSelected] = useState(0);

    const renderRadioLists = () => props.list && props.list.map(value => (
            <React.Fragment key ={value._id}>
               <Radio value={value._id}>{value.name}</Radio>
            </React.Fragment>
    ))

    const handleChangeRadio = (event) => {
        setSelected(event.target.value)
        props.handleFilters(event.target.value);
    }

    return (
        <div>
           <Collapse defaultActiveKey={['1']}>
                <Panel header="Price" key="1">
                    <Radio.Group onChange={handleChangeRadio} value={Selected}>
                    {renderRadioLists()}
                    </Radio.Group>
                </Panel>
            </Collapse>
        </div>
    )
}

export default RadioBox
