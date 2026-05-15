const axios = require("axios");

const apiKey = process.env.AZURE_OPENAI_KEY
const endpoint = process.env.AZURE_ENDPOINT
const deploymentName = "gpt-4";
const apiVersion = "2024-08-01-preview";

export class WordPairsFromAzureGPTService {
  getMultipleWordPairs = async (
    text: string,
    listWordPairs: any[],
    chapterId: any,
    pirId: any,
    editorId: any
  ): Promise<any[]> => {
    try {
      const response = await axios.post(
        `${endpoint}openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`,
        {
          messages: [
            {
              role: "user",
              content: `
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
            },
          ],
          //max_tokens: 8192, // Dönen yanıtın maksimum uzunluğu
          temperature: 0.7, // Yanıtların rastgeleliğini kontrol eder
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
          },
        }
      );

      const completion = response.data.choices[0].message.content;

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
