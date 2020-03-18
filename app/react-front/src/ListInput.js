import React, { useState, useRef, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ListInput(props) {
    const [value, setValue] = useState(props.value || []);
    const raiseState = props.raiseState;
    const deleteItem = (index) => {
        setValue((val) => [...val.slice(0, index), ...val.slice(index + 1, val.length)]);
    }
    const addItem = (item) => {
        if (value.indexOf(item) === -1 && item.length !== 0) {
            setValue([...value, item]);
        }
    }
    useEffect(() => { raiseState(value) }, [value]);
    useEffect(() => {
        setValue(props.value || []);
    }, [props.value]);
    const myRef = useRef(null);
    return (
        <Form.Group as={Row} controlId="actorsList">
            <Form.Label column sm={2}>
                {props.label}
            </Form.Label>
            <Col sm={10}>
                {value.map((item, key) => (<p key={key}>{item}<Button onClick={() => deleteItem(key)}>X</Button></p>))}
                <Form.Control ref={myRef} type="text" placeholder="Enter actor" name="actor" /><Button onClick={() => { addItem(myRef.current.value); myRef.current.value = '' }} >{props.buttonLabel || "add item"}</Button>
                <p className="text-danger ml-3">
                    {props.errorMessage}
                </p>
            </Col>
        </Form.Group>
    );
}
export default ListInput;