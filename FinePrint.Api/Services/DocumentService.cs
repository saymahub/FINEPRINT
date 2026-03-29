using FinePrint.Api.Data;
using Pgvector;
using UglyToad.PdfPig;

namespace FinePrint.Api.Services;

public class DocumentService(AppDbContext db, EmbeddingService embedServ)
{
    private const int ChunkSize = 500;
    private const int ChunkOverlap = 50;

    public async Task<int> IngestDocumentAsync(IFormFile file)
    {
        var text = ExtractTextFromPdf(file);
        var chunks = ChunkText(text);
        var chunksAdded = 0;

        foreach (var (chunk, index) in chunks.Select((c, i) => (c, i)))
        {
            var embedding = await embedServ.GetEmbeddingAsync(chunk);

            db.PolicyChunks.Add(new PolicyChunk
            {
                FileName = file.FileName,
                Content = chunk,
                ChunkIndex = index,
                Embedding = new Vector(embedding)
            });

            chunksAdded++;
        }

        await db.SaveChangesAsync();
        return chunksAdded;
    }

    private static string ExtractTextFromPdf(IFormFile file)
    {
        using var stream = file.OpenReadStream();
        using var pdf = PdfDocument.Open(stream);

        return string.Join(" ", pdf.GetPages().Select(p => p.Text));
    }

    private static List<string> ChunkText(string text)
    {
        var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var chunks = new List<string>();

        for (int i = 0; i < words.Length; i += ChunkSize - ChunkOverlap)
        {
            var chunk = string.Join(" ", words.Skip(i).Take(ChunkSize));
            if (!string.IsNullOrWhiteSpace(chunk))
                chunks.Add(chunk);
        }

        return chunks;
    }
}