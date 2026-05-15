import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export class WordPairsFromGeminiService {
  getMultipleWordPairs = async (
    text: string,
    listWordPairs: any[],
    chapterId: any,
    pirId: any,
    editorId: any
  ): Promise<any[]> => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `
              Sen iyi bir asistansın. 
              Aşağıdaki metni baştan sona tara ve belirtilen kriterlere uygun kelimeleri tespit et:

                Metin: "${text}"

                Kriterler:
                - Günümüz Türkçesinde sık veya hiç kullanılmayan
                - Özellikle Osmanlıca, Arapça, Farsça, Fransızca kökenli olan 
                - Öztürkçe olmayan
                - Dini bir terim olabilecek veya olan
                 - Risale-i Nur Külliyatı'nda geçen kelimelere benzeyen
                 - Fethullah Gülen'in kitaplarında veya vaazlarında geçen kelimelere benzeyen

                Tespit ettiğin kelimeleri ve anlamlarını aşağıdaki formatta JSON nesneleri olarak ver:

                {
                "wordPairId": 10 basamaklı benzersiz bir sayı (örneğin: 1234567890),
                "word": "Kelimenin metindeki hali",
                "meaning": "Kelimenin anlamı metindeki bağlamına göre",
                "chapterId": "${chapterId}",
                "pirId": "${pirId}",
                "editorId": "${editorId}"
                }

                Kurallar:
                - Kelimenin anlamını metindeki bağlama göre ver.
                - Kelime metindeki haliyle kalsın; ekleme veya çekimleme yapma.
                - Sadece JSON formatında bir dizi (array) döndür. Başka bir metin ekleme.

                Mevcut kelime listesi: ${JSON.stringify(listWordPairs)}

                Eğer bulduğun kelimeler bu listede yoksa, onları listeye ekle. Eğer varsa ekleme. 
                Listeyi sıfırlama, mevcut listeyi koruyarak yeni kelimeleri ekle. 
                Bu işlemi 2 kez tekrar et.

                Sadece JSON array döndür, başka hiçbir şey ekleme.
        `,
      });

      const completion = response.text;

      if (!completion) {
        throw new Error("No content in Gemini response");
      }

      const jsonMatch = completion.match(/\[.*\]/s);

      if (!jsonMatch) {
        throw new Error("No JSON array found in response");
      }

      const responseData = JSON.parse(jsonMatch[0]);

      const uniqueWords = responseData.filter((responseWord: any) => {
        return !listWordPairs.some(
          (existingWord) => existingWord.word === responseWord.word
        );
      });

      listWordPairs.push(...uniqueWords);

      console.log(listWordPairs)
      return listWordPairs;
    } catch (error) {
      console.error("Error Gemini completion:", error);
      throw error;
    }
  };
}