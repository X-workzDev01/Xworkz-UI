import React from 'react'
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

export const Course = ({ formData, setFormData, onNext,onPrevious }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

  return (
    <Container>
    <h2>Course</h2>
    <Form>
    <Form.Group className="mb-6" controlId="formBasicEmail">
      <Form.Control type="text"
       placeholder="Course Name"
       required
       name="coursename"
        value={formData.coursename || ''}
         onChange={handleInputChange} />
      </Form.Group>
      <Form.Group className="mb-6" controlId="formBasicEmail">
      <Form.Control type="text"
       placeholder="Branch"
       required
       name="branch"
        value={formData.branch || ''}
         onChange={handleInputChange} />
      </Form.Group>
      <Form.Group className="mb-6" controlId="formBasicEmail">
      <Form.Control type="text"
       placeholder="Batch"
       required
       name="batch"
        value={formData.batch || ''}
         onChange={handleInputChange} />
      </Form.Group>
      </Form>
      <button onClick={onPrevious}>Previous</button>
      <button onClick={onNext}>Next</button>
     
      </Container>
  )
}
