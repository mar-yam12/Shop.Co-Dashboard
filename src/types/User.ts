
export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    password: string;
  }
  
  export interface SessionUser {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    password: string;
  }
