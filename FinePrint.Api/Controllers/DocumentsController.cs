using FinePrint.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FinePrint.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController(DocumentService documentService) : ControllerBase
{
    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file provided.");

        if (!file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
            return BadRequest("Only PDF files are supported.");

        var chunksAdded = await documentService.IngestDocumentAsync(file);
        return Ok(new { message = $"Ingested {chunksAdded} chunks from {file.FileName}" });
    }
}