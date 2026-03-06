export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_username: string;
  created_at: string;
  text: string;
}

export interface CreateCommentPayload {
  text: string;
}

