import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const SYSTEM_INSTRUCTIONS = `
你是一個專業的數據分析師。請根據使用者提供的 CSV 格式數據，進行深入的分析並提供有洞察力的報告。
請務必以「繁體中文」進行輸出。
報告結構：
1. 數據總覽 (Data Overview)
2. 關鍵洞察 (Key Insights)
3. 趨勢分析 (Trend Analysis)
4. 建議行動 (Actionable Recommendations)

若數據有明顯錯誤或不足，請一併指出。
`;

export async function POST(req: NextRequest) {
  try {
    const { csvData } = await req.json();

    if (!csvData) {
      return NextResponse.json({ error: "No CSV data provided" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `請分析以下 CSV 資料:\n\n${csvData}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
      },
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze data" }, { status: 500 });
  }
}
