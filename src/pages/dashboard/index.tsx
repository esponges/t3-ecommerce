import { InputMessage } from '@/components/atoms/inputMessage';
import { PageContainer } from '@/components/layouts/pageContainer';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { Button, Form } from 'semantic-ui-react';

type FormValues = {
  name: string;
  password: string;
};

const defaultValues = {
  name: '',
  password: '',
};

const validationSchema = {
  name: {
    required: 'El nombre es requerido',
  },
  lastName: {
    required: 'El apellido es requerido',
  },
  email: {
    required: 'El email es requerido',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'El email no es válido',
    },
  },
  password: {
    required: 'La contraseña es requerida',
    minLength: {
      value: 8,
      message: 'La contraseña debe tener al menos 8 caracteres',
    },
  },
};

const Dashboard = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <PageContainer verticallyCentered>
      <Head>
        {/* dont index */}
        <meta name="robots" content="noindex" />
        <title>Dashboard</title>
      </Head>
      <Form onSubmit={handleSubmit(onSubmit)} className="text-center md:w-1/3">
        <Form.Field>
          <label>Usuario</label>
          <input 
            type="text" 
            placeholder="Usuario" 
            id="name" 
            {...register('name', validationSchema.name)} 
          />
          {errors.name && <InputMessage type="error" message={errors.name.message ?? ''} />}
        </Form.Field>
        <Form.Field>
          <label>Contraseña</label>
          <input
            type="text"
            placeholder='Contraseña'
            id="password"
            {...register('password', validationSchema.password)}
          />
        </Form.Field>
        <Button type="submit">Entrar</Button>
      </Form>
    </PageContainer>
  );
};

export default Dashboard;
