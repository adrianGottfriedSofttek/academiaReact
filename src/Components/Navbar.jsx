import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout,Row, Col, Typography, Button, Avatar, Input, Card, Empty, Spin, Pagination, Popconfirm,message } from 'antd';
import { LogoutOutlined, UserOutlined, UnorderedListOutlined, DeleteOutlined, EditOutlined, PlusOutlined  } from '@ant-design/icons';
import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc,query,orderBy,getDocs } from 'firebase/firestore';
import { useAuth } from '../hooks/userAuth';
import { readData } from '../Config/realtimeCalls';
import { readDataFirestore } from '../Config/firestoreCalls';
import { formatearFecha, convertirAFecha } from '../utils/dateFormatter';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

const { Header, Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

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

// Animations
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

// Styled Components
const StyledHeader = styled(Header)`
  position: fixed;
  z-index: 1;
  width: 100%;
  background: linear-gradient(to right, #667eea, #764ba2);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  padding: 0 20px;
`;

const NavTitle = styled(Title)`
  margin: 0;
  color: white;
  display: flex;
  align-items: center;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
`;

const UserInfo = styled.div`
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const StyledAvatar = styled(Avatar)`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  margin: 0 10px;
`;

const LogoutBtn = styled(Button)`
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const ContentWrapper = styled(Content)`
  padding: 0 50px;
  margin-top: 64px;
`;

const MainCard = styled.div`
  padding: 24px;
  min-height: 380px;
  background: #fff;
  border-radius: 15px;
  margin-top: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: ${formAppear} 0.6s ease-out;
`;

const TaskFormCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  border: none;
  animation: ${formAppear} 0.6s ease-out;
  
  .ant-card-head {
    background: linear-gradient(to right, #667eea, #764ba2);
    color: white;
    border-bottom: none;
  }
  
  .ant-card-head-title {
    font-weight: 700;
    letter-spacing: 0.5px;
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

const StyledInput = styled(Input)`
  border-radius: 8px;
  height: 40px;
  transition: all 0.3s;
  border: 2px solid #e0e0e0;
  
  &:hover, &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
`;

const StyledTextArea = styled(TextArea)`
  border-radius: 8px;
  transition: all 0.3s;
  border: 2px solid #e0e0e0;
  
  &:hover, &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
`;

const ActionButton = styled(Button)`
  border-radius: 8px;
  height: 40px;
  font-weight: 500;
  
  &.primary {
    background: linear-gradient(to right, #667eea, #764ba2);
    border: none;
    box-shadow: 0 4px 10px rgba(24, 144, 255, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(24, 144, 255, 0.4);
      background: linear-gradient(to right, #5a72e2, #6a42a0);
    }
    
    &:active {
      transform: translateY(1px);
    }
  }
`;

const TaskListContainer = styled.div`
  background: #f7f9fc;
  padding: 20px;
  border-radius: 15px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.5s ease-out;
`;

const TaskListTitle = styled.h2`
  margin-bottom: 20px;
  text-align: center;
  color: #333;
  font-weight: 700;
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

const TaskCard = styled(Card)`
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .ant-card-meta-title {
    color: #333;
    font-weight: 600;
  }
  
  .ant-card-meta-description {
    color: #666;
  }
  
  .ant-card-actions {
    background: #f7f9fc;
    border-top: 1px solid #eee;
  }
`;

const TaskMeta = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #eee;
`;

export default function Navbar() {
  const { logout, user } = useAuth();
  const [localUser, setLocalUser] = useState(null);
  const navigate = useNavigate();

  // Estados para manejo de tareas
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPermissions, setUserPermissions] = useState(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    if (user) {
      readUser();
      fetchTasks();
    }
  }, [user]);

  const readUser = async () => {
    try {
      const luser = await readData('users', 'email', user.email);
      if (luser.val()) {
        console.log(luser.val()[Object.keys(luser.val())[0]]);
      }
      
      const luser2 = await readDataFirestore('users', 'email', user.email);
      if (!luser2.empty) {
        const userData = luser2.docs[0].data();
        setLocalUser(userData);
        setUserPermissions(userData.permissions || "read");
      } else {
        setUserPermissions("read");
      }
    } catch (error) {
      console.error("Error al leer datos de usuario:", error);
      setUserPermissions("read"); // Valor por defecto en caso de error
    }
  };

  const handleLogout = () => {
    logout();
    
    window.location.href = '/login';
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      
      const db = getFirestore();
      const tasksCollection = collection(db, 'tasks');
      const tasksSnapshot = await getDocs(tasksCollection);
      
      if (!tasksSnapshot.empty) {
        const taskList = tasksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(taskList);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!title.trim() || !content.trim()) {
      message.warning('Por favor completa todos los campos');
      return;
    }

    try {
      // Preparar la nueva tarea
      const newTask = {
        title,
        content,
        creator: user.email,
        creatorName: localUser?.name || user.email,
        created_at: new Date()
      };
      
      // Obtener la instancia de Firestore
      const db = getFirestore();
      
      // Agregar la tarea a Firestore 
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      
      // Actualizar con el ID de la tarea
      await updateDoc(doc(db, 'tasks', docRef.id), {
        id_task: docRef.id
      });
      
      // Limpiar el formulario
      setTitle('');
      setContent('');
      
      // Actualizar la lista de tareas
      fetchTasks();
      
      message.success('Tarea creada con éxito');
    } catch (error) {
      console.error("Error al crear tarea:", error);
      message.error("No se pudo crear la tarea");
    }
  };

  const startEdit = (task) => {
    setEditTask(task);
    setTitle(task.title);
    setContent(task.content);
  };

  const updateTask = async () => {
    if (!editTask) return;
    
    try {
      // Obtener la instancia de Firestore
      const db = getFirestore();
      
      // Actualizar la tarea en Firestore
      const taskRef = doc(db, 'tasks', editTask.id_task);
      await updateDoc(taskRef, {
        title,
        content,
        updated_at: new Date()
      });
      
      // Limpiar el formulario
      setEditTask(null);
      setTitle('');
      setContent('');
      
      // Actualizar la lista de tareas
      fetchTasks();
      
      message.success('Tarea actualizada con éxito');
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      message.error("No se pudo actualizar la tarea");
    }
  };

  const cancelEdit = () => {
    setEditTask(null);
    setTitle('');
    setContent('');
  };

  const deleteTask = async (taskId) => {
    try {
     
      const db = getFirestore();
      
      // Eliminar la tarea de Firestore
      await deleteDoc(doc(db, 'tasks', taskId));
      
      // Actualizar la lista de tareas
      fetchTasks();
      
      message.success('Tarea eliminada con éxito');
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      message.error("No se pudo eliminar la tarea");
    }
  };

  // Paginación
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const paginatedTasks = tasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Verificar permisos
  const canWrite = userPermissions === "write" || userPermissions === "delete";
  const canDelete = userPermissions === "delete";

  // Función para formatear fechas
  const formatDate = (date) => {
    return formatearFecha(date);
  };

  return (
    <>
      <GlobalStyle />
      <Layout style={{ minHeight: '100vh' }}>
        <StyledHeader>
          <Row justify="space-between" align="middle">
            <Col>
              <NavTitle level={3}>
                <UnorderedListOutlined style={{ marginRight: '10px' }} />
                Lista de Tareas
              </NavTitle>
            </Col>
            <Col>
              <Row align="middle" gutter={16}>
                <Col>
                  <UserInfo>
                    {localUser ? (
                      <span>{localUser.name || user.email}</span>
                    ) : (
                      <span>{user?.email}</span>
                    )}
                  </UserInfo>
                </Col>
                <Col>
                  <StyledAvatar icon={<UserOutlined />} />
                </Col>
                <Col>
                  <LogoutBtn 
                    type="text" 
                    icon={<LogoutOutlined />} 
                    onClick={handleLogout}
                  >
                    Salir
                  </LogoutBtn>
                </Col>
              </Row>
            </Col>
          </Row>
        </StyledHeader>
        
        <ContentWrapper>
          <MainCard>
            <Row gutter={[24, 24]}>
              {/* Sección solo visible si tiene permisos */}
              {canWrite && (
                <Col xs={24} md={8}>
                  <TaskFormCard 
                    title={editTask ? "Editar Tarea" : "Crear Nueva Tarea"}
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <InputLabel delay="0.1s">Título:</InputLabel>
                      <StyledInput
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Título de la tarea"
                      />
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <InputLabel delay="0.2s">Contenido:</InputLabel>
                      <StyledTextArea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Descripción de la tarea..."
                        rows={4}
                      />
                    </div>
                    
                    <ActionButton
                      type="primary"
                      onClick={editTask ? updateTask : createTask}
                      disabled={!title || !content}
                      block
                      style={{ marginBottom: editTask ? '8px' : '0' }}
                      className="primary"
                      icon={editTask ? <EditOutlined /> : <PlusOutlined />}
                    >
                      {editTask ? "Actualizar" : "Crear Tarea"}
                    </ActionButton>
                    
                    {editTask && (
                      <ActionButton
                        onClick={cancelEdit}
                        block
                      >
                        Cancelar
                      </ActionButton>
                    )}
                  </TaskFormCard>
                </Col>
              )}
              
              {/* lista de tareas */}
              <Col xs={24} md={canWrite ? 16 : 24}>
                <TaskListContainer>
                  <TaskListTitle>Tareas</TaskListTitle>
                  
                  {loading ? (
                    <div style={{ textAlign: 'center', margin: '40px 0' }}>
                      <Spin size="large" />
                    </div>
                  ) : paginatedTasks.length > 0 ? (
                    <Row gutter={[16, 16]}>
                      {paginatedTasks.map((task, index) => (
                        <Col xs={24} sm={12} md={canWrite ? 12 : 8} key={index}>
                          <TaskCard
                            hoverable
                            actions={[
                              // Botón de editar 
                              (canWrite && task.creator === user.email || canDelete) && (
                                <Button 
                                  type="text" 
                                  icon={<EditOutlined />}
                                  onClick={() => startEdit(task)}
                                />
                              ),
                              // Botón de eliminar 
                              canDelete && (
                                <Popconfirm
                                  title="¿Eliminar esta tarea?"
                                  description="Esta acción no se puede deshacer"
                                  onConfirm={() => deleteTask(task.id_task)}
                                  okText="Sí"
                                  cancelText="No"
                                >
                                  <Button 
                                    type="text" 
                                    danger 
                                    icon={<DeleteOutlined />}
                                  />
                                </Popconfirm>
                              )
                            ].filter(Boolean)}
                          >
                            <Card.Meta
                              title={task.title}
                              description={
                                <div>
                                  <p style={{ marginBottom: '10px' }}>{task.content}</p>
                                  <TaskMeta>
                                    <p>Creador: {task.creatorName || task.creator}</p>
                                    <p>Fecha: {formatDate(task.created_at)}</p>
                                  </TaskMeta>
                                </div>
                              }
                            />
                          </TaskCard>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Empty description="No hay tareas disponibles" />
                  )}
                  
                  {tasks.length > 0 && (
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                      <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={tasks.length}
                        onChange={handlePageChange}
                      />
                    </div>
                  )}
                </TaskListContainer>
              </Col>
            </Row>
          </MainCard>
        </ContentWrapper>
      </Layout>
    </>
    
  );
}
