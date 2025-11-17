export interface User {
    id?: number;
    email?: string;
    password?: string;
    tip?: string;
    reply?: string;
    questionId?: number;
    clientId?: number;
    typeId?: number;
    lastPaymentId?: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    situation?: number;
    socialCode?: string;
    inputCode?: string;
    client: {
      id?: number;
      name?: string;
      nick?: string;
      phone?: string;
      photo?: string;
      backgroundImage?: string;
      description?: string;
      instagram?: string;
      createdAt?: string;
      updatedAt?: string;
      deletedAt?: string;
      document?: string;
      cref?: string;
      situation?: number;
      gender?: number;
      birthDate?: string;
    },
    type: {
      id?: number;
      name: string;
    }
  
}

export interface RegisterUser {
  email?: string;
  password?: string;
  name?: string;
}

export interface EditUserBody {
  id?: number;
  email?: string;
  tip?: string;
  reply?: string;
  questionId?: number;
  name?: string;
  description?: string;
  nick?: string;
  phone?: string;
  instagram?: string;
  gender?: number;
  birthDate?: string;
  document?: string;
}