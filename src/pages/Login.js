import React from 'react'
import {Row,Col, Spinner} from 'react-bootstrap'
import {Link, useHistory} from 'react-router-dom'
import Button from '../components/Button'
import Hoc from '../components/Hoc'
import Logo from "../components/Logo";
import Footer from '../components/General/Footer'
import { useState , useEffect } from 'react'
import { storeSession } from '../tools'
import Input from '../components/Input'
import Alert from '../components/General/Alert'
import * as CodaSDK from "@o1labs/client-sdk";
import { useQuery, gql } from '@apollo/client';

const GET_ID = gql`
    query GetIDFromPublicKey($publicKey:String) {
        public_keys(where: {value: {_eq: $publicKey}}) {
            id
        }
    }
`

export default function Login(props) {
    const [passphrase, setpassphrase] = useState("")
    const [publicKey, setPublicKey] = useState("")
    const [showAlert, setShowAlert] = useState(false)
    const [loader, setLoader] = useState(false)
    const history = useHistory();

    const userID = useQuery(GET_ID, {
        variables: { publicKey:publicKey }
    });

    
    useEffect(() => {
        if(publicKey && publicKey!==""){
            if(userID.data && userID.data.public_keys.length>0){
                props.setLoader()
                const id = userID.data.public_keys[0].id;
                storeSession(publicKey,id,()=>{history.push("/overview")})
            } else {
                props.setLoader()
                storeSession(publicKey,-1,()=>{
                    history.push("/overview")
                })
            }
        }
    }, [publicKey])

    return (
        <Hoc>
            <Spinner show={loader}>
                <div className="block-container no-bg real-full-page-container center">
                    <div className="full-width">
                        <Row>
                            <Col md={4} xl={6} className="offset-md-3 offset-xl-3 text-center" >
                                <div className="mx-auto fit-content"><Logo big="true" /></div>
                                <div className="v-spacer" />
                                <h4 className="full-width-align-center">Sign in with your passphrase</h4>
                                <h6 className="full-width-align-center">Don't have an account? <Link to="/register"><Button className="link-button inline-element" onClick={props.register} text="Sign-in" /></Link></h6>
                                <div className="v-spacer" />
                                <div className="v-spacer" />
                                <Input inputHandler={inputHandler} placeholder="Enter here"/>
                                <div className="v-spacer" />
                                <Row>
                                    <Col xs={6}>
                                        <Link to="/">
                                            <Button className="link-button mx-auto" onClick={props.register} text="Cancel" />
                                        </Link>
                                    </Col>
                                    <Col xs={6}>
                                        <Button 
                                            className="lightGreenButton__fullMono mx-auto" 
                                            onClick={checkCredentials} 
                                            text="Access a wallet"
                                            disabled={disableButton()}
                                            />
                                    </Col>
                                </Row>
                                <div className="v-spacer" />
                                <div className="v-spacer" />
                            </Col>
                        </Row>
                    </div> 
                </div>
                <Alert show={showAlert} hideToast={() => setShowAlert(false)} type={"error-toast"}>
                    Private key not valid, please try again.
                </Alert>
                <Footer />
            </Spinner>
        </Hoc>
    )

    function renderLedgerLogin(){
        return(
            <Link to="/ledger">
                <Button 
                    className="link-button mx-auto" 
                    onClick={props.register} 
                    text="Login through a hardware wallet" 
                    />
            </Link>
        )
    }

    function inputHandler (e) {
        setpassphrase(e.currentTarget.value)
    }

    function checkCredentials () {
        try{
            const publicK = CodaSDK.derivePublicKey(passphrase)
            setPublicKey(publicK)
            setLoader(true)
        }catch(e){
            setShowAlert(true)
        }
    }

    function disableButton () {
        if(!passphrase){
            return true;
        }
        if(passphrase === ""){
            return true;
        }
        return false
    }
}
