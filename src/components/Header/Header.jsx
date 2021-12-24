import { NavLink } from "react-router-dom";
import { Nav, Container, Navbar } from "react-bootstrap";

import "./Header.css"
import { useContext } from "react";
import CommonContext from "../../contexts/CommonContext";

function Header() {

    const { isLoggedIn, setIsLoggedIn } = useContext(CommonContext);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
    }

    return <header className="headerMain">
        <Navbar className="headerNavbar" collapseOnSelect expand="lg" variant="dark">
            <Container>
                <NavLink className="headerNavbarLogo" to="/">URL-SHORTER</NavLink>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    </Nav>
                    <Nav>
                        {
                            isLoggedIn ? <div className="navLinks"
                                onClick={handleLogout} >Log-out</div> :
                                <>
                                    <NavLink exact activeStyle={{ color: "gold" }} className="navLinks"
                                        to="/login">Login</NavLink>
                                    <NavLink activeStyle={{ color: "gold" }} className="navLinks"
                                        to="/register">Register</NavLink>
                                </>

                        }

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>

}

export default Header;