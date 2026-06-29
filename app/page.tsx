"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [csvData, setCsvData] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysis("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvData }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setAnalysis(data.text);
    } catch (error) {
      console.error("Error:", error);
      setAnalysis("分析失敗，請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(analysis);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">AI 數據分析與洞察工具</h1>
        
        <textarea
          value={csvData}
          onChange={(e) => setCsvData(e.target.value)}
          placeholder="請在此貼上您的 CSV 資料..."
          className="w-full h-64 p-4 border rounded-lg shadow-sm mb-4 focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !csvData}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? "分析中..." : "開始 AI 分析"}
        </button>

        {analysis && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">分析結果</h2>
              <button
                onClick={copyToClipboard}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {copied ? "已複製！" : "一鍵複製"}
              </button>
            </div>
            <div className="prose max-w-none">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
