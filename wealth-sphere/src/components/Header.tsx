import { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '/logo.webp';
import { AuthButton } from './AuthButton';
import { userService } from '@/services/user.service';

export const Header: FC = () => {
  const [user, setUser] = useState(userService.currentUserValue);

  useEffect(() => {
    const subscription = userService.currentUser.subscribe(currentUser => {
      setUser(currentUser);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Wealth Sphere Logo" className="h-16 w-16" />
          <h1 className="text-3xl font-bold text-gray-800">Wealth Sphere</h1>
        </Link>
        <div className="flex items-center space-x-4">
          {user && (
            <span className="text-gray-600">Welcome, {user.name}</span>
          )}
          <AuthButton />
        </div>
      </div>
    </header>
  );
};
