import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavbarCom(){

  return(
    <Navbar bg="primary" variant="dark" ms-left>
        <div className='ml-2'>
            <Navbar.Brand   href="/">&nbsp;&nbsp;&nbsp;GeoLoc Pharma</Navbar.Brand>
        </div>
      
        <Nav className=" ">
          <Nav.Link as={Link} to="/">Accueil</Nav.Link>
          <Nav.Link as={Link} to="/Zone">Zone</Nav.Link>
          <Nav.Link as={Link} to="/City">City</Nav.Link>
          <Nav.Link as={Link} to="/Pharmacy">Pharmacy</Nav.Link>
          <Nav.Link as={Link} to="/Garde">Gardes</Nav.Link>
          
          
        </Nav>
     
    </Navbar>
  );
}

export default NavbarCom;