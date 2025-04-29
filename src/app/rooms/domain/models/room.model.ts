export interface RoomModel {
  id: string;
  name: string;
  description: string;
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