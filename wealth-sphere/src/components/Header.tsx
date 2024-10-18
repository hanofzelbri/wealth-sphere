import { FC } from 'react';
import logo from '/logo.webp';

export const Header: FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Wealth Sphere Logo" className="h-16 w-16" />
          <h1 className="text-3xl font-bold text-gray-800">Wealth Sphere</h1>
        </div>
      </div>
    </header>
  );
};
