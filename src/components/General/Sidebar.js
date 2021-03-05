import React from "react";
import {Nav} from "react-bootstrap";
import { useHistory } from "react-router";
import { Link } from 'react-router-dom';
import {  Cpu,LogIn,TrendingUp,Edit3,Check } from 'react-feather';
import Logo from '../Logo'
import { useLocation } from 'react-router-dom'
import { clearSession } from "../../tools";


function Sidebar (props) {
    const history = useHistory();
    let networkData;
    if(props.network && props.network.nodeInfo){
        networkData = props.network.nodeInfo
    }
    return (
        <div style={{padding:'5px'}}>
            <Nav className="col-md-12 d-none d-md-block sidebar level-zero"
                activeKey="/home"
                onSelect={selectedKey => alert(`selected ${selectedKey}`)}>
                <div className="sidebar-sticky" style={{margin:'0 auto'}}> 
                    <Logo />
                </div>
                <hr/>
                <Nav.Item className={"sidebar-item-container " + checkRoute('overview')}>
                    <Link to="/overview" className="sidebar-item selected-item"> <span ><Cpu /> Overview</span></Link>
                </Nav.Item>
                <Nav.Item className={"sidebar-item-container " + checkRoute('send-tx')}>
                    <Link to="/send-tx" className="sidebar-item"> <span ><LogIn /> Send TX</span></Link>
                </Nav.Item>
                <Nav.Item className={"sidebar-item-container " + checkRoute('stake')}>
                    <Link to="/stake" className="sidebar-item"> <span><TrendingUp /> Staking Hub</span></Link>
                </Nav.Item>
                <Nav.Item className={"sidebar-item-container " + checkRoute('sign-message')}>
                    <Link to="/sign-message" className="sidebar-item"> <span><Edit3 /> Sign message</span></Link>
                </Nav.Item>
                <Nav.Item className={"sidebar-item-container " + checkRoute('verify-message')}>
                    <Link to="/verify-message" className="sidebar-item"> <span><Check /> Verify message</span></Link>
                </Nav.Item>
                <Nav.Item className="sidebar-item-container sidebar-footer">
                    <Link to="/" className="sidebar-item"> <strong> <span onClick={logout}>Logout</span></strong> </Link>
                </Nav.Item>
                <div className="sidebar-footer-network">{renderNetwork()} {renderStatusDot()}</div>
            </Nav>
        </div>
    );

    function logout() {
        props.setLoader()
        clearSession()
        history.push("/overview");
    }

    function checkRoute(route)  {
        const location = useLocation();
        const currentRoute = location.pathname.toLowerCase();
        return currentRoute.includes(route) ? " sidebar-item-container-active" : " ";
    }

    function renderNetwork(){
        if(networkData){
            return (<div>{networkData.name } | {networkData.network}</div>)
        }
        return "Network unavailable"
    }
    
    function renderStatusDot(){
        if(networkData){
            return (
                <span className="green-dot" />
            )
        } else {
            return (
                <span className="red-dot" />
            )
        }
    }
};

export default Sidebar;