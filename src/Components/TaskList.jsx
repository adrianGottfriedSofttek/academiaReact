import React, { useState, useEffect } from 'react';
import { useAuth } from "../hooks/userAuth";
import { hasDeletePermission, hasWritePermission } from "../Config/userPermissions";
import { deleteTask, getAllTasks } from "../Config/taskService";
import { message } from "antd";



const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [canWrite, setCanWrite] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const { user } = useAuth();
  
    useEffect(() => {
      fetchTasks();
      if (user) {
        checkPermissions();
      }
    }, [user]);

const checkPermissions = async () => {
    if(user){
        const writePermission = await hasWritePermission(user);
        const deletePermission = await hasDeletePermission(user);
        setCanWrite(writePermission);
        setCanDelete(deletePermission);
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
    message.success("Tarea creada con éxito");
};

// formatear fecha funcion
const formatDate = (date) => {
    if (!date) return "Fecha no disponible";
    
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  
}
