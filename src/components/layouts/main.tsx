import { Header } from "./header";

interface Props {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screenbg-gray-100">
      <Header children={children} />
    </div>
  )
}
