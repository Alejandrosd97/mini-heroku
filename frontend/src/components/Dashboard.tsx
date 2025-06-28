import React from 'react'
import { useApi } from '../hooks/useApi';


type AppEntry = {
  id: string;
  subdomain: string;
  url: string;
  env: Record<string, string>;
};

const Dashboard = () => {
  const { data: apps, loading, error } = useApi<AppEntry[]>('/apps');

  if (loading) return <p>Cargando apps...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className='text-6xl'>Apps desplegadas</h2>
      <ul>
        {apps?.map((app) => (
          <li key={app.id}>
            <strong>{app.subdomain}</strong> - {app.url}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard