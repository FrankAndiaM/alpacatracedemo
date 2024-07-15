import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import routesName from '~routes/routes';

type GuardModuleProps = {
  module_code?: string;
  element: React.ReactNode;
};
export const GuardModule: React.FC<GuardModuleProps> = ({ module_code, element }: GuardModuleProps) => {
  const { auth }: any = useSelector((state: any) => state);

  const rol = localStorage.getItem('permissions');
  if (rol && module_code) {
    const rolParse = JSON.parse(rol);
    if (rolParse.name_rol !== 'agro_admins') {
      const result = rolParse?.permission?.modules?.some((value: any) => value?.module_code === module_code);
      if (!result) {
        return <Navigate to={routesName.dashboard} />;
      }
    }
  }

  return <>{auth.isLoggedIn ? element : <Navigate to={'/'} />}</>;
};
