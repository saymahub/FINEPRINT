// using FinePrint.Api.Data;
// using FinePrint.Api.Services;
// using Microsoft.EntityFrameworkCore;
// using Pgvector.EntityFrameworkCore;
using DotNetEnv;

Env.Load("../.env");

var builder = WebApplication.CreateBuilder(args);


var openAiKey = Environment.GetEnvironmentVariable("OpenAI_key")
    ?? builder.Configuration["OpenAI:ApiKey"]
    ?? throw new InvalidOperationException("OpenAI API key not found. Check your .env file.");

var embeddingModel = builder.Configuration["OpenAI:EmbeddingModel"]
    ?? "text-embedding-3-small";

var chatModel = builder.Configuration["OpenAI:ChatModel"]
    ?? "gpt-4o-mini";

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/", () => Results.Ok(new
{
    status = "FinePrint API is running",
    embeddingModel,
    chatModel,
    keyLoaded = !string.IsNullOrEmpty(openAiKey)
}));

app.Run();