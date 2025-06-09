export type User = {
  id: string;
  username: string;
  displayName: string;
  groups: string[];
  isAdmin: boolean;
  guest: boolean;
};
