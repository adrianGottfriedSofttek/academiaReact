import firebaseAcademia from "./firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, getFirestore,updateDoc} from "firebase/firestore";
import { readDataFirestore } from './firestoreCalls';

const db = getFirestore(firebaseAcademia);

//  almacenar las tareas
const TASKS_COLLECTION = 'tasks';

// nueva tarea
export const createTask = async (taskData, user) => {
  try {
    // buscar información
    const userData = await readDataFirestore('users', 'email', user.email);
    let creatorName = user.email;
    
    // get nombre  del usuaroi
    if (!userData.empty) {
      const userDoc = userData.docs[0].data();
      creatorName = userDoc.name || creatorName;
    }
    
    // estructura de la tarea 
    const newTask = {
      title: taskData.title,
      content: taskData.content,
      creator: user.email,
      creatorName: creatorName,
      created_at: new Date(),
    };
    
    // agregar la tarea 
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), newTask);

    await updateDoc(doc(db, TASKS_COLLECTION, docRef.id), {
      id_task: docRef.id
    });
    
    return {
      id: docRef.id,
      id_task: docRef.id,
      ...newTask,
    };
  } catch (error) {
    console.error("Error al crear tarea:", error);
    throw error;
  }
};

// get las tareas ordenadas por fecha
export const getAllTasks = async () => {
  try {
    const tasksRef = collection(db, TASKS_COLLECTION);
    const q = query(tasksRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const tasks = [];
    querySnapshot.forEach((doc) => {
      
      tasks.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return tasks;
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    return [];
  }
};

// Eliminar una tarea
export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
    return true;
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    throw error;
  }
};