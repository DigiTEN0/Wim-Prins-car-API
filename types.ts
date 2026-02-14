
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: string;
  mileage: string;
  power: string;
  displacement: string; 
  cylinders: string;    
  fuel: string;
  color: string;
  url: string;
  imageUrl: string;
  description: string;
}

export type MessageRole = 'user' | 'bot';

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
  suggestedCars?: Car[];
}

export interface UserData {
  name: string;
  email: string;
  phone?: string;
}
