import firebaseAcademia from "./firebaseConfig";
import {  collection, addDoc, getDocs,  deleteDoc,  doc,  query,  orderBy,  getFirestore, serverTimestamp} from "firebase/firestore";
import { readDataFirestore } from './firestoreCalls';
import { PERMISSIONS } from './userPermissions';

const db = getFirestore(firebaseAcademia);

// almacenar las tareas
const TASKS_COLLECTION = 'tasks';

// nueva tarea
export const createTask = async (taskData, user) => {
  try {
    // información del usuario
    const userData = await readDataFirestore('users', 'email', user.email);
    let creatorName = user.email.split('@')[0]; // Valor por defecto
    
    // get  nombre real del usuario 
    if (!userData.empty) {
      const userDoc = userData.docs[0].data();
      creatorName = userDoc.name || creatorName;
    }
    
    // estructura de la tarea
    const newTask = {
      title: taskData.title,
      content: taskData.content,
      creatorName: creatorName,
      creatorEmail: user.email, 
      createdAt: serverTimestamp(),
    };
    
    // sgregar tarea
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), newTask);
    
    return {
      id: docRef.id,
      ...newTask,
      createdAt: new Date() //  fecha local para el objeto retornado
    };
  } catch (error) {
    console.error("Error al crear tarea:", error);
    throw error;
  }
};

// obtener las tareas ordenadas por fecha de creación 
export const getAllTasks = async () => {
  try {
    const tasksRef = collection(db, TASKS_COLLECTION);
    const q = query(tasksRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const tasks = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      //  timestamp de Firestore a Date
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
      
      tasks.push({
        id: doc.id,
        ...data,
        createdAt
      });
    });
    
    return tasks;
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    throw error;
  }
};

// delete una tarea 
export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
    return true;
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    throw error;
  }
};