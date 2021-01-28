import React from 'react'
import Banner from '../components/Banner'
import StakeTable from '../components/StakeTable'
import Wallet from '../components/Wallet'
import Button from '../components/Button'
import Hoc from '../components/Hoc'
import Modal from '../components/Modal'
import {Row,Col} from 'react-bootstrap'

export default class Stake extends React.Component {
    state={
        delegateName:'',
        showModal:false 
    }

    render(){
        return (
            <Hoc className="mx-auto">
                <Wallet />
                <Banner />
                <StakeTable toggleModal={(delegateName) => this.openModal(delegateName)}/>
                <Modal show={this.state.showModal} close={() => this.toggleModal}>
                    {this.renderModal()}
                </Modal>
            </Hoc>
        )
    }

    openModal = (delegateName) => {
        this.setState({
            delegateName,
            showModal:!this.state.showModal
        })
    }

    toggleModal = () => {
        this.setState({
            showModal:!this.state.showModal
        })
    }

    confirmDelegate = () => {
        console.log("Delegate confirmed")
        this.setState({
            showModal:!this.state.showModal
        })
    }

    renderModal = () => {
        return(
            <div className="mx-auto">
                <h2>Confirm Delegation</h2>
                <div className="v-spacer"/>
                <h4>Are you sure you want to <br/> 
                delegate this stake to {this.state.delegateName}</h4>
                <div className="v-spacer"/>
                <Row>
                    <Col xs={6} >
                        <Button onClick={() => this.toggleModal()} className="link-button" text="Cancel"/>
                    </Col>
                    <Col xs={6} >
                        <Button onClick={() => this.confirmDelegate()} className="lightGreenButton__fullMono" text="Confirm" />
                    </Col>
                </Row>
            </div>
        )
    }
}
