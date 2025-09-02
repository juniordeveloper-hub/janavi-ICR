// backend/src/services/geminiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ExtractedData {
  name: string;
  phone: string;
  email: string;
  designation: string;
  company: string;
  confidence: number;
}

export const extractLeadData = async (imageBuffer: Buffer, mimeType: string): Promise<ExtractedData> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `
    Analyze this image (business card, handwritten note, or document) and extract the following information:
    
    1. Name (person's full name)
    2. Phone (phone number)
    3. Email (email address)
    4. Designation (job title/position)
    5. Company (company/organization name)
    
    Return ONLY a JSON object with these exact keys: name, phone, email, designation, company
    If any information is not found, use an empty string "".
    Do not include any explanation, just the JSON.
    
    Example format:
    {
      "name": "John Doe",
      "phone": "+1-234-567-8900",
      "email": "john@company.com",
      "designation": "Software Engineer",
      "company": "Tech Corp"
    }
    `;

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: mimeType
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean the response to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }

    const extractedData = JSON.parse(jsonMatch[0]);
    
    // Calculate confidence based on how many fields were extracted
    const fields = [extractedData.name, extractedData.phone, extractedData.email, 
                   extractedData.designation, extractedData.company];
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    const confidence = filledFields / 5;

    return {
      ...extractedData,
      confidence
    };

  } catch (error) {
    console.error('Gemini extraction error:', error);
    throw new Error('Failed to extract data from image');
  }
};