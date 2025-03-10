import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout,Row, Col, Typography, Button, Avatar, Input, Card, Empty, Spin, Pagination, Popconfirm,message } from 'antd';
import { LogoutOutlined, UserOutlined, UnorderedListOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc,query,orderBy,getDocs } from 'firebase/firestore';
import { useAuth } from '../hooks/userAuth';
import { readData } from '../Config/realtimeCalls';
import { readDataFirestore } from '../Config/firestoreCalls';
import { formatearFecha, convertirAFecha } from '../utils/dateFormatter';

const { Header, Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

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
    navigate('/login');
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
          <Row gutter={[16, 16]}>
            {/* Sección solo visible si tiene permisos */}
            {canWrite && (
              <Col xs={24} md={8}>
                <Card 
                  title={editTask ? "Editar Tarea" : "Crear Nueva Tarea"}
                  style={{ marginBottom: '20px' }}
                >
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                      Título:
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Título de la tarea"
                    />
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                      Contenido:
                    </label>
                    <TextArea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Descripción de la tarea..."
                      rows={4}
                    />
                  </div>
                  
                  <Button
                    type="primary"
                    onClick={editTask ? updateTask : createTask}
                    disabled={!title || !content}
                    block
                    style={{ marginBottom: editTask ? '8px' : '0' }}
                  >
                    {editTask ? "Actualizar" : "Crear Tarea"}
                  </Button>
                  
                  {editTask && (
                    <Button
                      onClick={cancelEdit}
                      block
                    >
                      Cancelar
                    </Button>
                  )}
                </Card>
              </Col>
            )}
            
            {/* lista de tareas */}
            <Col xs={24} md={canWrite ? 16 : 24}>
              <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '5px' }}>
                <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Tareas</h2>
                
                {loading ? (
                  <div style={{ textAlign: 'center', margin: '40px 0' }}>
                    <Spin size="large" />
                  </div>
                ) : paginatedTasks.length > 0 ? (
                  <Row gutter={[16, 16]}>
                    {paginatedTasks.map((task, index) => (
                      <Col xs={24} sm={12} md={canWrite ? 12 : 8} key={index}>
                        <Card
                          hoverable
                          style={{ height: '100%' }}
                          actions={[
                            // Botón de editar (solo visible para el creador)
                            canWrite && task.creator === user.email && (
                              <Button 
                                type="text" 
                                icon={<EditOutlined />}
                                onClick={() => startEdit(task)}
                              />
                            ),
                            // Botón de eliminar (solo visible con permiso)
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
                                <div style={{ fontSize: '12px', color: '#888' }}>
                                  <p>Creador: {task.creatorName || task.creator}</p>
                                  <p>Fecha: {formatDate(task.created_at)}</p>
                                </div>
                              </div>
                            }
                          />
                        </Card>
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
              </div>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}
