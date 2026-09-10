import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Increase payload limit for base64 image reference uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy client creator
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Image Generation API
app.post('/api/generate-logo', async (req, res) => {
  try {
    const {
      prompt,
      imageSize = '4K',
      aspectRatio = '1:1',
      referenceImage, // optional base64 string
      referenceMimeType = 'image/jpeg',
    } = req.body;

    if (!prompt && !referenceImage) {
      return res.status(400).json({ error: 'A text prompt or reference image is required.' });
    }

    const ai = getGeminiClient();

    // Candidate models in order of priority, starting with gemini-3-pro-image-preview as requested
    const candidateModels = [
      'gemini-3-pro-image-preview',
      'gemini-3-pro-image',
      'gemini-3.1-flash-image',
      'gemini-3.1-flash-lite-image',
    ];

    // Supported sizes: "1K" | "2K" | "4K"
    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : '4K';

    const parts: any[] = [];
    if (referenceImage) {
      const cleanBase64 = referenceImage.replace(/^data:image\/[a-z0-9+]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: referenceMimeType,
          data: cleanBase64,
        },
      });
    }

    const enhancedPrompt = prompt
      ? prompt
      : 'Generate this exact logo in 4K resolution (2000x2000px format): 3D twisting ribbon letter S logo with vibrant cyan blue to royal blue to hot magenta pink gradient, glossy satin depth, perfectly centered on a solid black background, sharp pristine vector-like quality.';

    parts.push({ text: enhancedPrompt });

    let lastError: any = null;
    let imageFound: { data: string; mimeType: string } | null = null;
    let successfulModel = '';

    for (const modelName of candidateModels) {
      try {
        console.log(`[API] Attempting image generation with model: ${modelName} at size: ${chosenSize}`);
        
        // Lite model doesn't support imageSize or 4K, only flash-image and pro-image do
        const isLite = modelName.includes('flash-lite');
        const config: any = {
          imageConfig: {
            aspectRatio: aspectRatio || '1:1',
            ...(isLite ? {} : { imageSize: chosenSize }),
          },
        };

        const response = await ai.models.generateContent({
          model: modelName,
          contents: { parts },
          config,
        });

        const candidates = response.candidates;
        if (candidates && candidates.length > 0) {
          const responseParts = candidates[0].content?.parts || [];
          for (const part of responseParts) {
            if (part.inlineData && part.inlineData.data) {
              imageFound = {
                data: part.inlineData.data,
                mimeType: part.inlineData.mimeType || 'image/png',
              };
              successfulModel = modelName;
              break;
            }
          }
        }

        if (imageFound) {
          break;
        }
      } catch (err: any) {
        console.warn(`[API] Model ${modelName} error:`, err?.message || err);
        lastError = err;
        // Continue to next fallback model
      }
    }

    if (!imageFound) {
      const errorMessage = lastError?.message || 'No image was returned by the generation model.';
      return res.status(500).json({
        error: errorMessage,
        details: 'The AI model could not generate the image at this moment. You can still use the built-in high-precision 4K & 2000x2000px canvas and vector engine.',
      });
    }

    return res.json({
      success: true,
      imageUrl: `data:${imageFound.mimeType};base64,${imageFound.data}`,
      base64Data: imageFound.data,
      mimeType: imageFound.mimeType,
      modelUsed: successfulModel,
      imageSize: chosenSize,
    });
  } catch (error: any) {
    console.error('[API] Generation failed:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate logo image.',
    });
  }
});

// Vite middleware for dev or static for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Logo Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
