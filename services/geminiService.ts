
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateBackendModule(moduleName: string, stack: 'Java' | 'Python'): Promise<string> {
  const prompt = stack === 'Java' 
    ? `As a Java Spring Boot expert, generate a full module named "${moduleName}" following the standard layered architecture. 
       Include: Controller, Service Interface + Impl, DAO Interface + Impl, Entity, DTO, Mapper, and Security (JWT/Filter).
       Use OOP principles, clean code, and provide the directory structure first, then the code for each file.`
    : `As a Python FastAPI/Django expert, generate a full module named "${moduleName}" following a Pythonic layered architecture.
       Include: Router (Controller), Service, Repository (DAO), Model (Entity), Schema (DTO), Mapper, and Security (JWT/OAuth2).
       Use Pydantic for schemas and SQLModel/SQLAlchemy for models. Provide the directory structure first, then the code for each file.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 2000 }
      },
    });
    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating module. Please check your connection or API key.";
  }
}
