import { gql, useQuery } from '@apollo/client';
import React,{useEffect,useState} from 'react'
import { getId, updateUser } from '../tools'

const GET_ID = gql`
    query GetIDFromPublicKey($publicKey:String) {
        public_keys(where: {value: {_eq: $publicKey}}) {
            id
        }
    }
`


export default function UpdateUserID(props) {
  const [address, setaddress] = useState("")
  const userID = useQuery(GET_ID, {
      variables: { publicKey:address }
  });

  if(userID.data && userID.data.public_key && userID.data.public_key.length>0){
    updateUser(address,userID.data.public_key[0].id);
    setaddress(undefined)
  }


  getId((id)=>{
    if(id===-1){
      if(props.sessionData && props.sessionData.address){
        setaddress(props.sessionData.address)
      }
    }
  })


  return (
    <div />
  )
}
