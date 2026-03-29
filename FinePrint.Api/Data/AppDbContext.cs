using Microsoft.EntityFrameworkCore;
using Pgvector.EntityFrameworkCore;

namespace FinePrint.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<PolicyChunk> PolicyChunks => Set<PolicyChunk>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("vector");

        modelBuilder.Entity<PolicyChunk>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Embedding).HasColumnType("vector(1536)");
            entity.HasIndex(e => e.FileName);
        });
    }
}