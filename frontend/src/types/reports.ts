export type RevenueChartItem = {
  name: string;
  vendas: number;
  locacao: number;
};

export type FunnelChartItem = {
  label: string;
  value: number;
  percentage: number;
  color: string;
};

export type ContractsChartItem = {
  name: string;
  value: number;
};

export type EfficiencyAgent = {
  name: string;
  accuracy: number;
  pending: number;
  errors: number;
};

export type ReportKpi = {
  title: string;
  value: string;
  trend?: "up" | "down";
};

export type ReportsResponse = {
  revenue: RevenueChartItem[];
  funnel: FunnelChartItem[];
  contracts: ContractsChartItem[];
  efficiency: EfficiencyAgent[];
  kpis: ReportKpi[];
  documents_by_status: DocumentsByStatusItem[];
  contracts_by_month: ContractsByMonthItem[];
  contracts_by_type: ContractsByTypeItem[];
  top_properties: TopPropertyItem[];
};

export type DocumentsByStatusItem = {
  name: string;
  value: number;
  percentage: number;
};

export type ContractsByMonthItem = {
  name: string;
  value: number;
};

export type ContractsByTypeItem = {
  name: string;
  value: number;
};

export type TopPropertyItem = {
  name: string;
  value: number;
};