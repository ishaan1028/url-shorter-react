import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default function RedirectPage() {

    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {

        const fetchUrl = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.put(`/urls/get/${params.url}`);
                setIsLoading(false);
                window.location.href = data;
            }
            catch (err) {
                setIsLoading(false);
                window.location.href = window.location.href + "/notfound";
                console.error(err);
            }

        }

        fetchUrl();
    }, [params.url]);

    return (
        isLoading ? <div className="spinnerCenter"><Spinner animation="border" /> </div> : null
    )
}
