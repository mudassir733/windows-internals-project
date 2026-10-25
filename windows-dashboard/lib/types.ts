export interface ProcessItem {
  pid: number;
  name: string;
}

export interface ProcessDetail {
  pid: number;
  name: string;
  path: string;
  ram_usage_mb: number;
}
