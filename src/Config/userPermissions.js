import { getFirestore } from "firebase/firestore";
import firebaseAcademia from "./firebaseConfig";
import { readDataFirestore } from "./firestoreCalls";

const db = getFirestore(firebaseAcademia);

export const PERMISSIONS ={
    READ: 'read',
    WRITE: 'write',
    DELETE: 'delete'
};

//obtener permisos de usuarios
export const getUserPermissions = async (user) =>{
    if (!user  || !user.email) return PERMISSIONS.READ; //por defecto, lectura


    try{
        //buscar user por email
        const userData = await readDataFirestore('user','email',user.email);

        if(!userData.empty){
            const userDoc = userData.docs[0].data();
            //devolver permiso o valor por defecto
            return userDoc.permissions || PERMISSIONS.READ;
        }
        console.log("usuario no encoentrado",user.email);
        return  PERMISSIONS.READ;
    }catch (error){
        console.error("error al obtener permisos",error);
    }
    return PERMISSIONS.READ;
};

export const hasPermission = async (user, requestedPermission) => {
    if (!user || !requestedPermission) return false;
    
    try {
      const userPermission = await getUserPermissions(user);
      
      // el permiso actual es exactamente igual al solicitad
      if (userPermission === requestedPermission) {
        return true;
      }
      
      //  permiso es una cadena con múltiples permisos separados por comas
      if (typeof userPermission === 'string' && userPermission.includes(',')) {
        const permissionArray = userPermission.split(',').map(p => p.trim());
        return permissionArray.includes(requestedPermission);
      }
      
      // permiso es un array 
      if (Array.isArray(userPermission)) {
        return userPermission.includes(requestedPermission);
      }
      
      //manejo de jerarquia de permisos
      if (userPermission === PERMISSIONS.DELETE) {
        return true; // Un usuario con permiso de borrado puede hacer todo
      }
      
      if (userPermission === PERMISSIONS.WRITE && 
          (requestedPermission === PERMISSIONS.WRITE || 
           requestedPermission === PERMISSIONS.READ)) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error al verificar permiso:", error);
      return false;
    }
  };
  
  // si usuario tiene permisos de escritura
  export const hasWritePermission = async (user) => {
    if (!user) return false;
    
    const permission = await getUserPermissions(user);
    return permission === PERMISSIONS.WRITE || permission === PERMISSIONS.DELETE;
  };
  
  //  si un usuario tiene permisos de borrado
  export const hasDeletePermission = async (user) => {
    if (!user) return false;
    
    const permission = await getUserPermissions(user);
    return permission === PERMISSIONS.DELETE;
  };
  
  // actualizar el permiso de un usuario
  export const updateUserPermission = async (email, newPermission) => {
    if (!email || !Object.values(PERMISSIONS).includes(newPermission)) {
      console.error("Email o permiso inválido");
      return false;
    }
    
    try {
      // Buscar el usuario por email
      const userData = await readDataFirestore('users', 'email', email);
      
      if (userData.empty) {
        console.error("Usuario no encontrado:", email);
        return false;
      }
      
      //  ID del documento
      const userDocId = userData.docs[0].id;
      
      // ref. al documento
      const userRef = doc(db, 'users', userDocId);
      
      // Actualizar el permiso "string"
      await updateDoc(userRef, {
        permissions: newPermission
      });
      
      console.log(`Permiso actualizado para ${email}: ${newPermission}`);
      return true;
    } catch (error) {
      console.error("Error al actualizar permiso:", error);
      return false;
    }
  };
