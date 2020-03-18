import React, { useState, useEffect } from 'react';
import FilmForm from './FilmForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Pagination from 'react-bootstrap/Pagination';
import Alert from 'react-bootstrap/Alert';

function App() {
  const [_triggerFetch, _setTrigerFetch] = useState(true);
  function triggerFetch() {
    _setTrigerFetch((val) => !val);
  }
  const [films, setFilms] = useState([]);
  const [count, setCount] = useState(0);
  const [params, setParams] = useState({ limit: 20, page: 1 });
  const [message, setMessage] = useState({ text: 'default', type: 'primary', visibility: false, })
  const defaultSelectedFilm = {
    _id: "",
    title: "",
    year: "",
    format: "",
    actorsList: []
  }
  const [selectedFilm, setSelectedFilm] = useState(defaultSelectedFilm);
  function showMessage(type, text) {
    clearTimeout(message.timeout);
    let timeout = setTimeout(() => setMessage({ visibility: false }), 2000);
    setMessage({ text, type, visibility: true, timeout });

  }
  useEffect(() => {
    getFilms()
  }, [_triggerFetch]);

  function objectToQueryString(obj) {
    return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
  }
  function getFilms() {
    fetch('http://localhost:8080/api/films?' + objectToQueryString(params))
      .then(res => res.json())
      .then(res => { setFilms(res.films); setCount(res.count) })
      .catch((err) => { showMessage('danger', `something went wrong\n${err}`); })
  }
  const defaultValidationErrors = {
    title: "title should not be blank",
    year: "year should be more than 1850 and less than 2020",
    format: "format should not be blank",
    actorsList: "actors list should include at least 1 actor"
  };
  const emptyValidationErrors = {
    title: "",
    year: "",
    format: "",
    actorsList: ""
  }
  const [validationErrors, setValidationErrors] = useState(emptyValidationErrors);

  function validateForm() {
    let errors = { ...emptyValidationErrors };
    let valid = true;
    if (selectedFilm.title.length === 0) {
      errors.title = defaultValidationErrors.title;
      valid = false;
    }
    if (Number(selectedFilm.year) > 2020 || Number(selectedFilm.year) < 1850) {
      errors.year = defaultValidationErrors.year;
      valid = false;
    }
    if (selectedFilm.format.length === 0) {
      errors.format = defaultValidationErrors.format;
      valid = false;
    }
    if (selectedFilm.actorsList.length === 0) {
      errors.actorsList = defaultValidationErrors.actorsList;
      valid = false;
    }
    setValidationErrors({ ...errors })
    return valid;
  }
  useEffect(() => {
    validateForm();
  }, [selectedFilm]);
  function addNewFilm(e) {
    e.preventDefault();
    if (validateForm()) {
      const { title, year, format, actorsList } = selectedFilm;
      fetch('http://localhost:8080/api/films',
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({ title, year, format, actorsList })
        }).then(res => res.json())
        .then((res) => {
          res.status === "SUCCESS" ? showMessage('success', "added succesfully") : showMessage('danger', `something went wrong\n${res.error_text}`);
          triggerFetch();
          setSelectedFilm(defaultSelectedFilm);
        })
        .catch((err) => { showMessage('danger', `something went wrong\n${err}`); })
    }

  }
  function editFilm(id) {
    return (e) => {
      e.preventDefault();
      if (validateForm()) {
        const { title, year, format, actorsList } = selectedFilm;
        fetch('http://localhost:8080/api/films/' + id,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({ title, year, format, actorsList })
          })
          .then(res => res.json())
          .then((res) => {
            res.status === "SUCCESS" ? showMessage('success', "edited succesfully") : showMessage('danger', `something went wrong\n${res.error_text}`);
            triggerFetch();
            setSelectedFilm(defaultSelectedFilm);
          })
          .catch((err) => { showMessage('danger', `something went wrong\n${err}`); })
      }

    }

  }
  function importByfile(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('movies', e.target.movies.files[0]);

    fetch('http://localhost:8080/api/films', {
      method: 'POST',
      body: formData
    }).then(res => res.json())
      .then((res) => {
        triggerFetch();
        if (res.status === "SUCCESS") {
          showMessage('success',
            res.rez.reduce(
              (acc, nextValue) => {
                let valueToAdd = nextValue.status === "SUCCESS" ? "added succesfully" : nextValue.error_text;
                return acc + "\n" + valueToAdd;
              }, ''));
        } else {
          showMessage('danger', `something went wrong\n${res.error_text}`);
        }
      })
      .catch((err) => { showMessage('danger', `something went wrong\n${err}`); })
  }
  function deleteFilm(id) {
    return (e) => {
      if (id === selectedFilm._id) {
        setSelectedFilm(defaultSelectedFilm);
      }
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      fetch('http://localhost:8080/api/films/' + id,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'DELETE',
        })
        .then((res) => res.json())
        .then((res) => { res.status === "SUCCESS" ? showMessage('success', "deleted succesfully") : showMessage('danger', `something went wrong\n${res.error_text}`); triggerFetch() })
        .catch((err) => { showMessage('danger', `something went wrong\n${err}`); })
    }
  }

  function getPaginationItems() {
    const items = [];
    for (let n = 1, i = 0; i < count; i += params.limit, n++) {
      items.push(<Pagination.Item key={n} active={n === params.page} onClick={() => { setParams({ ...params, page: n }); triggerFetch(); }}>
        {n}
      </Pagination.Item>)
    }
    return items;

  }
  return (
    <Container>
      <FilmForm input={selectedFilm} validationErrors={validationErrors} buttonLabel={selectedFilm._id !== "" ? "edit" : "add new film"} onSubmit={selectedFilm._id !== "" ? editFilm(selectedFilm._id) : addNewFilm} onInput={(e) => {
        setSelectedFilm({ ...selectedFilm, [e.target.name]: e.target.value });
      }} />
      <Form onSubmit={importByfile}>
        <Form.Group as={Row}>
          <Form.Label>Photos</Form.Label>
          <Form.Control name="movies" type="file" />
        </Form.Group>
        <Form.Group as={Row}>
          <Col sm={{ span: 10, offset: 2 }}>
            <Button type="submit">import</Button>
          </Col>
        </Form.Group>
      </Form>
      <hr />
      <Form onInput={e => { setParams({ ...params, [e.target.name]: e.target.value }); triggerFetch(); }}>
        <Form.Group as={Row} controlId="SearchByTitle">
          <Form.Label column sm={2}>
            search by title
            </Form.Label>
          <Col sm={10}>
            <Form.Control type="text" placeholder="title" name="title" value={params.title} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="SearchByActor">
          <Form.Label column sm={2}>
            search by actor
            </Form.Label>
          <Col sm={10}>
            <Form.Control type="text" placeholder="actor" name="actorsList" value={params.actorsList} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="SortBy">
          <Form.Label column sm={2}>
            Sort By
            </Form.Label>
          <Col sm={10}>
            <Form.Control as="select" name="sortBy" value={params.sotrBy}>
              <option value="undefined">-</option>
              <option value="title">title</option>
              <option value="year">year</option>
              <option value="format">format</option>
            </Form.Control>
          </Col>
        </Form.Group>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th name="title" >Title</th>
            <th name="year">Year</th>
            <th name="format">Format</th>
            <th name="actorsList">Actors</th>
            <th>delete</th>
          </tr>
        </thead>
        <tbody>
          {films.map((film, key) => {
            return (
              <tr key={key} onClick={() => { setSelectedFilm(film); validateForm() }}>
                <td>{film.title}</td>
                <td>{film.year}</td>
                <td>{film.format}</td>
                <td>{film.actorsList.map((actor, key) => (<p key={key}>{actor}</p>))}</td>
                <td><Button variant='danger' onClick={deleteFilm(film._id)}>delete</Button></td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <Pagination>
        {getPaginationItems()}
      </Pagination>
      <Alert className="fixed-top" show={message.visibility} variant={message.type}>
        <pre>
          {message.text}
        </pre>
      </Alert>
    </Container>
  );
}

export default App;