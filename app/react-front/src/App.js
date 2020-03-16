import React, { useState, useEffect } from 'react';
import FilmForm from './FilmForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function App() {
  const [_triggerFetch, _setTrigerFetch] = useState(true);
  function triggerFetch() {
    _setTrigerFetch((val) => !val);
  }
  const [films, setFilms] = useState([]);
  const [params, setParams] = useState({});
  const [selectedFilm, setSelectedFilm] = useState({
    _id: "",
    title: "",
    year: "",
    format: "",
    actorsList: []
  });
  useEffect(() => {
    getFilms()
  }, [_triggerFetch]);

  function objectToQueryString(obj) {
    return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
  }
  function getFilms() {
    fetch('http://localhost:8080/api/films?' + objectToQueryString(params))
      .then(res => res.json())
      .then(res => setFilms(res))
      .catch(err => console.error(err));
  }
  function addNewFilm(e) {
    e.preventDefault();
    const { title, year, format, actorsList } = selectedFilm;
    fetch('http://localhost:8080/api/films',
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ title, year, format, actorsList })
      })
      .then(() => {
        triggerFetch();
        setSelectedFilm({
          _id: "",
          title: "",
          year: "",
          format: "",
          actorsList: ""
        });
      })
      .catch(function (err) { console.error(err) })
  }
  function editFilm(id) {
    return (e) => {
      e.preventDefault();
      console.log(e.target)
      const { title, year, format, actorsList } = selectedFilm;
      console.log({ title, year, format, actorsList })
      fetch('http://localhost:8080/api/films/' + id,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'PUT',
          body: JSON.stringify({ title, year, format, actorsList })
        })
        .then(() => {
          triggerFetch();
          setSelectedFilm({
            _id: "",
            title: "",
            year: "",
            format: "",
            actorsList: ""
          });
        })
        .catch(function (err) { console.error(err) })
    }

  }
  function importByfile(e){
    e.preventDefault();
    const formData = new FormData();
console.log(e.target);
    formData.append('movies', e.target.movies.files[0]);

    fetch('http://localhost:8080/api/films', {
    method: 'POST',
    body: formData
  }).then(res => res.json())
  .then(triggerFetch)
  .catch(err => console.error(err));
  }
  function deleteFilm(id) {
    return (e) => {
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
        .then(() => { triggerFetch() })
        .catch(function (err) { console.error(err) })
    }
  }

  return (
    <div>
      <FilmForm input={selectedFilm} buttonLabel={selectedFilm._id !== "" ? "edit" : "add new film"} onSubmit={selectedFilm._id !== "" ? editFilm(selectedFilm._id) : addNewFilm} onInput={(e) => {
        setSelectedFilm({ ...selectedFilm, [e.target.name]: e.target.value });
      }} />
      <Form onSubmit={importByfile}>
        <Form.Group as={Row}>
          <Form.Label>Photos</Form.Label>
          <Form.Control name="movies" type="file" onChange={console.log('good')} />
        </Form.Group>
        <Form.Group as={Row}>
          <Col sm={{ span: 10, offset: 2 }}>
            <Button type="submit">import</Button>
          </Col>
        </Form.Group>
      </Form>
      <hr />
      <Form onInput={e => { setParams({ ...params, [e.target.name]: e.target.value }); triggerFetch(); console.log(e.target.value) }}>
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
          {films.map((film,key) => {
            return (
              <tr key={key} onClick={() => setSelectedFilm(film)}>
                <td>{film.title}</td>
                <td>{film.year}</td>
                <td>{film.format}</td>
                <td>{film.actorsList.map((actor,key) => (<p key={key}>{actor}</p>))}</td>
                <td><Button variant='danger' onClick={deleteFilm(film._id)}>delete</Button></td>
              </tr>
            )
          })}

        </tbody>
      </Table>
    </div>
  );
}

export default App;