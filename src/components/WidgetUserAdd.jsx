import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import configApi from '../config.api';

export default function WidgetUserAdd({ eventListener }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [user, setUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: ""
  })

  const create = async () => {
    try { 
      const response = await fetch(`${configApi.BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem("token")
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        console.log(response);
        throw new Error(`Error! status: ${response.status}`);
      }
      
      const content = await response.json();
      handleClose();
      eventListener({detail: { content, status: true }})
    } catch (error) {
      eventListener({detail: { error, status: false }})
    }
  }

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUser((user) => ({...user, [name]: value}))
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        New User
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" name='email' value={user.email} onChange={handleInput} placeholder="name@example.com" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" name='firstName' value={user.firstName} onChange={handleInput} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" name='lastName' value={user.lastName} onChange={handleInput} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name='password' value={user.password} onChange={handleInput} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={create}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}