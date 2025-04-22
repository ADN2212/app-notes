export interface IUser {
  id: number;
  username: string;
  password: string;
};

export interface IUserRequest {
  username: string | undefined;
  password: string | undefined;
}

export interface INewUserResponse {
  newUser: IUser
};
