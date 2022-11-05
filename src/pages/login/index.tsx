import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../../components/atoms/button";

const Login = () => {
  const { data: session } = useSession();

  return (
    <div className="flex justify-center items-center h-screen">
      {!session ? (
        <Button variant="primary" onClick={() => signIn('discord')}>
          Login
        </Button>
      ) : (
        <div>
          <p>Already logged in</p>
          <Link href="/">
            <Button variant="primary" extraClassName="mt-4">Go to home</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Login;
