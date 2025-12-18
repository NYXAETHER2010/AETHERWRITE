import ZAI from 'z-ai-web-dev-sdk'

// Test function to verify AI service is working
export async function testAIService() {
  try {
    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: 'Hello, who are you?'
        }
      ],
      model: process.env.AI_MODEL || 'meta-llama/llama-3.3-70b-instruct',
      temperature: 0.8,
      max_tokens: 100
    })

    console.log('AI Service Test - Success:', completion.choices[0]?.message?.content)
    return true
  } catch (error) {
    console.error('AI Service Test - Failed:', error)
    return false
  }
}