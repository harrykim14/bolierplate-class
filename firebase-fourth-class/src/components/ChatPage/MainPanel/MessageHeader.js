import React from 'react'

// react-bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Image from 'react-bootstrap/Image';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// react-icons
import { FaLock } from 'react-icons/fa';
import { MdFavorite } from 'react-icons/md';
import { AiOutlineSearch }  from 'react-icons/ai';

function MessageHeader() {
    return (
        <div style={{ width: '100%', height: '170px', 
                      border:'.2rem solid #ececec', borderRadius: '4px', 
                      padding: '1rem', marginBottom: '1rem' }}>
            <Container>
                <Row>
                    <Col>
                        <h2><FaLock/> ChatRoomName <MdFavorite/></h2>
                    </Col>
                    <Col>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">
                            <AiOutlineSearch/>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        placeholder="메세지 찾기"
                        aria-label="Search"
                        aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                    </Col>
                </Row>
               <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem'}}>
                <Image src ="" /> {" "} display name
               </div>
                <Row>
                    <Col>
                        <Accordion>
                            <Card>
                                <Card.Header style={{ padding: '0 0.5rem' }}>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0" 
                                                      style={{ backgroundColor:'transparent', color: 'black'}}>
                                        Click me!
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Hello! I'm the body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                    <Col>
                        <Accordion>
                            <Card>
                                <Card.Header style={{ padding: '0 1rem' }}>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0"
                                                      style={{ backgroundColor:'transparent', color: 'black'}}>
                                        Click me!
                                    </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>Hello! I'm the body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default MessageHeader
