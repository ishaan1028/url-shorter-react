import React, { useContext, useEffect, useState } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import CommonContext from '../../contexts/CommonContext';

export default function VerifyEmail() {

    const params = useParams();
    const [errors, setErrors] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const history = useHistory();
    const { setIsLoggedIn } = useContext(CommonContext);



    useEffect(() => {

        const jwt = params.jwt;

        const verifyWithBackend = async () => {
            try {

                await axios.put(`/auth/verify/${jwt}`);
                localStorage.setItem("token", jwt);
                setIsLoggedIn(true);

                setIsLoading(false);

                history.replace("/");

            }
            catch (err) {

                setIsLoading(false);
                setErrors("Verification link is expired or invalid.");
                console.error(err);

            }
        }

        verifyWithBackend();

    }, [params.jwt, history, setIsLoggedIn]);

    return (
        <div>
            <Container>
                {
                    isLoading ? <div className="spinnerCenter"><Spinner animation="border" /> </div> :
                        <div className="verifyEmailWrapper">
                            {
                                errors ? <Alert variant="danger">
                                    {errors}
                                </Alert> :
                                    null
                            }
                        </div>
                }
            </Container>
        </div>
    )
}
