import React from "react";
import {Nav} from "react-bootstrap";
import { withRouter } from "react-router";
import '../pages/style/Dashboard.css'
import { Link } from 'react-router-dom';
import {  Cpu } from 'react-feather';
import { useCookies } from 'react-cookie';
import Logo from '../Logo.svg'

const Side = props => {
    const [cookies, setCookie, removeCookie] = useCookies(['isAuthenticated']);

    const logout = () => {
        removeCookie('isAuthenticated');
        location.replace('/overview')
    }
    return (
        <>
            <div style={{padding:'10px'}}>
                <Nav className="col-md-12 d-none d-md-block bg-light sidebar level-zero"
                    activeKey="/home"
                    onSelect={selectedKey => alert(`selected ${selectedKey}`)}>
                    <div className="sidebar-sticky" style={{margin:'0 auto'}}>
                        <h3><img src={Logo} /></h3>
                        {/* <img src="" alt="logo"/> */}
                    </div>
                    <hr/>
                    <Nav.Item>
                        <Link to="/overview"> <span className="sidebar-item selected-item"><Cpu /> Overview</span></Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/send-tx"> <span className="sidebar-item">Send TX</span></Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/stake"> <span className="sidebar-item">Stake</span></Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/splashscreen"> <span className="sidebar-item" onClick={logout}>Logout</span> </Link>
                    </Nav.Item>
                </Nav>
            </div>
        </>
    );
};
const Sidebar = withRouter(Side);
export default Sidebar