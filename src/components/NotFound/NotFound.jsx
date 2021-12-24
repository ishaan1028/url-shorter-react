import React from 'react';
import { Alert, Container, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

export default function NotFound() {

    const history = useHistory();

    const backOperation = () => {
        history.replace("/");
    }

    return (
        <div>

            <Container>
                <div className="homeWrapper">

                    <div className="alertDiv">
                        <Alert >
                            <h1> Page not found</h1>
                        </Alert>
                    </div>

                    <div className="logoutButton">
                        <Button onClick={backOperation} >Go Home</Button>
                    </div>
                </div>

            </Container>

        </div>
    )
}
