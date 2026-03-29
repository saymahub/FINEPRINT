using OpenAI;
using OpenAI.Chat;

namespace FinePrint.Api.Services;

public class ChatService(string apiKey, string model)
{
    private readonly ChatClient _client = new(model, apiKey);

    public async Task<string> AskAsync(string question, List<string> contextChunks)
    {
        var context = string.Join("\n\n---\n\n", contextChunks);

        var messages = new List<ChatMessage>
        {
            ChatMessage.CreateSystemMessage($"""
                You are an insurance claims assistant. Answer the adjuster's question 
                using ONLY the policy excerpts provided below. If the answer isn't 
                in the excerpts, say so clearly. DO NOT GUESS.
                
                Always cite which part of the policy supports your answer.
                
                POLICY EXCERPTS:
                {context}
                """),
            ChatMessage.CreateUserMessage(question)
        };

        var result = await _client.CompleteChatAsync(messages);
        return result.Value.Content[0].Text;
    }
}