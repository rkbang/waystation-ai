import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const parseEmailWithGPT = async (emailContent) => {
  try {
    console.log('Starting OpenAI parsing...');
    console.log(openai.apiKey);
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts information from supplier emails."
        },
        {
          role: "user",
          content: `
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
          `
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    console.log('OpenAI response:', completion.choices[0].message.content);
    // Parse the response
    const parsedData = JSON.parse(completion.choices[0].message.content);
    return parsedData;

  } catch (error) {
    console.error('OpenAI parsing error:', error);
    throw error;
  }
};
