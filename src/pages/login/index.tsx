import { signIn } from "next-auth/react";
import { Button } from "../../components/atoms/button";

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Button variant="primary" onClick={() => signIn('discord')}>
        Login
      </Button>
    </div>
  );
};

export default Login;
