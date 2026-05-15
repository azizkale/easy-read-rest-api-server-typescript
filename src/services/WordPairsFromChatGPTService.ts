import OpenAI from "openai";
import { WordPairService } from "./wordPairService";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export class WordPairsFromChatGPTService {
  getMultipleWordPairs = async (
    text: string,
    listWordPairs: any[],
    chapterId: any,
    pirId: any,
    editorId: any
  ): Promise<any[]> => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `
          Sen iyi bir asistansın. Aşağıdaki metni baştan sona tara ve belirtilen kriterlere uygun kelimeleri tespit et:
          
          Metin: "${text}"

          Kriterler:
          - Günümüz Türkçesinde sık veya hiç kullanılmayan
          - Özellikle Osmanlıca, Arapça, Farsça, Fransızca kökenli olan 
          - veya öz türkçe olmayan
          - Bediüzzaman Said Nursi'nin kitaplarında geçen kelimelere benzeyen
          - Risale-i Nur Külliyatı'nda geçen kelimelere benzeyen
          - Fethullah Gülen'in kitaplarında veya vaazlarında geçen kelimelere benzeyen
          - Dini bir terim olabilecek veya olan
          - Kelimelerin anlamlarını metindeki/cümledeki kontkslerine göre verir misin.
          - Kelimeyi metindeki hali ile verir misin. Çekimleme yapma lütfen. 
          - Ekleri varsa çıkarma lütfen. Ekleri yoksa ek ekleme lütfen
          - Metinde geçmeyen kelimelerin anlamlarına bakma lütfen.
          - Gerektiğinde "ç,ğ,ı,ş,ö" gibi Türkçe harflari kullan lütfen.

          Tespit ettiğin kelimeler ve anlamlarını aşağıdaki WordPair interface formatında JSON nesneleri olarak oluşturur musun:

          interface WordPair {
            wordPairId: any;
            word: string;
            meaning: string;
            chapterId: any;
            pirId: any;
            editorId: any
          }

          Oluşturduğun JSON nesnelerinin hepsinde bazı değişkenler aşağıdaki gibi olsun lütfen;
            wordPairId = 13 basamaklı random bir sayıi fakat tüm nesnelerinki birbirinden farklı olsun lütfen         
            
            chapterId= ${chapterId}
            pirId = ${pirId}
            editorId = ${editorId}

          Sonra '${listWordPairs}' dizisine bak. Eğer oluşturduğun Bu JSON nesneleri bu dizide yoksa bu diziye ekle. Eğer varsa ekleme. Diziyi sıfırlama, mevcut dataların üzerine ekleme yap lütfen.
          Taramayı 3 kez yapar mısın ve her seferinde listeyi kontrol eder misin. Var olan kelimeleri listeye ekleme lütfen. Her taramada üstteki kriterlere uygun yeni kelimeleri listeye ekle lütfen.

          Çıktı olarak sadece JSON array ver, başka metin ekleme lütfen.
          `,
          },
        ],
      });

      const completion = response.choices[0].message?.content;
      if (!completion) {
        throw new Error("No content in completion response");
      }
      // Extract JSON part from response
      const jsonMatch = completion.match(/\[.*\]/s);
      if (!jsonMatch) {
        throw new Error("No JSON array found in completion response");
      }

      let responseData: any[];
      try {
        responseData = JSON.parse(jsonMatch[0]);
      } catch (error: any) {
        throw new Error("Failed to parse JSON response: " + error.message);
      }

      if (!Array.isArray(responseData)) {
        return listWordPairs;
      } else {
        //adding new wordpairs to listWordPairs (if listWordPairs doesn't include new words in the responseData)
        const uniqueWords = responseData.filter((responseWord) => {
          return !listWordPairs.some(
            (existingWord) => existingWord.word === responseWord.word
          );
        });

        // Add the unique words to listWordPairs
        listWordPairs.push(...uniqueWords);
        return listWordPairs;
      }
    } catch (error) {
      console.error("Error creating completion:", error);
      throw error;
    }
  };
}
