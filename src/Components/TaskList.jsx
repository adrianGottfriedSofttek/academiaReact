import React, { useState, useEffect } from 'react';
import { useAuth } from "../hooks/userAuth";
import { deleteTask, getAllTasks } from "../Config/taskService";
import { List, Card, Spin, Empty, Button, message, Row, Col } from 'antd';
import { DeleteOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import TaskForm from './TaskForm';


const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userPermissions, setUserPermissions] = useState("read");
    const { user } = useAuth();
  
    useEffect(() => {
      fetchTasks();
      if (user) {
        checkPermissions();
      }
    }, [user]);

const checkPermissions = async () => {
    if(!user) return;
    
    try{
      //buscar user por mail
      const userData = await readDataFirestore('users', 'email', user.email);

      if(!userData.empty){
        const userDoc = userData.docs[0].data();
        setUserPermissions(userDoc.permissions || "read");
      } else {
        console.log('Usuario no encontrado:', user.email);
        setUserPermissions("read"); 
      } 
    }catch (error){
      console.error("Error al verificar permisos:", error);
      setUserPermissions("read");
      }   
};

const fetchTasks = async () => {
    setLoading(true);
    try {
        const tasksData = await getAllTasks();
        setTasks(tasksData);
    } catch (error){
        console.error("error al obtener tareas",error),
        console.error("no se pudieron cargar las tareas");
    } finally{
        setLoading(false);
    }
};

const handleDeleteTask = async (taskId) => {
    try{
        await deleteTask(taskId);
        message.success("Tarea eliminada con exito");
        setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error){
        console.error("error al eliminar tarea",error);
        console.error("No se pudo eliminar la tarea");
    }
};

const handleTaskAdded = (newTask) => {
    setTasks ([newTask, ...tasks]);
};

// formatear fecha funcion
const formatDate = (date) => {
    if (!date) return "Fecha no disponible";

    const dateObj = date instanceof Date ? date : new Date(date);
    
    return dateObj.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
    //verifica si usuario puede crear tarea
  const canWrite = userPermissions === "write" || userPermissions === "delete";
  //verifica si puede eliminar 
  const canDelete = userPermissions === "delete";


  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Lista de Tareas</h2>
      
      
      {canWrite && (
        <TaskForm onTaskAdded={handleTaskAdded} user={user} />
      )}
      
      {loading ? (
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : tasks.length > 0 ? (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item>
              <Card
                title={task.title}
                extra={
                  canDelete && (
                    <Popconfirm
                      title="¿Eliminar esta tarea?"
                      description="Esta acción no se puede deshacer"
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      onConfirm={() => handleDeleteTask(task.id)}
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
                }
                hoverable
              >
                <p>{task.content}</p>
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
                  <p>Creador: {task.creatorName || task.creator}</p>
                  <p>Fecha: {formatDate(task.createdAt)}</p>
                </div>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="No hay tareas disponibles" />
      )}
    </div>
  );
};

export default TaskList;