using OpenAI;
using OpenAI.Embeddings;

namespace FinePrint.Api.Services;

public class EmbeddingService(string apiKey, string model)
{
    private readonly EmbeddingClient cli = new(model, apiKey);

    public async Task<float[]> GetEmbeddingAsync(string text)
    {
        var result = await cli.GenerateEmbeddingAsync(text);
        return result.Value.ToFloats().ToArray();
    }
}