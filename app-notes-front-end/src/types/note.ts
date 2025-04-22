import { IUser } from "./user";

export interface INote {
    id?: number | string;
    title: string;
    body: string;
    user?: IUser;
    userid?: string;
    createdOffline?: boolean;
    deletedOffLine?: boolean;
    updatedOffLine?: boolean;
    sessionExpired?: boolean;
}
