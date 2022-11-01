export interface UserType {
  id: number;
  nickname: string;
  email: string;
  Workspaces: WorkspaceType[];
}

export interface WorkspaceType {
  id: number;
  name: string;
  url: string;
  ownerId: number;
}

export interface ChannelType {
  id: number;
  name: string;
  private: boolean;
  WorkspaceId: number;
}
