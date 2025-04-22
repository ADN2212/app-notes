import { IUser } from "./user";

export interface INoteRequest {
  title: string | undefined; 
  body: string | undefined;
}

export interface INote {
  id: number;
  title: string;
  body: string;
  user: IUser;
  userid: string;
}

export type INoteCreatedRequest = Partial<INote>;

export interface INoteDelete {
  id: number;
  userid: number;
}
