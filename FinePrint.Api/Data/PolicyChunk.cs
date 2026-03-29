using Pgvector;

namespace FinePrint.Api.Data;

public class PolicyChunk
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int ChunkIndex { get; set; }
    public Vector Embedding { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}