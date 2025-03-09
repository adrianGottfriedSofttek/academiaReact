import {Layout, Row, Col, Typography, Button, Avatar } from 'antd'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/userAuth'
import { LogoutOutlined,UserOutlined,UnorderedListOutlined } from '@ant-design/icons';
import { readData } from '../Config/realtimeCalls';
import { readDataFirestore } from '../Config/firestoreCalls';
import { useNavigate } from 'react-router-dom';
import TaskList from './TaskList';

const{Header, Content} =Layout;
const {Title} = Typography;

export default function Navbar() {
    const {logout, user} = useAuth();
    const[localUser, setLocalUser] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
      if (user){
        readUser();
      }
    },[user]);

    const readUser= async() =>{
      const luser = await readData('users','email',user.email);
      if(luser.val()){    
        console.log(luser.val()[Object.keys(luser.val())[0]]);
        
      }
      const luser2 = await readDataFirestore('users','email',user.email);
      if(!luser2.empty){
        setLocalUser(luser2.docs[0].data());
      }
      
    };

    const handleLogout = () => {
      logout();
      navigate('/login');
    };
    
   
  return (

    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        position: 'fixed', 
        zIndex: 1, 
        width: '100%',
        background: 'linear-gradient(to right, #667eea, #764ba2)'
      }}>
          <Row justify="space-between" align="middle">
          <Col>
            <Title 
              level={3} 
              style={{ 
                margin: 0, 
                color: 'white',
                display: 'flex',
                alignItems: 'center'
              }}
              >
              <UnorderedListOutlined style={{ marginRight: '10px' }} />
              Lista de Tareas
              </Title>
              </Col>
          <Col>
            <Row align="middle" gutter={16}>
              <Col>
                <div style={{ color: 'white' }}>
                  {localUser ? (
                    <span>{localUser.name || user.email}</span>
                  ) : (
                    <span>{user?.email}</span>
                  )}
                </div>
              </Col>

              <Col>
                <Avatar icon={<UserOutlined />} />
              </Col>
              <Col>
                <Button 
                  type="text" 
                  icon={<LogoutOutlined />} 
                  onClick={handleLogout}
                  style={{ color: 'white' }}
                >
                  Salir
                </Button>
              </Col>
            </Row>
          </Col>
        </Row> 
      </Header>
                
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <div 
          style={{ 
            padding: 24, 
            minHeight: 380, 
            background: '#fff',
            borderRadius: '5px',
            marginTop: '20px'
          }}
        >
          <TaskList />
        </div>
      </Content>
    </Layout>


    //<div style={{textAlign: 'right'}}>
              //  {localUser && <>{localUser.name}</>}
              //  <LogoutOutlined onClick={handleLogout}></LogoutOutlined>            
    //</div>
  );
}
