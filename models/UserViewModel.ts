import { Schema } from "@/amplify/data/resource";

export class UserViewModel {
  private _id: string;
  private _username: string;
  private _email: string;
  private _displayName: string;
  private _owner: string;
  private _guest: boolean;

  constructor(
    id: string,
    username: string,
    email: string,
    displayName: string,
    profileOwner: string,
    guest: boolean,
  ) {
    this._id = id;
    this._username = username;
    this._email = email;
    this._displayName = displayName;
    this._owner = profileOwner;
    this._guest = guest;
  }

  public static createGuest(): UserViewModel {
    return new UserViewModel("", "", "", "Guest", "", true);
  }

  public static fromSchema(user: Schema["user"]["type"]): UserViewModel {
    return new UserViewModel(
      user.id,
      user.username,
      user.email,
      user.displayName,
      user.owner!,
      false,
    );
  }

  public get id(): string {
    return this._id;
  }

  public get username(): string {
    return this._username;
  }

  public get email(): string {
    return this._email;
  }

  public get displayName(): string {
    return this._displayName;
  }

  public get owner(): string {
    return this._owner;
  }

  public get isGuest(): boolean {
    return this._guest;
  }
}
