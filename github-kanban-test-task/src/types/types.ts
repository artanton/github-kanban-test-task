export type Status = "Open" | "In progress" | "Done";

export type Task = {
  id: string;
  title: string;
  status: Status;
  number: number;
  comments: number;
  userType: string;
  createdAt: string;
};

export type BoardSections = {
  [name: string]: Task[];
};
