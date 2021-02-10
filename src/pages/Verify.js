import React, {useState} from 'react'
import Hoc from "../components/Hoc";
import Logo from "../components/Logo";
import { Row, Col } from "react-bootstrap";
import Button from '../components/Button'
import Authorization, { storeSession } from '../tools/auth'
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import Footer from '../components/General/Footer';

export default function Verify() {
  const address = "nNdajndANoandaNOnna9210j21nsKANo";
  const privateKey = "aBUiadiaU219xSN8hska3j1ii3012i319jijdj1LLasdo";
  const passphrase = "witch collapse practice feed shame open despair creek road again ice least";
  const [cookies, setCookie] = useCookies(['isAuthenticated']);
  const removedIndex = [4,9,11]
  const [disableButton, setDisableButton] = useState(true)
  const [wordsFoundArray, setWordsFoundArray] = useState([])

  const setAuthorization = () => {
    // setCookie('isAuthenticated', true, { path: '/' });
    storeSession(address,passphrase,privateKey)
    location.replace('/overview')
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
      <div className="block-container real-full-page-container center">
        <div className="">
          <Row>
            <Col xs={8} className="offset-md-2 full-width-align-center">
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
                  return el!==null ? (<Col xs={3} className="validation-word-box">
                      <span className="validation-index">{index+1}.</span> <span className="validation-word">{el}</span>
                    </Col>) : (
                      <Col xs={3} className="validation-word-box" >
                      <span className="validation-index">{index+1}.</span> <input className="validation-input" onChange={(e)=>validateWord(index,e.currentTarget.value)}/>
                      </Col>
                    )
                })
              }
              </Row>
              </div>
              <div className="v-spacer" />
              <Row>
                <Col xs={6}>
                  <Button className="link-button" text="Go back" link={"/register-2"} />
                </Col>
                <Col>
                <Button
                  className={"lightGreenButton__fullMono margin-auto"}
                  text="Next step"
                  link={"/overview"}
                  onClick={setAuthorization}
                  disabled={disableButton}
                />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
    </Hoc>
  )
}
