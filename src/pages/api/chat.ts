import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== 'string' || !question.trim()) {
      return new Response(
        JSON.stringify({ error: 'Câu hỏi không được để trống' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Lấy API key từ environment variable (server-side, không phải PUBLIC_)
    const apiKey = import.meta.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY chưa được cấu hình' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const systemInstruction = `Bạn là trợ lý AI cho môn học HCM202 - Tư tưởng Hồ Chí Minh tại Trường Đại học FPT.
Nhiệm vụ của bạn là hỗ trợ sinh viên hiểu và ôn tập đúng chuẩn môn HCM202 của ĐH FPT.

Hướng dẫn trả lời:
- Sử dụng tiếng Việt, văn phong rõ ràng, dễ hiểu.
- Có thể có một đoạn mở đầu rất ngắn (2–3 câu) để giới thiệu khái quát vấn đề.
- Phần nội dung chính ưu tiên trả lời theo dạng gạch đầu dòng, nêu các ý CHÍNH quan trọng.
- Với các câu hỏi lý thuyết kiểu "trình bày", "phân tích", "chứng minh"..., hãy liệt kê hệ thống luận điểm chính (khoảng 5–10 ý), mỗi ý giải thích chi tiết vừa phải (2–4 câu/ý).
- Ưu tiên các nội dung bám sát chương trình HCM202 (ĐH FPT): khái niệm, nội dung cơ bản, ý nghĩa, vận dụng.
- Nếu câu hỏi vượt ra ngoài phạm vi môn học, hãy trả lời ở mức khái quát và nói rõ phần nào là mở rộng.
- Tuyệt đối không bịa đặt thông tin lịch sử: nếu không chắc, hãy nói không chắc hoặc gợi ý hướng tự tra cứu thêm.`;

    const userPrompt = `Bối cảnh môn học:
- Môn: HCM202 - Tư tưởng Hồ Chí Minh
- Trường: Đại học FPT

Câu hỏi của sinh viên: ${question.trim()}

Yêu cầu cách trả lời:
- Có thể mở đầu bằng 1 đoạn ngắn (2–3 câu) giới thiệu khái quát nội dung.
- Sau đó trình bày CHÍNH dưới dạng gạch đầu dòng, nêu đúng các luận điểm quan trọng, mỗi ý giải thích chi tiết vừa phải (khoảng 2–4 câu/ý).
- Không cần phần kết luận dài; tập trung hệ thống hóa các ý chính để người học dễ ôn tập.
- Nếu câu hỏi không phù hợp với môn HCM202, hãy lịch sự nói rõ điều đó và hướng người hỏi tới nội dung đúng hơn.`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 3072,
      },
    });

    const response = result.response;
    const answer = response.text();

    return new Response(
      JSON.stringify({
        answer: answer || 'Xin lỗi, tôi chưa thể tạo được câu trả lời phù hợp cho câu hỏi này. Bạn hãy thử diễn đạt lại câu hỏi rõ hơn trong phạm vi môn HCM202 của Trường Đại học FPT (Tư tưởng Hồ Chí Minh).',
        sources: [],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(
      JSON.stringify({
        error: 'Lỗi khi xử lý câu hỏi. Vui lòng thử lại sau.',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

