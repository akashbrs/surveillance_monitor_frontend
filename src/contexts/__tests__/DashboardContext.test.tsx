import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { DashboardProvider, useDashboard } from "../DashboardContext";
import * as handlers from "@/services/apiHandlers";
import { ReactNode } from "react";

// Mock the API handlers
vi.mock("@/services/apiHandlers", () => ({
  fetchLogs: vi.fn(),
  fetchStats: vi.fn(),
  blockIPRequest: vi.fn(),
  resolveIncidentRequest: vi.fn(),
  ignoreIncidentRequest: vi.fn(),
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <DashboardProvider>{children}</DashboardProvider>
);

describe("DashboardContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with mock data", () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    expect(result.current.logs).toBeDefined();
    expect(result.current.stats).toBeDefined();
    expect(result.current.loading).toBe(false);
  });

  it("refreshData should call fetchLogs and fetchStats", async () => {
    const mockLogs = [{ id: "1", ip: "1.1.1.1", status: "Active" }];
    const mockStats = { totalLogs: 1, totalAttacks: 1, activeThreats: 1, blockedIPs: 0 };
    
    (handlers.fetchLogs as any).mockResolvedValue(mockLogs);
    (handlers.fetchStats as any).mockResolvedValue(mockStats);

    const { result } = renderHook(() => useDashboard(), { wrapper });

    await act(async () => {
      await result.current.refreshData();
    });

    expect(handlers.fetchLogs).toHaveBeenCalled();
    expect(handlers.fetchStats).toHaveBeenCalled();
    expect(result.current.logs).toEqual(mockLogs);
  });

  it("blockIP should update local state and call blockIPRequest", async () => {
    (handlers.blockIPRequest as any).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDashboard(), { wrapper });
    const initialLogId = result.current.logs[0].id;
    const initialLogIP = result.current.logs[0].ip;

    await act(async () => {
      await result.current.blockIP(initialLogIP, initialLogId);
    });

    expect(handlers.blockIPRequest).toHaveBeenCalledWith(initialLogIP);
    expect(result.current.logs[0].status).toBe("Blocked");
  });
});
