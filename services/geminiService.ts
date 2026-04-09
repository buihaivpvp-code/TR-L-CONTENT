
import { GoogleGenAI, Type } from "@google/genai";
import { ScriptType, SingleScript, Gender, Industry, ScriptGoal, HookType, TargetAudience, ContentStyle, ViralInput, AgeGroup, SellingFactor, ViralHookSubject } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const getResponseSchema = (scriptType: ScriptType) => {
  return {
    type: Type.ARRAY,
    description: "Mảng JSON chứa 3 kịch bản TikTok Affiliate tối ưu.",
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Tiêu đề kịch bản" },
        voiceOver: { type: Type.STRING, description: "Lời thoại lồng tiếng tự nhiên, đời thường" },
        shotsTable: { type: Type.STRING, description: "Bảng Markdown: Cảnh | Mô tả quay | Giây" },
        textOverlays: { type: Type.STRING, description: "Text hiện màn hình" },
        musicVibe: { type: Type.STRING, description: "Gợi ý nhạc nền" },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Hashtags" }
      },
      required: ["title", "voiceOver", "shotsTable", "textOverlays", "musicVibe", "hashtags"]
    },
  };
}

const parseGeminiResponse = (text: string) => {
  try {
    return JSON.parse(text);
  } catch(e) {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) throw new Error("Format JSON không hợp lệ");
    return JSON.parse(jsonMatch[1]);
  }
}

export const generateViralScript = async (input: ViralInput): Promise<string> => {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Vui lòng cấu hình API Key trong cài đặt.");
    }
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
    Bạn là một chuyên gia Content Creator triệu view trên các nền tảng video ngắn (${input.platform}).
    Hãy viết một kịch bản video chi tiết cho chủ đề sau:
    - Chủ đề chính: ${input.subject}
    - Hook (Câu mở đầu): ${input.hook}
    - Đối tượng mục tiêu: ${input.targetAudience}
    - Cảm xúc chủ đạo: ${input.emotion}
    - Phong cách: ${input.style}
    - Thời lượng dự kiến: ${input.duration}

    YÊU CẦU KỊCH BẢN:
    1. Trình bày dưới dạng Markdown.
    2. Chia thành 2 cột: "Hình ảnh/Video" và "Lời thoại/Voiceover".
    3. Lời thoại phải tự nhiên, bắt trend, phù hợp với nền tảng ${input.platform}.
    4. Đảm bảo Hook được lồng ghép ấn tượng ngay 3 giây đầu.
    5. Kết thúc bằng một lời kêu gọi hành động (CTA) mạnh mẽ.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ text: prompt }] },
    });

    return response.text || "Không thể tạo kịch bản.";
};

export const generateHooksAndSubjects = async (
    productName: string,
    industry: Industry,
    targetAudience: TargetAudience,
    ageGroup: AgeGroup,
    sellingFactor: SellingFactor,
    sportType: string,
    imageFile?: File | null
): Promise<ViralHookSubject[]> => {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Vui lòng cấu hình API Key trong cài đặt.");
    }
    const ai = new GoogleGenAI({ apiKey });
    
    let parts: any[] = [];
    if (imageFile) {
        const imagePart = await fileToGenerativePart(imageFile);
        parts.push(imagePart);
    }

    const prompt = `
    Bạn là một chuyên gia sáng tạo nội dung Viral cho TikTok đa ngành nghề.
    Dựa trên thông tin sản phẩm:
    - Tên sản phẩm: ${productName}
    - Ngành hàng: ${industry}
    - Đối tượng: ${targetAudience}
    - Độ tuổi: ${ageGroup}
    - Yếu tố bán hàng chủ đạo: ${sellingFactor}
    - Chi tiết cụ thể: ${sportType}

    Hãy tạo 5 bộ (Hook + Chủ đề + Mô tả ngắn) cực kỳ thu hút và có khả năng viral cao.
    Yêu cầu:
    - Hook: Câu mở đầu gây tò mò, đánh vào nỗi đau hoặc lợi ích (dưới 15 từ).
    - Chủ đề: Tên ngắn gọn cho kịch bản (ví dụ: "Review sản phẩm X", "Mẹo sử dụng Y cực hay").
    - Mô tả: 1 câu tóm tắt nội dung video sẽ nói về cái gì.
    - Ngôn ngữ: Tự nhiên, bắt trend, phù hợp với đối tượng mục tiêu.
    - Trả về mảng JSON.
    `;
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        hook: { type: Type.STRING },
                        subject: { type: Type.STRING },
                        description: { type: Type.STRING }
                    },
                    required: ["id", "hook", "subject", "description"]
                }
            }
        }
    });

    return JSON.parse(response.text);
};

export const generateScript = async (
    imageFile: File, 
    scriptType: ScriptType, 
    productName: string, 
    idea: string, 
    duration: number = 45, 
    gender?: Gender, 
    industry?: Industry, 
    scriptGoal?: ScriptGoal, 
    hookType?: HookType,
    refinementInstruction?: string,
    targetAudience?: TargetAudience,
    contentStyle?: ContentStyle,
    userSuggestions?: string
): Promise<SingleScript[]> => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Vui lòng cấu hình API Key trong cài đặt.");
  }
  const ai = new GoogleGenAI({ apiKey });
  const imagePart = await fileToGenerativePart(imageFile);
  
  const targetChars = Math.round(duration * 17.5);

  const prompt = `
    Bạn là một chuyên gia sáng tạo nội dung TikTok đa ngành nghề. 
    Bạn hiểu rõ các đặc tính của sản phẩm, tâm lý khách hàng và cách tạo nội dung thu hút trên video ngắn.
    Hãy tạo 3 kịch bản video cho sản phẩm "${productName}".
    
    YÊU CẦU QUAN TRỌNG VỀ GIỌNG VĂN (VITAL):
    - Tuyệt đối KHÔNG dùng ngôn ngữ quảng cáo sáo rỗng như: "Tuyệt vời", "Đỉnh cao", "Siêu phẩm".
    - Hãy viết lời thoại (Voice-over) theo phong cách MÁCH NƯỚC, CHIA SẺ KINH NGHIỆM hoặc KỂ CHUYỆN.
    - Ngôn ngữ phải cực kỳ CHÂN THẬT, TỰ NHIÊN, ĐỜI THƯỜNG.
    - Sử dụng các từ đệm, từ cảm thán đời thường phù hợp với đối tượng ${targetAudience}.
    - Nhấn mạnh vào GIÁ TRỊ THỰC TẾ và TRẢI NGHIỆM người dùng.
    
    THÔNG SỐ KỸ THUẬT:
    - Thời lượng mục tiêu: ${duration} giây.
    - Loại hình: ${industry}.
    - Đối tượng: ${targetAudience}.
    - Style: ${contentStyle || 'Review thực tế'}.
    - Đảm bảo độ dài voice-over khớp với thời lượng (khoảng ${targetChars} ký tự).
    
    CẤU TRÚC: Trả về JSON chứa bảng cảnh quay Markdown và lời thoại tự nhiên nhất có thể.
    ${idea ? `\nÝ tưởng chính: ${idea}` : ''}
    ${userSuggestions ? `\nGợi ý/Yêu cầu cụ thể từ người dùng: ${userSuggestions}` : ''}
    ${refinementInstruction ? `\nYêu cầu điều chỉnh kịch bản hiện tại: ${refinementInstruction}` : ''}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, { text: prompt }] },
    config: {
      responseMimeType: 'application/json',
      responseSchema: getResponseSchema(scriptType),
    }
  });

  return parseGeminiResponse(response.text);
};

export const cloneScript = async (
    originalContent: string, 
    scriptType: ScriptType, 
    productName: string, 
    duration: number = 45, 
    gender?: Gender, 
    industry?: Industry,
    refinementInstruction?: string,
    targetAudience?: TargetAudience,
    contentStyle?: ContentStyle,
    userSuggestions?: string
): Promise<SingleScript[]> => {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Vui lòng cấu hình API Key trong cài đặt.");
    }
    const ai = new GoogleGenAI({ apiKey });
    const targetChars = Math.round(duration * 17.5);

    const prompt = `
    Dựa trên nội dung gốc: "${originalContent}", hãy viết lại thành 3 bản kịch bản mới cho "${productName}".
    
    PHONG CÁCH:
    - Đa dạng ngành nghề, phù hợp với nền tảng video ngắn.
    - Làm cho kịch bản nghe "ĐỜI" hơn, tự nhiên và gần gũi. 
    - Biến những câu chữ quảng cáo khô khan thành lời chia sẻ thực tế.
    - Tập trung vào lợi ích cốt lõi, giải quyết vấn đề và trải nghiệm sử dụng.
    
    YÊU CẦU:
    - Thời lượng: ${duration} giây.
    - Lời thoại (Voice-over): Khoảng ${targetChars} ký tự.
    - Có bảng phân cảnh chi tiết (Cảnh | Mô tả | Giây).
    ${userSuggestions ? `\nGợi ý/Yêu cầu cụ thể từ người dùng: ${userSuggestions}` : ''}
    ${refinementInstruction ? `\nYêu cầu điều chỉnh kịch bản hiện tại: ${refinementInstruction}` : ''}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
            responseMimeType: 'application/json',
            responseSchema: getResponseSchema(scriptType),
        }
    });

    return parseGeminiResponse(response.text);
}
