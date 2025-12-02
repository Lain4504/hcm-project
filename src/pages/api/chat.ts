import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';

// API route này cần chạy server-side, không được prerender tĩnh
export const prerender = false;

const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY chưa được cấu hình trong biến môi trường của Astro.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!genAI) {
      return new Response(
        JSON.stringify({
          answer:
            'Server chưa được cấu hình GEMINI_API_KEY. Vui lòng liên hệ người quản trị hệ thống.',
          sources: [],
        }),
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const question = typeof body?.question === 'string' ? body.question.trim() : '';

    if (!question) {
      return new Response(
        JSON.stringify({ detail: 'Câu hỏi không được để trống' }),
        { status: 400 }
      );
    }

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

Câu hỏi của sinh viên: ${question}

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
    let answer = response.text();

    if (!answer) {
      answer =
        'Xin lỗi, tôi chưa thể tạo được câu trả lời phù hợp cho câu hỏi này. ' +
        'Bạn hãy thử diễn đạt lại câu hỏi rõ hơn trong phạm vi môn HCM202 của Trường Đại học FPT (Tư tưởng Hồ Chí Minh).';
    }

    return new Response(
      JSON.stringify({
        answer,
        sources: [],
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err: any) {
    console.error('Lỗi khi xử lý câu hỏi ở Astro API /api/chat:', err);
    return new Response(
      JSON.stringify({
        detail: `Lỗi khi xử lý câu hỏi: ${String(err?.message || err)}`,
      }),
      { status: 500 }
    );
  }
};


