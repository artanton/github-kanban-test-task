export type Status = "Open" | "In progress" | "Done";

export type Task = {
  id: string;
  repository_url:string;
  title: string;
  status: Status;
  number: number;
  comments: number;
  userType: string;
  createdAt: string;
};
export interface GitHubIssue {
  id: number;
  repository_url: string;
  number: number;
  title: string;
  state: string; // 'open' | 'closed'
  comments: number;
  user: {
    type: string;
  };
  created_at: string;
}

export type BoardSections = {
  [name: string]: Task[];
};
