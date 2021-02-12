import React,{useState,useEffect} from 'react'
import {Row,Col} from 'react-bootstrap'
import Button from '../components/Button'
import {Copy} from 'react-feather'
import { getAddress } from '../tools'
// import Avatar from '../tools/avatar'

export default function Wallet() {

    const [address, setaddress] = useState("")

    useEffect(() => {
        if (!address) {
            getAddress((data)=>{
                setaddress(data)
            });
        }
    }, [])
    
    function copyToClipboard (content) {
        const el = document.createElement('textarea');
        el.value = content;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };
    // <Avatar address={address} size="80" />
    return (
        <div className="block-container">
            <div className="align-left">
                <div className="inline-block-element walletImageContainer">
                    <div className="walletImageOutline"> 
                        <img className="walletImage" src="https://via.placeholder.com/100.png" />
                    </div>
                </div>
                <div className="inline-block-element wallet-data">
                    <Row>
                        <Col xs={12}>
                            <h6 className="secondaryText">This is your address</h6>
                            <h4>
                                {address} &nbsp;
                                <Button className="inline-element" icon={<Copy />}  onClick={() => copyToClipboard(address)}/>
                            </h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="inline-block-element" >
                                <h6 className="secondaryText">Your balance</h6> 
                                <h5>1.2313219 MINA</h5>
                            </div>
                            <div className="inline-block-element" >
                                <div className="v-div"/>
                            </div>
                            <div className="inline-block-element" >
                                <span>
                                    <h6 className="secondaryText">Apx balance</h6>
                                    <h5>1.2313219 BTC</h5>
                                </span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
