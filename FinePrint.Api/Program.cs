using FinePrint.Api.Data;
using FinePrint.Api.Services;
using Microsoft.EntityFrameworkCore;
using Pgvector.EntityFrameworkCore;
using DotNetEnv;

Env.Load("../.env");

var builder = WebApplication.CreateBuilder(args);

var openAiKey = Environment.GetEnvironmentVariable("OpenAI_key")
    ?? builder.Configuration["OpenAI:ApiKey"]
    ?? throw new InvalidOperationException("OpenAI API key not found. Check .env file.");

var embeddingModel = builder.Configuration["OpenAI:EmbeddingModel"]
    ?? "text-embedding-3-small";

var chatModel = builder.Configuration["OpenAI:ChatModel"]
    ?? "gpt-4o-mini";

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        o => o.UseVector()
    )
);

builder.Services.AddSingleton(_ => new EmbeddingService(openAiKey, embeddingModel));
builder.Services.AddSingleton(_ => new ChatService(openAiKey, chatModel));
builder.Services.AddScoped<DocumentService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowFrontend");
app.MapControllers();

app.MapGet("/", () => Results.Ok(new
{
    status = "FinePrint API is running",
    embeddingModel,
    chatModel,
    keyLoaded = !string.IsNullOrEmpty(openAiKey)
}));

app.Run();