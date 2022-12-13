import { Button } from '@/components/atoms/button';
import { useState } from 'react';
import { Form, Input } from 'semantic-ui-react';

const Login = () => {
  const [error, setError] = useState<string|undefined>(undefined);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const key = formData.get('key');

    // todo: add api call to check if key is valid
    if (key !== '123') {
      setError('Invalid key');
    } else {
      setError(undefined);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Form onSubmit={handleSubmit} className='w-40' >
        <Form.Field
          control={Input}
          label="Access Key"
          placeholder="Key"
          type="password"
          name="key"
          error={error && { content: error }}
        />
        <Button variant="link" type="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default Login;
