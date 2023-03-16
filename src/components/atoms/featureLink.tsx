import Link from 'next/link';

interface Props {
  title: string;
  description?: string;
  href: string;
  icon?: React.ReactNode;
  color?: string;
  backgroundColor?: string;
  className?: string;
}

const FeatureLink: React.FC<Props> = ({ title, description, href, icon, color, backgroundColor, className }) => {
  return (
    <Link href={href}>
      <a className={className}>
        <div
          className={`flex h-full w-full flex-col items-center
         justify-center space-y-4 rounded-lg bg-white p-6 text-center shadow-lg
         ${backgroundColor || 'bg-gray-50'} ${color || 'text-gray-900'}`}
        >
          {icon ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-full text-white">{icon}</div>
          ) : null}
          <h3 className={`text-lg font-medium uppercase ${color || 'text-gray-700'}`}>{title}</h3>
          {description ? <p className="text-base text-gray-500">{description}</p> : null}
        </div>
      </a>
    </Link>
  );
};

export default FeatureLink;
