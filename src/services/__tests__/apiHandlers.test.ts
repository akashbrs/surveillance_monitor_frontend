import { describe, it, expect, vi, beforeEach } from "vitest";
import API from "../api";
import * as handlers from "../apiHandlers";
import { mockLogs } from "@/lib/mock-data";

// Mock the API instance
vi.mock("../api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("apiHandlers (MOCK MODE ENABLED)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchLogs should return mock data directly and bypass API", async () => {
    const result = await handlers.fetchLogs();

    expect(API.get).not.toHaveBeenCalled();
    expect(result).toEqual(mockLogs);
  });

  it("loginUser should return a mock token and bypass API", async () => {
    const result = await handlers.loginUser("test@test.com", "pass");

    expect(API.post).not.toHaveBeenCalled();
    expect(result.token).toBeDefined();
    expect(result.user.email).toBe("test@test.com");
  });

  it("blockIPRequest should resolve successfully and bypass API", async () => {
    await expect(handlers.blockIPRequest("1.1.1.1")).resolves.not.toThrow();
    expect(API.post).not.toHaveBeenCalled();
  });
});
