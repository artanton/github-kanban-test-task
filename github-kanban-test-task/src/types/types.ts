export type Status = 'Open' | 'In progress' | 'Done';

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: Status;
};

export type BoardSections = {
  [name: string]: Task[];
};