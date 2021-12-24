import { useContext, useState } from "react";
import { Container, Form, Button, Spinner, Alert } from "react-bootstrap";
import { Link, useHistory, Redirect } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from "axios";

import "./Login.css";
import CommonContext from "../../contexts/CommonContext";
export default function Login() {

    const [errors, setErrors] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const { setIsLoggedIn } = useContext(CommonContext);


    const history = useHistory();

    const initialValues = {
        email: "test@user.com",
        password: "test123"
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email format')
            .required('Required'),
        password: Yup.string()
            .required('Required')
            .min(6, "minimum 6 characters")
            .max(100, "maximum 100 characters")
    });

    const onSubmit = ({ email, password }) => {

        const uploadToBackend = async () => {
            try {
                setIsLoading(true);
                const { data: token } = await axios.post(`/auth/login`, {
                    email,
                    password
                });
                setIsLoading(false);

                localStorage.setItem("token", token);
                setIsLoggedIn(true);
                history.replace("/");
            }
            catch (err) {
                setIsLoading(false);
                setErrors(err?.response?.data);
                console.error(err);
            }
        }

        uploadToBackend();

    }

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema
    });

    return (

        localStorage.getItem("token") ? <Redirect to="/" /> :
            <Container>
                {isLoading ? <div className="spinnerCenter"><Spinner animation="border" /> </div> :
                    <div className="login">
                        <div className="loginRight">
                            <div className="loginRightTop">
                                <div className="loginLogo">
                                    <span>Log-in</span>
                                </div>
                                {
                                    errors ? <div className="registerErrorAlert">
                                        <Alert variant="danger">
                                            {errors}
                                        </Alert>
                                    </div> : null
                                }
                                <Form onSubmit={formik.handleSubmit} >
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

                                    <Button className="loginRightbutton" variant="primary" type="submit" style={{ width: "100%", backgroundColor: "#405de6" }}>
                                        Sign in
                                    </Button>
                                    <Link to="/forgot-password">
                                        <Button className="forgotpassBtn" variant="outline-primary">Forgot password?</Button>
                                    </Link>

                                </Form>

                            </div>
                            <div className="loginRightBottom">
                                <p>Dont have an account?
                                    <Link to="/register">
                                        <Button className="signBtn" variant="outline-primary">Sign up</Button>
                                    </Link>


                                </p>

                            </div>

                        </div>
                    </div>
                }
            </Container>
    )
}