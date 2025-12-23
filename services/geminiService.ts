import { GoogleGenAI, Tool } from "@google/genai";
import { CalculationResult, ConstructionInput } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeEstimate = async (
  input: ConstructionInput,
  result: CalculationResult
): Promise<string> => {
  try {
    const ai = getClient();

    const tools: Tool[] = [{ googleSearch: {} }];

    const prompt = `
      Bạn là chuyên gia tư vấn xây dựng và thẩm định giá tại Việt Nam. Hãy phân tích bảng dự toán xây dựng sau đây:

      **Thông tin công trình:**
      - Địa điểm: ${input.location}
      - Kích thước: ${input.width}m x ${input.length}m
      - Quy mô: ${input.floors} tầng
      - Loại móng: ${input.foundationType} (${input.foundationPercent}%)
      - Loại mái: ${input.roofType} (${input.roofPercent}%)
      - Gói thầu: ${input.packageType}

      **Kết quả tính toán sơ bộ:**
      - Tổng diện tích quy đổi: ${result.totalConvertedArea.toLocaleString('vi-VN')} m2
      - Đơn giá áp dụng (đã điều chỉnh theo khu vực): ${result.unitPrice.toLocaleString('vi-VN')} VNĐ/m2
      - Tổng chi phí ước tính: ${result.totalCost.toLocaleString('vi-VN')} VNĐ

      **Nhiệm vụ:**
      1. Sử dụng Google Search để kiểm tra đơn giá xây dựng thực tế MỚI NHẤT (năm 2024-2025) tại ${input.location} cho loại công trình này.
      2. Đánh giá xem mức giá ${result.unitPrice.toLocaleString('vi-VN')} đ/m2 có hợp lý không? Cao hay thấp so với thị trường hiện tại?
      3. Đưa ra 3-4 lời khuyên quan trọng cho chủ nhà để tối ưu chi phí hoặc tránh phát sinh tại khu vực ${input.location} (ví dụ: nền đất, vận chuyển vật tư trong ngõ nhỏ, mùa mưa, v.v.).
      4. Trả lời ngắn gọn, súc tích, định dạng Markdown dễ đọc.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using flash for speed/tools
      contents: prompt,
      config: {
        tools: tools,
        systemInstruction: "Bạn là một kỹ sư xây dựng giàu kinh nghiệm tại Việt Nam. Giọng văn chuyên nghiệp, khách quan, và hữu ích.",
      }
    });

    return response.text || "Không thể phân tích dữ liệu lúc này.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đã xảy ra lỗi khi kết nối với chuyên gia AI. Vui lòng thử lại sau.";
  }
};
