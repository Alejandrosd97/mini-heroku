export interface AppRegistryEntry {
  id: string;
  subdomain: string;
  url: string;
  env: Record<string, string>;
}

export interface DatabaseRegistryEntry {
  id: string;
  host: string;
  port: number;
  user: string;
  password: string;
  dbname: string;
}

export interface JwtPayload {
  userId: string;
  iat?: number;      // issued at
  exp?: number;      // expires at
}
