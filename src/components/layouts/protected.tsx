import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Header } from "./header";

type Props = {
  children: React.ReactNode;
};

export const ProtectedLayout = ({ children }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>{children}</main>
    </div>
  );
};
