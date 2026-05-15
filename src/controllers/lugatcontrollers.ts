import axios from "axios";
import { Request, Response } from "express";

export class LugatController {
  getWordOfMeaning = async (req: Request, res: Response) => {
    try {
      const word = req.query.word;

      if (!word) {
        return res
          .status(400)
          .send({ error: 'Missing "word" parameter in the query.' });
      }  
      const response = await axios.get(
        `https://lugat-api.osmanlica.online/api/kelime?kelime=${word}`
      );

      if (response.data ?? false) {
        const meanings = response.data.data
  .filter((item: any) => item.eser_isim === "Luggat")
  .map((item: any) => item.temiz_mana);

      res.send(meanings);
       
        console.log(meanings)
      } else {
        console.log(`${word} kelimesinin anlamı bulunamadı`);
        res.status(404).send({ error: "Word not found" });
      }
    } catch (error: any) {
      console.error(`Error: ${error.message}`);
      res.status(500).send({ error: "Internal Server Error" });
    }
  };
}
