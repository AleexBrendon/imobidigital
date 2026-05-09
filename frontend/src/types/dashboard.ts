export type DashboardActivity = {
  id: number;
  title: string;
  description?: string;
  type: string;
  created_at: string;
};

export type DashboardDocument = {
  id: number;
  name: string;
  type: string;
  status: string;
  color: string;
};

export type DashboardContract = {
  id: number;
  title: string;
  progress: number;
  status: string;
  end_date: string;
};

export type DashboardSignatureStep = {
  label: string;
  completed: boolean;
};

export type DashboardResponse = {
  kanban: Record<string, any[]>;
  activities: DashboardActivity[];
  documents: DashboardDocument[];
  contracts: DashboardContract[];
  signature_timeline: {
    contract: string;
    code: string;
    progress: number;
    steps: DashboardSignatureStep[];
  };
};