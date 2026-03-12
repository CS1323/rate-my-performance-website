const mockGenerateContent = vi.fn();

vi.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    }),
  })),
}));

const { moderateContent } = await import("./moderateContent.js");

describe("moderateContent — keyword scan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "test-key";
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  test("keyword match returns score 10 and HIDDEN without calling the LLM", async () => {
    const result = await moderateContent("I cannot believe trump said that");
    expect(result.score).toBe(10);
    expect(result.status).toBe("HIDDEN");
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test("phrase match returns score 10 and HIDDEN without calling the LLM", async () => {
    const result = await moderateContent("This constitutes ethnic cleansing");
    expect(result.score).toBe(10);
    expect(result.status).toBe("HIDDEN");
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test("direct-targeting pattern returns HIDDEN without calling the LLM", async () => {
    const result = await moderateContent("You're so pathetic");
    expect(result.score).toBe(10);
    expect(result.status).toBe("HIDDEN");
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test("word containing a keyword as a substring does not trigger auto-hide", async () => {
    // "israel" keyword uses \b boundary — "israeli" should not match
    mockGenerateContent.mockResolvedValue({ response: { text: () => "1" } });
    await moderateContent("The israeli team played well");
    expect(mockGenerateContent).toHaveBeenCalled();
  });
});

describe("moderateContent — LLM path", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "test-key";
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  test("missing API key returns score 0 and VISIBLE without calling the LLM", async () => {
    delete process.env.GEMINI_API_KEY;
    const result = await moderateContent("benign comment");
    expect(result.score).toBe(0);
    expect(result.status).toBe("VISIBLE");
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test("LLM score 6 produces HIDDEN status", async () => {
    mockGenerateContent.mockResolvedValue({ response: { text: () => "6" } });
    const result = await moderateContent("concerning comment");
    expect(result.score).toBe(6);
    expect(result.status).toBe("HIDDEN");
  });

  test("LLM score 5 produces VISIBLE status", async () => {
    mockGenerateContent.mockResolvedValue({ response: { text: () => "5" } });
    const result = await moderateContent("borderline comment");
    expect(result.score).toBe(5);
    expect(result.status).toBe("VISIBLE");
  });

  test("LLM response with extra text extracts the numeric score correctly", async () => {
    mockGenerateContent.mockResolvedValue({
      response: { text: () => "Based on analysis, I rate this 8 out of 10" },
    });
    const result = await moderateContent("bad comment");
    expect(result.score).toBe(8);
    expect(result.status).toBe("HIDDEN");
  });

  test("LLM error falls back to score 0 and VISIBLE", async () => {
    mockGenerateContent.mockRejectedValue(new Error("Network error"));
    const result = await moderateContent("some comment");
    expect(result.score).toBe(0);
    expect(result.status).toBe("VISIBLE");
  });
});


