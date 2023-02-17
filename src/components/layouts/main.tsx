import { Footer } from "./footer";
import { Header } from "./header";

interface Props {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen">
      <Header>
        {children}
        <Footer />
      </Header>
    </div>
  );
};
