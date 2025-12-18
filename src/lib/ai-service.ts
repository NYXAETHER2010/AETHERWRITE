import ZAI from 'z-ai-web-dev-sdk'

export async function generateContent(promptTemplate: string, variables: Record<string, any> = {}) {
  try {
    const zai = await ZAI.create()
    
    // Inject variables into prompt template
    let prompt = promptTemplate
    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replace(`{{${key}}}`, String(value))
    }

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful fiction writing assistant. Always respond with creative, engaging content for fiction novels.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: process.env.AI_MODEL || 'meta-llama/llama-3.3-70b-instruct',
      temperature: 0.8,
      max_tokens: 2000
    })

    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('AI generation failed:', error)
    throw new Error('Failed to generate content. Please try again.')
  }
}

// Prompt templates
export const PROMPT_TEMPLATES = {
  idea_generator: `Based on this book idea: "{{idea_input}}", generate a comprehensive fiction novel concept including:
1. Main Idea (2-3 sentences)
2. Genre (specific fiction sub-genre)
3. Key Characters (2-4 main characters with brief descriptions)
4. Writing Style & Tone (describe the narrative voice and atmosphere)

Format your response as JSON:
{
  "main_idea": "...",
  "genre": "...",
  "characters": ["Character 1: description", "Character 2: description"],
  "style_tone": "..."
}`,

  title_generator: `Based on this novel concept:
Main Idea: {{main_idea}}
Genre: {{genre}}
Characters: {{characters}}
Style: {{style_tone}}

Generate 5-8 compelling book titles that match the genre and tone. Return only the titles, one per line.`,

  outline_generator: `Create a structured outline for a fiction novel with:
Title: {{title}}
Main Idea: {{main_idea}}
Genre: {{genre}}
Characters: {{characters}}
Style: {{style_tone}}

Generate a 3-act structure with 8-12 chapters total. Format as JSON:
{
  "act_1": {
    "title": "Act 1: Setup",
    "chapters": [
      {"number": 1, "title": "Chapter Title", "summary": "Brief summary"}
    ]
  },
  "act_2": {
    "title": "Act 2: Confrontation", 
    "chapters": [
      {"number": 2, "title": "Chapter Title", "summary": "Brief summary"}
    ]
  },
  "act_3": {
    "title": "Act 3: Resolution",
    "chapters": [
      {"number": 3, "title": "Chapter Title", "summary": "Brief summary"}
    ]
  }
}`,

  cover_prompt: `Based on this novel:
Title: {{title}}
Genre: {{genre}}
Main Idea: {{main_idea}}
Style: {{style_tone}}

Generate a detailed text prompt for creating a book cover image. Describe the visual style, mood, key elements, and composition. The prompt should be suitable for AI image generation.`,

  chapter_generator: `Write a {{chapter_type}} for this novel:
Title: {{title}}
Genre: {{genre}}
Main Idea: {{main_idea}}
Characters: {{characters}}
Style: {{style_tone}}
Outline: {{outline}}
{{previous_chapter_summary}}

Chapter {{chapter_number}}: {{chapter_title}}
Summary: {{chapter_summary}}

Write the full chapter content (500-1500 words) that matches the established style and tone. Ensure it flows naturally from previous events.`
}