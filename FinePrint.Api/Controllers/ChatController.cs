using FinePrint.Api.Data;
using FinePrint.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pgvector;
using Pgvector.EntityFrameworkCore;

namespace FinePrint.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController(AppDbContext db, EmbeddingService embedServ,ChatService chatServ) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Ask([FromBody] ChatRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Question))
            return BadRequest("A question is required!");

        // Embed the question
        var embedQuestion = await embedServ.GetEmbeddingAsync(request.Question);
        var vector = new Vector(embedQuestion);

        // Find the top 5 most similar chunks
        var topChunks = await db.PolicyChunks
            .OrderBy(c => c.Embedding.CosineDistance(vector))
            .Take(5)
            .Select(c => new { c.FileName, c.Content, c.ChunkIndex })
            .ToListAsync();

        if (!topChunks.Any())
            return Ok(new { answer = "No policy documents have been uploaded yet." });

        // Ask the LLM with the retrieved context
        var contextChunks = topChunks.Select(c => $"[{c.FileName}]\n{c.Content}").ToList();
        var answer = await chatServ.AskAsync(request.Question, contextChunks);

        return Ok(new
        {
            answer,
            sources = topChunks.Select(c => new { c.FileName, c.ChunkIndex })
        });
    }
}

public record ChatRequest(string Question);