import React, {useState} from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createTask } from '../Config/taskService';

const {TextArea} = Input;

const TaskForm = ({ onTaskAdded, user }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (values) => {
        if (!values.title || !values.content) {
          message.warning('Por favor completa todos los campos');
          return;
        }

        setSubmitting(true);
        try {
          const newTask = await createTask(values, user);
          form.resetFields();
          onTaskAdded(newTask);
        } catch (error) {
          console.error("Error al crear tarea:", error);
          message.error("No se pudo crear la tarea");
        } finally {
          setSubmitting(false);
        }
      };

      return( 
        <Card
        title= "Crear Nueva tarea"
        style={{ marginBottom: '20px' }}
        extra={<PlusOutlined />}
        >
            <Form
             form={form}
             layout="vertical"
             onFinish={handleSubmit}
            >
                <Form.Item
                    name="title"
                    label="Título"
                    rules={[{ required: true, message: 'Por favor ingresa un título' }]}
                >
                    <TextArea
                        placeholder="Describe la tarea"
                        rows={4}
                        showCount
                        maxLength ={500}
                    >
                    </TextArea>
                </Form.Item>


                <Form.Item>
                    <Button
                    type="primary" 
                    htmlType="submit" 
                    loading={submitting}
                    block
                    >
                        Crear Tarea
                    </Button>

                </Form.Item>     

            </Form>

        </Card>
      );
};

export default TaskForm;