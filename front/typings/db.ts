export interface UserType {
  id: number;
  nickname: string;
  email: string;
  Workspaces: WorkspaceType[];
}

export interface UserWithOnlineType extends UserType {
  online: boolean;
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

export interface DMType {
  id: number;
  SenderId: number;
  Sender: UserType;
  ReceiverId: number;
  Receiver: UserType;
  content: string;
  createdAt: Date;
}
