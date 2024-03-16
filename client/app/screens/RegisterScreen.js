"use client"
import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredients } from '../slices/authSlice';
import { toast } from 'react-toastify';
export const Registercreen = () => {
    const [name,setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [register, {isLoading}] = useRegisterMutation();
    const { userInfo } = useSelector((state) => state.auth);

    const {search} =useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';
    useEffect(()=>{
        if(userInfo) {
            navigate(redirect)
        }
    },[userInfo, redirect, navigate]);

  
    const submitHandler = async(e) => {
        e.preventDefault(); 
        if(password !== confirmPassword) {
            toast.error('password do not match')
        }
        else {
        try {
            const res = await register({ name, email, password}).unwrap();
            dispatch(setCredients({...res, }));
            navigate(redirect)
        } catch(err) {
            toast.error(err?.data?.message || err.error)
        }
      }
        
    }
  return (
    <FormContainer>
      <h1> Sign Up</h1>
      <Form onSubmit={submitHandler}>
      <Form.Group controlId='name' className='my-3'>
            <Form.Label>Name</Form.Label>
            <Form.Control
            type='text'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            >
            </Form.Control>
        </Form.Group>
        <Form.Group controlId='email' className='my-3'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            >
            </Form.Control>
        </Form.Group>
        <Form.Group controlId='password' className='my-3'>
            <Form.Label>Enter password</Form.Label>
            <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            >
            </Form.Control>
        </Form.Group>
        <Form.Group controlId='ConfirmPassword' className='my-3'>
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            >
            </Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' className='mt-3' disabled= { isLoading }>
            Register

        </Button>
        {isLoading && <Loader/>}
      </Form>
      <Row>
        <Col>
        ALready have an account? {' '} <Link to={ redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default Registercreen;
