import { Container, Form, Spinner, Button, Alert } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";

import axios from "axios";

import "./Register.css";
import { useState } from "react";

export default function Register() {

    const [errors, setErrors] = useState();
    const [successMsg, setSuccessMsg] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const initialValues = {
        email: "",
        password: "",
        name: ""
    }

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email format')
            .required('Required'),
        password: Yup.string()
            .required('Required')
            .min(6, "minimum 6 characters")
            .max(100, "maximum 100 characters"),
        name: Yup.string()
            .required('Required')
            .min(3, "minimum 3 characters")
            .max(100, "maximum 100 characters")
    });

    const onSubmit = ({ email, password, name }) => {

        const uploadToBackend = async () => {
            try {
                setIsLoading(true);
                await axios.post(`/auth/register`, {
                    email,
                    password,
                    name
                });

                setIsLoading(false);
                setSuccessMsg(true);
            }
            catch (err) {
                setIsLoading(false);
                setErrors(err?.response?.data);
                console.error(err);

            }
        }

        uploadToBackend();

    };

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema
    });

    return (
        localStorage.getItem("token") ? <Redirect to="/" /> :
            <Container>
                {
                    isLoading ? <div className="spinnerCenter"><Spinner animation="border" /> </div> :


                        <div className="register">
                            {
                                successMsg ? <div className="registerErrorAlert">
                                    <Alert variant="success">
                                        A verification link has been sent to your email. Please verify your email to continue...
                                    </Alert>
                                </div> : <div className="registerRight">

                                    <div className="registerRightTop">
                                        <div className="registerLogo">
                                            <span>Register</span>
                                        </div>
                                        {
                                            errors ? <div className="registerErrorAlert">
                                                <Alert variant="danger">
                                                    {errors}
                                                </Alert>
                                            </div> : null
                                        }


                                        <Form onSubmit={formik.handleSubmit} >
                                            <Form.Group className="mb-3" controlId="formBasicName">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control type="text" name="name" placeholder="Enter your name"
                                                    onChange={formik.handleChange} value={formik.values.name}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {
                                                    formik.errors.name && formik.touched.name ?
                                                        <Form.Text className="red">
                                                            {formik.errors.name}
                                                        </Form.Text> : null
                                                }


                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Email address</Form.Label>
                                                <Form.Control type="email" name="email" placeholder="Enter email"
                                                    onChange={formik.handleChange} value={formik.values.email}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {
                                                    formik.errors.email && formik.touched.email ?
                                                        <Form.Text className="red">
                                                            {formik.errors.email}
                                                        </Form.Text> : null
                                                }


                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" name="password"
                                                    value={formik.values.password} placeholder="Min 6 characters" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                {
                                                    formik.errors.password && formik.touched.password ?
                                                        <Form.Text className="red">
                                                            {formik.errors.password}
                                                        </Form.Text> : null
                                                }
                                            </Form.Group>

                                            <Button variant="primary" type="submit" style={{ width: "100%", backgroundColor: "#405de6" }}>
                                                Sign up
                                            </Button>
                                        </Form>

                                    </div>
                                    <div className="registerRightBottom">
                                        <p>Have an account?
                                            <Link to="/login">
                                                <Button className="signBtn" variant="outline-primary">Sign in</Button>
                                            </Link>


                                        </p>

                                    </div>
                                </div>
                            }

                        </div>
                }
            </Container>
    )
}