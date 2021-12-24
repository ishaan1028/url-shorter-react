import React, { useState } from 'react';
import { Button, Container, Table, Modal, Form, Spinner, Toast } from 'react-bootstrap';
import "./Home.css"
import { AiFillDelete } from "react-icons/ai";
import { FaShareSquare } from "react-icons/fa";
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from 'axios';
import { useEffect } from 'react';


export default function Home() {

    const token = localStorage.getItem("token");

    const [urls, setUrls] = useState([]);
    const [user, setUser] = useState();
    const [urlsThisMonth, setUrlsThisMonth] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const [showDeleteUrl, setShowDeleteUrl] = useState(false);
    const [deleteUrl, setDeleteUrl] = useState();

    const handleShowDeleteUrlClose = () => setShowDeleteUrl(false);
    const handleShowDeleteUrlShow = (url) => {
        setDeleteUrl(url);
        setShowDeleteUrl(true);
    }

    const [showToast, setShowToast] = useState(false);

    const [showCreateUrl, setShowCreateUrl] = useState(false);

    const handleShowCreateUrlClose = () => setShowCreateUrl(false);
    const handleShowCreateUrlShow = () => setShowCreateUrl(true);

    const handleRedirect = (url) => {
        window.open(url);
    }
    const fetchUrl = async (url) => {
        try {
            setIsLoading(true);
            const { data } = await axios.put(`/urls/get/${url}`);
            const newUrls = urls;
            newUrls.forEach(u => {
                if (u.shortUrl === url) u.clicks++;
            });
            setUrls([...newUrls]);
            setIsLoading(false);
            window.open(data);
        }
        catch (err) {
            setIsLoading(false);
            alert("couldnt fetch url try later");
            console.error(err);
        }

    }

    const handleDeleteUrl = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/urls/delete/${deleteUrl}`, {
                headers: { token }
            });

            const newUrls = urls.filter(u => u.shortUrl !== deleteUrl);
            setUrls([...newUrls]);
            setIsLoading(false);
        }
        catch (err) {
            setIsLoading(false);
            alert("couldnt delete url try later");
            console.error(err);
        }

        handleShowDeleteUrlClose();
    }

    const initialValues = {
        fullUrl: ""
    }

    const validationSchema = Yup.object({
        fullUrl: Yup.string()
            .required('Required')
            .matches(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig, 'Enter a valid url')
    });

    const onSubmit = ({ fullUrl }) => {

        const uploadToBackend = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.post(`/urls/create`, {
                    fullUrl
                }, {
                    headers: { token }
                });

                setUrls([data, ...urls]);
                setIsLoading(false);

            }
            catch (err) {
                setIsLoading(false);
                alert("Error creating url try later");
                console.error(err);

            }
        }

        uploadToBackend();
        formik.resetForm();
        handleShowCreateUrlClose();

    };

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema
    });

    useEffect(() => {


        const getUrls = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get(`/urls/user`, {
                    headers: { token }
                });
                setUrls(data);
                setIsLoading(false);

            }
            catch (err) {
                setIsLoading(false);
                alert("Error creating url try later");
                console.error(err);
            }
        }

        getUrls();

        const getUser = async () => {
            try {
                setIsLoading(true);
                const { data } = await axios.get(`/urls/profile`, {
                    headers: { token }
                });
                setUser(data);
                setIsLoading(false);
            }
            catch (err) {
                setIsLoading(false);
                alert("Error getting user try later");
                console.error(err);
            }
        }

        getUser();


    }, [token]);

    useEffect(() => {

        const urlShortsMonth = () => {
            const dateObj = new Date();
            const month = dateObj.getUTCMonth() + 1;
            const year = dateObj.getUTCFullYear();
            const newdate = year + "/" + month;

            const newUrls = urls || [];
            let ans = 0;

            newUrls.forEach(u => {
                const d = new Date(u.createdAt);
                const m = d.getUTCMonth() + 1;
                const y = d.getUTCFullYear();

                ans = y + "/" + m === newdate ? ans + 1 : ans;
            });

            setUrlsThisMonth(ans);

        }

        urlShortsMonth();
    }, [urls])



    return (
        isLoading ? <div className="spinnerCenter"><Spinner animation="border" /> </div> :
            <div>
                <Container className='homeMainCon'>
                    <div className="homeWrapper">
                        <div className="homeTop">
                            <div className="homeTopDashBoard">
                                <p className="dashboardText">
                                    Dashboard
                                </p>
                                <p className="welcomeText">
                                    Welcome <span className="uiBold">{user?.email}</span>
                                </p>
                            </div>
                            <div className="homeTopStats">
                                <div className="statsDiv">
                                    <span className="statsSpan">
                                        URL shortened today:
                                        <span className="uiBold">
                                            {" "}
                                            {
                                                urls?.filter(u =>
                                                    (new Date(u.createdAt).toDateString()) ===
                                                    (new Date().toDateString())
                                                ).length
                                            }
                                        </span>
                                    </span>
                                    <span className="statsSpan">
                                        URL shortened this month:
                                        <span className="uiBold">
                                            {urlsThisMonth}
                                        </span>
                                    </span>
                                </div>
                                <Button onClick={handleShowCreateUrlShow}>
                                    Short new url
                                </Button>
                            </div>

                        </div>

                        <div className="homeBottom">
                            <p className="totalUrlText">
                                <span className="uiBold">{urls?.length}</span> total shortened urls
                            </p>
                            <Table striped bordered className='tableCenter'>
                                <thead>
                                    <tr>
                                        <th>Full URL</th>
                                        <th>Short URL</th>
                                        <th>Clicks</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {
                                        urls?.map(u =>
                                            <tr key={u._id}>
                                                <td>
                                                    <p className="urlStyle paraMaxWidth"
                                                        onClick={() => handleRedirect(u.fullUrl)}>
                                                        {u.fullUrl}
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="urlStyle"
                                                        onClick={() => fetchUrl(u.shortUrl)}>
                                                        {u.shortUrl}
                                                    </p>
                                                </td>
                                                <td>
                                                    <span className="uiBold">
                                                        {u.clicks}
                                                    </span>
                                                </td>
                                                <td>
                                                    {(new Date(u.createdAt)).toDateString()}
                                                </td>
                                                <td className='actionsTd'>
                                                    <span className="deleteIcon" onClick={() => handleShowDeleteUrlShow(u.shortUrl)}>
                                                        <AiFillDelete />
                                                    </span>
                                                    <span className="shareIcon"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText("ushrt.netlify.app/" + u.shortUrl);
                                                            setShowToast(true);
                                                        }
                                                        }>
                                                        <FaShareSquare />
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    }

                                </tbody>
                            </Table>
                        </div>
                    </div>

                </Container>
                <Modal show={showDeleteUrl} onHide={handleShowDeleteUrlClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Deleting URL?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to permanently delete this URL?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleShowDeleteUrlClose}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={handleDeleteUrl}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showCreateUrl} onHide={handleShowCreateUrlClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Short URL</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={formik.handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Full URL</Form.Label>
                                <Form.Control type="text" name="fullUrl" placeholder="Enter full URL"
                                    onChange={formik.handleChange} value={formik.values.fullUrl}
                                    onBlur={formik.handleBlur}
                                />
                                {
                                    formik.errors.fullUrl && formik.touched.fullUrl ?
                                        <Form.Text className="red">
                                            {formik.errors.fullUrl}
                                        </Form.Text> : null
                                }
                            </Form.Group>
                            <Button variant="primary" type='submit'>
                                Submit
                            </Button>
                        </Form>

                    </Modal.Body>
                </Modal>
                <Toast bg="success" onClose={() => setShowToast(false)} show={showToast} delay={1000} autohide>
                    <Toast.Body className='text-white'>Share Link copied to clipboard</Toast.Body>
                </Toast>
            </div>
    )
}
