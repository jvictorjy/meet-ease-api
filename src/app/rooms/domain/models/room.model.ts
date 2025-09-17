export interface RoomModel {
  id: string;
  name: string;
  description: string;
  max_capacity: number;
  opening_time: string;
  closing_time: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  layouts?: RoomLayoutModel[];
}

export interface RoomLayoutModel {
  id: string;
  description: string;
  imageUrl: string;
  roomId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
