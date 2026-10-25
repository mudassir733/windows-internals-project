export const queryKeys = {
  processes: ["processes"] as const,
  processDetail: (name: string) => ["process", name] as const,
};
