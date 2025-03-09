import { Button,Input,Row, Col,Form,message,Spin} from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { singinUser } from '../Config/authCall';
import { useAuth } from '../hooks/userAuth';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
  
  body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-attachment: fixed;
    background-size: cover;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const formAppear = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
  position: relative;
  overflow: hidden;
  width: 100%;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 20%),
                      radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 20%);
    top: 0;
    left: 0;
  }
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  padding: 40px 30px;
  animation: ${formAppear} 0.6s ease-out;
  position: relative;
  z-index: 1;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 60%);
    top: -50%;
    left: -50%;
    z-index: -1;
    transform: rotate(25deg);
    transition: all 1.5s;
    animation: shimmer 3s infinite;
  }
  
   @keyframes shimmer {
    0% {
      transform: translateX(-150%) rotate(25deg);
    }
    100% {
      transform: translateX(150%) rotate(25deg);
    }
  }
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.5px;
  position: relative;
  padding-bottom: 12px;
  
  &::after {
    content: '';
    position: absolute;
    width: 60px;
    height: 4px;
    background: linear-gradient(to right, #667eea, #764ba2);
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 2px;
  }
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.delay || '0s'};
`;

const StyledInputGroup = styled.div`
  margin-bottom: 20px;
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: ${props => props.delay || '0s'};
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  animation: ${fadeIn} 0.3s ease-out;
  font-weight: 500;
`;

const LoginButton = styled(Button)`
  width: 100%;
  height: 45px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(24, 144, 255, 0.3);
  background: linear-gradient(to right, #667eea, #764ba2);
  border: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(24, 144, 255, 0.4);
    background: linear-gradient(to right, #5a72e2, #6a42a0);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: 0.4s;
`;

const AnimatedInput = styled(Input)`
  border-radius: 8px;
  height: 45px;
  transition: all 0.3s;
  border: 2px solid #e0e0e0;
  
  &:hover, &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
  
  .ant-input-prefix {
    font-size: 18px;
    color: #667eea;
    margin-right: 10px;
  }
`;

const AnimatedPasswordInput = styled(Input.Password)`
  border-radius: 8px;
  height: 45px;
  transition: all 0.3s;
  border: 2px solid #e0e0e0;
  
  &:hover, &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
  
  .ant-input-prefix {
    font-size: 18px;
    color: #667eea;
    margin-right: 10px;
  }
`;

export default function Login({mail}) {
  const [userName, setUserName] = useState(mail || '');
  const [password,setPassword] = useState('');
  const {user} = useAuth();
  const navigate =useNavigate();

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  //redireccionar a navbar cuando se logea 3/3/2025
  useEffect (() => {
    if(user) navigate ('/navbar');
  },[user,navigate]);

  //
  const changeName = (Inputvalue) => {
    setUserName(Inputvalue.target.value);
    if (error) setError('');
  };

  const changePassword = (Inputvalue) => {
    setPassword(Inputvalue.target.value);
    //
    if (error) setError('');
  }

  //
  const login = async (e) => {
    if (e) e.preventDefault();


   // Validación básica
    if (!userName || !password) {
     setError('Por favor completa todos los campos');
      return;
  }
  
  setIsSubmitting(true);
  setError('');
  
  try {
    // Intentar iniciar sesión
    const result = await singinUser(userName, password);
  //
      setLoginSuccess(true);
      } catch (err) {
        console.error('Error de inicio de sesión:', err);
        setError('Usuario o contraseña incorrectos');
        setLoginSuccess(false);
        setPassword('');
      } finally {
     setIsSubmitting(false);
      }
  };

  return (
   <>
    <GlobalStyle />
    <LoginContainer>
      <FormCard>
        <FormTitle>Lista de Treas</FormTitle>
        <Form  onSubmit={login}>
          <Row gutter={[0, 16]} >
            <Col span={24}>
            <StyledInputGroup delay="0.1s">
              <InputLabel delay="0.1s">Usuario</InputLabel>
              <AnimatedInput
              size='large'
              placeholder='Correo del usuario'
              value={userName}
              onChange={changeName}
              prefix={<UserOutlined />}
              autoComplete="username"
              >
              </AnimatedInput>
            </StyledInputGroup>
            </Col>
            
            <Col span={24}>
            <StyledInputGroup delay="0.2s">
                <InputLabel delay="0.2s">Contraseña</InputLabel>
                <AnimatedPasswordInput
                  size='large'
                  placeholder='Contraseña'
                  value={password}
                  onChange={changePassword}
                  prefix={<LockOutlined />}
                  autoComplete="current-password"
                ></AnimatedPasswordInput>
             </StyledInputGroup>
            </Col>

            {error && (
              <Col span={24}>
                <ErrorMessage>
                  {error}
                </ErrorMessage>
              </Col>
            )}

            <Col span={24} style={{ textAlign: 'center' }}>
              <LoginButton
                onClick={login} 
                type="primary" 
                loading={isSubmitting}
                icon={<LoginOutlined />}
              >
                {isSubmitting ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
              </LoginButton>
            </Col>
          </Row>
        </Form>
      </FormCard>
    </LoginContainer>

  
    </>
  );
}

