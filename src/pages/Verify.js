import React, {useState} from 'react'
import Hoc from "../components/Hoc";
import Logo from "../components/Logo";
import { Row, Col } from "react-bootstrap";
import Button from '../components/Button'
import Authorization from '../tools/auth'
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

export default function Verify() {
  const passphrase = "witch collapse practice feed shame open despair creek road again ice least";
  const [cookies, setCookie] = useCookies(['isAuthenticated']);
  const removedIndex = [2,4,6,10]
  const [disableButton, setDisableButton] = useState(true)
  const [wordsFoundArray, setWordsFoundArray] = useState([])

  const setAuthorization = () => {
    setCookie('isAuthenticated', true, { path: '/' });
  }

  const removeWords = () => {
    const newPassphrase = []
    const passphraseSplit = passphrase.split(' ')
    for(const index in passphraseSplit){
      if(removedIndex.includes(parseInt(index)+1)){
        newPassphrase.push(null)
      } else {
        newPassphrase.push(passphraseSplit[index])
      }
    }
    return newPassphrase
  }

  const validateWord = (index, input) => {
    const wordsFound = wordsFoundArray
    const splitWords = passphrase.split(' ')
    if(splitWords[index] === input){
      wordsFound.push(input)
    } else {
      if(wordsFound.includes(splitWords[index])){
        const wordIndex = wordsFound.indexOf(splitWords[index])
        wordsFound.splice(wordIndex,1)
      }
    }
    setWordsFoundArray(wordsFound)
    if(!disableButton){
      if(wordsFound.length !== removedIndex.length ){
        setDisableButton(true)
      }
    } else {
      if(wordsFound.length === removedIndex.length){
        setDisableButton(false)
      }
    }
  }

  return (
    <Hoc className="main-container">
      <div className="block-container real-full-page-container">
        <div className="vertical-center">
          <Row>
            <Col xs={6} className="offset-md-3 full-width-align-center">
              <div>
                {/*<label>
                            Name:
                            <input type="number" name="progress" onChange={(e)=> {setprogress(e.currentTarget.value)}}  />
                        </label>*/}
              </div>
              <Logo big="true" />
              <div className="v-spacer" />
              <div className="v-spacer" />
              <h4 className="full-width-align-center strong">
              Verify your passphrase
              </h4>
              <div className="v-spacer" />
              <div className="verification-container">
              <Row>
              {
                removeWords().map((el,index) => {
                  return el!==null ? (<Col xs={3}>
                      {index+1} . {el}
                    </Col>) : (
                      <Col xs={3}>
                      {index+1} . <input className="validation-input" onChange={(e)=>validateWord(index,e.currentTarget.value)}/>
                      </Col>
                    )
                })
              }
              </Row>
              </div>
              <div className="v-spacer" />
              <Row>
                <Col>
                  <Button className="link-button" text="Go back" link={"/register-2"} />
                </Col>
                <Col>
                <Link to="/overview">
                  <Button
                    className={"lightGreenButton__fullMono"}
                    text="Next step"
                    link={"/overview"}
                    onClick={setAuthorization}
                    disabled={disableButton}
                  />
                </Link>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </Hoc>
  )
}
