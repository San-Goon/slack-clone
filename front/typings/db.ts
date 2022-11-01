export interface UserType {
  id: number;
  nickname: string;
  email: string;
  workspaces: WorkspaceType[];
}

export interface WorkspaceType {
  id: number;
  name: string;
  url: string;
  ownerId: number;
}
