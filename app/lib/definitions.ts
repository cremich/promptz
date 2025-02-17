export type User = {
  id: string;
  displayName: string;
  guest: boolean;
};

export type Prompt = {
  id?: string;
  title?: string;
  description?: string;
  tags?: string[];
  instruction?: string;
  howto?: string;
  author?: string;
  authorId?: string;
};
