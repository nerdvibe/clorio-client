import React from 'react'
import { useHistory } from 'react-router';
import Button from '../General/Button';
import ModalContainer from './ModalContainer';
import {PenTool,Check} from 'react-feather';

export default function TermsAndConditions(props) {
  const session = sessionStorage.getItem('terms-and-conditions');
  const history = useHistory();
  
  const acceptTermsAndConditions = () => {
    sessionStorage.setItem('terms-and-conditions',true);
    history.push("/");
  }

  return (
    <div className="mx-auto">
      <ModalContainer show={!session} className="big-modal-container">
          <h2 className="full-width-align-center"><PenTool/> &nbsp; Terms & Conditions</h2>
          <h5 className="align-center mx-auto">
            In order to start using Clorio, you have to accept our Terms & Conditions
          </h5>
          <div className="v-spacer" />
          <div class="terms">
              <h3>Updated Terms and Conditions</h3>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates nesciunt explicabo error saepe assumenda excepturi nobis, tenetur dolorem autem velit et officiis porro quisquam non. Sint eius iusto ipsam illo.</p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates nesciunt explicabo error saepe assumenda excepturi nobis, tenetur dolorem autem velit et officiis porro quisquam non. Sint eius iusto ipsam illo.</p>
              <h3>Our Programs</h3>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates nesciunt explicabo error saepe assumenda excepturi nobis, tenetur dolorem autem velit et officiis porro quisquam non. Sint eius iusto ipsam illo.</p>
      
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates nesciunt explicabo error saepe assumenda excepturi nobis, tenetur dolorem autem velit et officiis porro quisquam non. Sint eius iusto ipsam illo.</p>
      
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates nesciunt explicabo error saepe assumenda excepturi nobis, tenetur dolorem autem velit et officiis porro quisquam non. Sint eius iusto ipsam illo.</p>
      
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates nesciunt explicabo error saepe assumenda excepturi nobis, tenetur dolorem autem velit et officiis porro quisquam non. Sint eius iusto ipsam illo.</p>
      
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates nesciunt explicabo error saepe assumenda excepturi nobis, tenetur dolorem autem velit et officiis porro quisquam non. Sint eius iusto ipsam illo.</p>
      
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates nesciunt explicabo error saepe assumenda excepturi nobis, tenetur dolorem autem velit et officiis porro quisquam non. Sint eius iusto ipsam illo.</p>
      
          </div>
          <div className="v-spacer" />
          <div className="v-spacer" />
          <Button
            className="lightGreenButton__fullMono mx-auto"
            onClick={acceptTermsAndConditions}
            text="Accept"
            icon={<Check />}
          />
        </ModalContainer>
      </div>
  )
}
