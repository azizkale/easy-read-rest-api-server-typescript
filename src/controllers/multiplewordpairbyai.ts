import { Request, Response } from "express";
import { WordPairsFromChatGPTService } from "../services/WordPairsFromChatGPTService";
import { WordPairsFromAzureGPTService } from "../services/wordPairsFromAzureGpt";
import { WordPairsFromGeminiService } from "../services/wordPairFromGemini";
export class MultipleWordPairController {
  private wordPairsFromChatGTPService: WordPairsFromChatGPTService;
  private wordPairsFromAzureGPTService: WordPairsFromAzureGPTService;
  private wordPairsFromGeminiService: WordPairsFromGeminiService;

  constructor(
    wordPairsFromChatGTPService: WordPairsFromChatGPTService,
    wordPairsFromAzureGPTService: WordPairsFromAzureGPTService,
    wordPairsFromGeminiService: WordPairsFromGeminiService

  ) {
    this.wordPairsFromChatGTPService = wordPairsFromChatGTPService;
    this.wordPairsFromAzureGPTService = wordPairsFromAzureGPTService;
    this.wordPairsFromGeminiService = wordPairsFromGeminiService;
  }

  getWordPairs = async (req: Request, res: Response) => {
    const { text, listWordPairs, chapterId, pirId, editorId } = req.body;
    return this.wordPairsFromChatGTPService
      .getMultipleWordPairs(text, listWordPairs, chapterId, pirId, editorId)
      .then(async (wordpairs) => {
        return res.status(200).send(wordpairs);
      })
      .catch((error) => {
        return res.status(401).send(error.message);
      });
  };

  getWordPairsFromAzureGpt = async (req: Request, res: Response) => {
    const { text, listWordPairs, chapterId, pirId, editorId } = req.body;
    return this.wordPairsFromAzureGPTService
      .getMultipleWordPairs(text, listWordPairs, chapterId, pirId, editorId)
      .then(async (wordpairs) => {
        return res.status(200).send(wordpairs);
      })
      .catch((error) => {
        return res.status(401).send(error.message);
      });
  };

 getWordPairsFromGemini = async (req: Request, res: Response) => {
    const { text, listWordPairs, chapterId, pirId, editorId } = req.body;
    return this.wordPairsFromGeminiService
      .getMultipleWordPairs(text, listWordPairs, chapterId, pirId, editorId)
      .then(async (wordpairs) => {
        return res.status(200).send(wordpairs);
      })
      .catch((error) => {
        return res.status(401).send(error.message);
      });
  };
}
