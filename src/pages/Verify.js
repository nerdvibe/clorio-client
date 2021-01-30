import React from 'react'
import Hoc from "../components/Hoc";
import Logo from "../assets/Logo.svg";
import { Row, Col } from "react-bootstrap";
import Button from '../components/Button'
import Authorization from '../tools/auth'
import { useCookies } from 'react-cookie';

export default function Verify() {
  const passphrase = "witch collapse practice feed shame open despair creek road again ice least";
  const [cookies, setCookie] = useCookies(['isAuthenticated']);

  const setAuthorization = () => {
    setCookie('isAuthenticated', true, { path: '/' });
    location.reload()
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
              <img src={Logo} className="big-logo" />
              <div className="v-spacer" />
              <div className="v-spacer" />
              <h4 className="full-width-align-center strong">
              Verify your passphrase
              </h4>
              <div className="v-spacer" />
              <div className="verification-container">
              <Row>
              {
                passphrase.split(' ').map((el,index) => {
                  return (<Col xs={3}>
                      {index+1} . {el}
                    </Col>)
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
                  <Button
                    className="lightGreenButton__fullMono"
                    text="Next step"
                    link={"/overview"}
                    onClick={setAuthorization}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </Hoc>
  )
}
