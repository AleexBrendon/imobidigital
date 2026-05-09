export type Client = {
  id: number;
  client_id?: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  tag?: string | null;
  status?: string | null;
  stage?: string | null;
  avatar?: number;
  property?: string | null;
  progress?: number;
  signature_timeline?: {
    contract: string;
    code: string;
    progress: number;
    steps: {
      label: string;
      completed: boolean;
    }[];
  } | null;
};