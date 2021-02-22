import React,{useState} from 'react'
import Hoc from '../components/Hoc'
import SignMessageForm from '../components/SignMessageForm'
import Wallet from '../components/Wallet'
import Alert from '../components/General/Alert'
import { getAddress } from '../tools'
import * as CodaSDK from "@o1labs/client-sdk";

export default function SignMessage() {
  const [message, setMessage] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [publicKey, setPublicKey] = useState("")
  const [show, setShow] = useState(false);
  const [result, setResult] = useState(undefined);

  getAddress((data)=>{
    setPublicKey(data)
  })

  return (
    <Hoc>
      <Wallet />
      <SignMessageForm 
        message={message}
        privateKey={privateKey}
        setMessage={setMessage}
        setPrivateKey={setPrivateKey}
        disableButton={signButtonStateHandler}
        submitHandler={submitHandler}
        result={result}
        reset={resetForm}
        />
        <Alert show={show} hideToast={()=>setShow(false)} type={"error-toast"}>
          Please check private key
        </Alert>
    </Hoc>
  )

  function signButtonStateHandler(){
    const checkCondition = message==="" || privateKey==="" || publicKey===""
    return checkCondition;
  }

  function submitHandler(){
    try{
      if(!signButtonStateHandler()){
        const keypair = {
          publicKey,
          privateKey
        }
        
        const signedMessage = CodaSDK.signMessage(message, keypair);
        setResult(signedMessage)
      }
    }
    catch(e){
      setShow(true)
    }
  }

  function resetForm(){
    setPrivateKey("")
    setResult(undefined)
    setMessage("")
  }
}
