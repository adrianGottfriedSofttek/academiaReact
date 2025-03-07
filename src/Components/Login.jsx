import { Button,Input,Row, Col} from 'antd';
import React, { useEffect, useState } from 'react'
import { singinUser } from '../Config/authCall';
import { useAuth } from '../hooks/userAuth';
import { useNavigate } from 'react-router-dom';


export default function Login({mail}) {
  const [userName, setUserName] = useState(mail);
  const [password,setPassword] = useState('');
  const {user} = useAuth();
  const navigate =useNavigate();
  

  //redireccionar a navbar cuando se logea 3/3/2025
  useEffect (() => {
    if(user) navigate ('/navbar');
  },[user]);

  const changeName = (Inputvalue) => {
    setUserName(Inputvalue.target.value);
  }
  const changePassword = (Inputvalue) => {
    setPassword(Inputvalue.target.value);
  }
  const login= () => {
   singinUser(userName,password);
  }

  return (
    <div>
      
      <Row>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Input 
            size='small' 
            placeholder='Correo del usuario'
            value={userName}
            onChange={changeName}
         ></Input>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Input.Password 
            size='small'
            placeholder='Contraseña'
            value={password}
            onChange={changePassword}
      ></Input.Password>
        </Col>

      </Row>
      <Button onClick={login}>Login</Button>
       
    </div>
   
  );
}

