import React,{useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListInput from './ListInput';

function NoteForm(props) {
  
  const {input, onSubmit, onInput} = props;
  return (
<Form onSubmit={onSubmit} onInput={onInput}>
  <Form.Group as={Row} controlId="Title">
    <Form.Label column sm={2}>
        title
    </Form.Label>
    <Col sm={10}>
      <Form.Control required type="text" placeholder="Enter title" name ="title"  value={input.title} />
    </Col>
  </Form.Group>
 
  <Form.Group as={Row} controlId="Year">
    <Form.Label column sm={2}>
        year
    </Form.Label>
    <Col sm={10}>
      <Form.Control required type="number" placeholder="Enter year" name ="year" value={input.year} />
    </Col>
  </Form.Group>

  <Form.Group as={Row} controlId="Format">
    <Form.Label column sm={2}>
        format
    </Form.Label>
    <Col sm={10}>
      <Form.Control required type="text" placeholder="Enter format" name = "format" value={input.format} />
    </Col>
  </Form.Group>
  <ListInput value ={input.actorsList} label="actors list" buttonLabel="add actor" raiseState={(newActorsList)=>onInput({target:{name:'actorsList',value:newActorsList}})}></ListInput>

  <Form.Group as={Row}>
    <Col sm={{ span: 10, offset: 2 }}>
<Button type="submit">{props.buttonLabel}</Button>
    </Col>
  </Form.Group>
</Form>
  );
}
export default NoteForm;
