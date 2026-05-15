import express from "express";
import bodyParser from "body-parser";
import { MultipleWordPairController } from "../controllers/multiplewordpairbyai";
import { WordPairsFromChatGPTService } from "../services/WordPairsFromChatGPTService";
import { WordPairsFromAzureGPTService } from "../services/wordPairsFromAzureGpt";
import { WordPairsFromGeminiService } from "../services/wordPairFromGemini";

const wordPairsFromChatGTPService = new WordPairsFromChatGPTService();
const wordPairsFromAzureGPTService = new WordPairsFromAzureGPTService();
const geminiService = new WordPairsFromGeminiService();

const router = express.Router();
const multipWordPairsController = new MultipleWordPairController(
  wordPairsFromChatGTPService,
  wordPairsFromAzureGPTService,
  geminiService
);

router.use(bodyParser.json());

router.post("/getwordpairs", multipWordPairsController.getWordPairs);
router.post(
  "/getwordpairsfromazuregpt",
  multipWordPairsController.getWordPairsFromAzureGpt
);
router.post(
  "/getwordpairsfromgemini",
  multipWordPairsController.getWordPairsFromGemini
);

export default router;
