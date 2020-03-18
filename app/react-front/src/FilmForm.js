import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListInput from './ListInput';

function FilmForm(props) {
  const { input, onSubmit, onInput, validationErrors } = props;

  return (
    <Form onSubmit={onSubmit} onChange={onInput}>
      <Form.Group as={Row} controlId="Title">
        <Form.Label column sm={2}>
          title
    </Form.Label>
        <Col sm={10}>
          <Form.Control type="text" placeholder="Enter title" name="title" value={input.title} />
          <p className="text-danger ml-3">
            {validationErrors.title}
          </p>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="Year">
        <Form.Label column sm={2}>
          year
    </Form.Label>
        <Col sm={10}>
          <Form.Control type="number" placeholder="Enter year" name="year" value={input.year} />
          <p className="text-danger ml-3">
            {validationErrors.year}
          </p>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="Format">
        <Form.Label column sm={2}>
          format
    </Form.Label>
        <Col sm={10}>
          <Form.Control as="select" name="format" value={input.format} custom>
            <option disabled value="">Choose format</option>
            <option value="DVD">DVD</option>
            <option value="VHS">VHS</option>
            <option value="Blue-Ray">Blue-Ray</option>
          </Form.Control>
          <p className="text-danger ml-3">
            {validationErrors.format}
          </p>
        </Col>
      </Form.Group>
      <ListInput
        value={input.actorsList}
        errorMessage={validationErrors.actorsList}
        label="actors list"
        buttonLabel="add actor"
        raiseState={(newActorsList) =>
          onInput({ target: { name: 'actorsList', value: newActorsList } })}>
      </ListInput>
      <Form.Group as={Row}>
        <Col sm={{ span: 10, offset: 2 }}>
          <Button type="submit">{props.buttonLabel}</Button>
        </Col>
      </Form.Group>
    </Form >
  );
}
export default FilmForm;
