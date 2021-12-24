import { Container, Form, Spinner, Button, Alert } from "react-bootstrap";
import { Redirect, useParams } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";

import axios from "axios";

import { useState } from "react";

export default function ResetPassword() {

    const [errors, setErrors] = useState();
    const [successMsg, setSuccessMsg] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const params = useParams();

    const initialValues = {
        password: "",
        confirmPassword: ""
    }

    const validationSchema = Yup.object({
        password: Yup.string()
            .required('Required')
            .min(6, "minimum 6 characters")
            .max(100, "maximum 100 characters"),
        confirmPassword: Yup.string()
            .required('Required')
            .oneOf([Yup.ref('password'), null], "Password doesn't match!")
            .min(6, "minimum 6 characters")
            .max(100, "maximum 100 characters")
    });

    const onSubmit = ({ password }) => {

        const uploadToBackend = async () => {
            try {

                setIsLoading(true);

                const randomString = params.jwt;

                await axios.put(`/auth/reset-password`, {
                    password,
                    randomString
                });

                setIsLoading(false);

                setSuccessMsg("Password updated please login to continue...");
            }
            catch (err) {
                setIsLoading(false);
                setErrors("Password reset link sent to your mail is expired/invalid.");
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
                                successMsg ? <div className="rpWrapper"><div className="registerErrorAlert">
                                    <Alert variant="success">
                                        {successMsg}
                                    </Alert>

                                </div>
                                </div> : <div className="registerRight">
                                    {
                                        errors ? <div className="rpWrapper"> <div className="registerErrorAlert">
                                            <Alert variant="danger">
                                                {errors}
                                            </Alert>
                                        </div>
                                        </div> :

                                            <div className="registerRightTop">
                                                <div className="registerLogo">
                                                    <span>Password Reset</span>
                                                </div>



                                                <Form onSubmit={formik.handleSubmit} >

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

                                                    <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                                                        <Form.Label>Confrim password</Form.Label>
                                                        <Form.Control type="password" name="confirmPassword"
                                                            value={formik.values.confirmPassword} placeholder="Min 6 characters" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                                        {
                                                            formik.errors.confirmPassword && formik.touched.confirmPassword ?
                                                                <Form.Text className="red">
                                                                    {formik.errors.confirmPassword}
                                                                </Form.Text> : null
                                                        }
                                                    </Form.Group>

                                                    <Button variant="primary" type="submit" style={{ width: "100%", backgroundColor: "#405de6" }}>
                                                        Change password
                                                    </Button>
                                                </Form>

                                            </div>
                                    }
                                </div>
                            }
                        </div>
                }
            </Container>
    )
}