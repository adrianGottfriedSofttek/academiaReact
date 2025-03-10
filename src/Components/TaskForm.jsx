import React, {useState} from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createTask } from '../Config/taskService';

const {TextArea} = Input;

const TaskForm = ({ onTaskAdded, user }) => {
    
    const [submitting, setSubmitting] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
          message.warning('Por favor completa todos los campos');
          return;
        }

        setSubmitting(true);
        try {
          const newTask = await createTask({ title, content }, user);
          // reset formulario
          setTitle(''),
          setContent(''),
          setShowForm(false);
          
          onTaskAdded(newTask);
          message.success('Tarea creada con éxito');
        } catch (error) {
          console.error("Error al crear tarea:", error);
          message.error("No se pudo crear la tarea");
        } finally {
          setSubmitting(false);
        }
      };

      //si no esta visible, mostrar solo  boton
      if(!showForm){
        return(
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setShowForm(true)}
          size="large"
        >
          Crear nueva tarea
        </Button>
        </div>
        )
      }

      //Mostrar formulario completo
      return( 
        <Card
        title= "Crear Nueva tarea"
        style={{ marginBottom: '20px' }}
        extra={
          <Button 
            type="text" 
            onClick={() => setShowForm(false)}
        >
          Cancelar
          </Button>
        }
        >
            <Form layout="vertical">
                <Form.Item
                    name="title"
                    required
                    rules={[{ required: true, message: 'Por favor ingresa un título' }]}
                >
                   <Input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título de la tarea" 
                    autoFocus
                   />
                </Form.Item>

                <Form.Item
                  label="Contenido"
                  required
                  rules={[{ required: true, message: 'Por favor ingresa el contenido' }]}
                   >
                   <TextArea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe la tarea..." 
                    rows={4} 
                    showCount 
                    maxLength={500} 
          />
        </Form.Item>
            <Button 
              type="primary" 
              onClick={handleSubmit}
              loading={submitting}
              icon={<SaveOutlined />}
              block
               >
                 Guardar Tarea
             </Button>
            </Form>
        </Card>
      );
};

export default TaskForm;