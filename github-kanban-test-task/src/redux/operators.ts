import { GitHubIssue, Star, Status, Task } from "@/types/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.github.com",
  timeout: 10000,
  headers: {
    Accept: "application/vnd.github.v3+json",
  },
});

export const fetchTasks = createAsyncThunk(
  "board/fetchTasks",
  async (url: string, thunkAPI) => {
    try {
      const repoName = url.split("/").slice(-2).join("/");

      const [issues, ownersRepo] = await Promise.all([
        instance.get<GitHubIssue[]>(`/repos/${repoName}/issues`),
        instance.get<Star>(`/repos/${repoName}`),
      ]);

      const tasks: Task[] = issues?.data.map((issue) => ({
        id: issue.id.toString(),
        repository_url: issue.repository_url,
        number: issue.number,
        title: issue.title,
        status: issue.state as Status,
        comments: issue.comments,
        userType: issue.user.type,
        createdAt: issue.created_at,
      }));

      const repoRate = ownersRepo?.data.stargazers_count;

      return { tasks, repoRate, repoName: url };
    } catch (e: unknown) {
      if (e instanceof Error) {
        return thunkAPI.rejectWithValue(e.message);
      } else {
        return thunkAPI.rejectWithValue("An unknown error occurred");
      }
    }
  }
);
