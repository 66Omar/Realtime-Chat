import { User } from "src/user/models";

export const userSelect = {
  id: User.id,
  username: User.username,
  description: User.description,
  avatar: User.avatar,
  created_at: User.created_at,
  updated_at: User.updated_at,
}