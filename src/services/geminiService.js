import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const parseEmailWithGemini = async (emailContent) => {
  try {
    console.log('Starting Gemini parsing...');
    const prompt = `
      Extract supplier and quote information from this email into a structured JSON format.
      
      Rules for extraction:
      1. For phone numbers: Extract only the phone number without email or address
      2. For address: Extract the complete address line
      3. For email: Extract only the email address
      4. For certifications: Create an array of individual certifications
      5. For prices: Extract only the numeric value
      6. For company name: Extract the complete company name

      Required format:
      {
        "supplier": {
          "company_name": "",
          "contact_name": "",
          "contact_email": "",
          "contact_phone": "",
          "hq_address": ""
        },
        "quote": {
          "price_per_pound": 0,
          "minimum_order_quantity": 0,
          "country_of_origin": "",
          "certifications": []
        }
      }

      Examples of correct parsing:
      - Phone: "+1 (555) 123-4567" (not including email or address)
      - Address: "1234 Orchard Lane, Fresno, CA, 93722"
      - Email: "janedoe@nutrasource.com"
      - Price: Should be numeric only (e.g., 3.50 not "$3.50")
      - MOQ: Should be numeric only (e.g., 5000 not "5,000 pounds")

      Parse this email content:
      ${emailContent}
      
      Return only the JSON object without any additional text.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract JSON using a regular expression
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    const cleanedResponseText = jsonMatch 
      ? jsonMatch[1] 
      : responseText.replace(/```json|```/g, '').trim();

    try {
      console.log(cleanedResponseText)
      const parsedData = JSON.parse(cleanedResponseText);
      return parsedData;
    } catch (jsonError) {
      console.error("Gemini JSON parsing error:", jsonError);
      console.error("Raw response text:", responseText);
      
      // Attempt to clean the response further
      const cleanedText = cleanedResponseText
        .replace(/[\n\r]+/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      try {
        const fallbackParsedData = JSON.parse(cleanedText);
        return fallbackParsedData;
      } catch (fallbackError) {
        console.error("Fallback JSON parsing failed:", fallbackError);
        throw new Error("Unable to parse Gemini response");
      }
    }
  } catch (error) {
    console.error('Gemini parsing error:', error);
    throw error;
  }
};