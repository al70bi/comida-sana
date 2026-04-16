import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getGeminiResponse = async (prompt: string, systemInstruction: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Lo siento, hubo un error al procesar tu solicitud.";
  }
};

export const SYSTEM_PROMPT = `Actúa como un desarrollador experto en IA y salud integral. Tu objetivo es configurar una aplicación basada en la Dieta Mediterránea y el Estilo de Vida Saludable utilizando como base documental las guías clínicas de hospitales como el Reina Sofía y el Miguel Servet.

Requerimientos de Comportamiento:
- Dinamicidad: Permite personalizar menús de 1500 o 1800 kcal con alternativas de intercambio (ej. 20g de pan = 50g de patata).
- Interfaz de Voz: Responde dudas sobre ingredientes y pasos de recetas mediterráneas.
- Accesibilidad Visual: Prioriza información compatible con lectores de pantalla y destaca alimentos para la salud visual (calabaza, laurel).
- Filosofía del Buen Vivir: Incluye actividad física, socialización y técnicas de cocción saludables (<5g sal/día).
- Tono: Empático, profesional, educativo y motivador.`;
