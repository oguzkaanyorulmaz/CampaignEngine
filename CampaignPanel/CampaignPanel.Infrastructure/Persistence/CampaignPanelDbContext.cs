using CampaignPanel.Domain.Entities;
using CampaignPanel.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CampaignPanel.Infrastructure.Persistence
{
    // ---------- FraudGuard mevcut entity (Users tablosu) ----------
    public class EUser
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Mail { get; set; } = string.Empty;
        public string PasswordUnderSHA256 { get; set; } = string.Empty;
        public int Role { get; set; }
    }

    // ---------- DbContext ----------
    public class CampaignPanelDbContext : DbContext
    {
        public CampaignPanelDbContext(DbContextOptions<CampaignPanelDbContext> options) : base(options) { }

        // FraudGuard mevcut tabloları (ReadOnly)
        public DbSet<EUser> Users { get; set; } = null!;

        // CampaignPanel yeni tabloları
        public DbSet<Campaign> Campaigns { get; set; } = null!;
        public DbSet<CampaignRule> CampaignRules { get; set; } = null!;
        public DbSet<CampaignTargeting> CampaignTargetings { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Users — mevcut FraudGuard tablosu (dokunulmaz)
            modelBuilder.Entity<EUser>(e =>
            {
                e.ToTable("Users");
                e.HasKey(u => u.UserId);
                e.Property(u => u.Username).HasMaxLength(50);
                e.Property(u => u.Mail).HasMaxLength(100);
                e.Property(u => u.PasswordUnderSHA256).HasMaxLength(100);
            });

            // Campaigns
            modelBuilder.Entity<Campaign>(e =>
            {
                e.ToTable("Campaigns");
                e.HasKey(c => c.CampaignId);
                e.Property(c => c.Title).HasMaxLength(200).IsRequired();
                e.Property(c => c.Description).HasMaxLength(1000);
                e.Property(c => c.BenefitDescription).HasMaxLength(500);
                e.Property(c => c.Status).HasConversion<int>();
                e.HasOne(c => c.Rule).WithOne(r => r.Campaign)
                    .HasForeignKey<CampaignRule>(r => r.CampaignId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(c => c.Targeting).WithOne(t => t.Campaign)
                    .HasForeignKey<CampaignTargeting>(t => t.CampaignId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // CampaignRules
            modelBuilder.Entity<CampaignRule>(e =>
            {
                e.ToTable("CampaignRules");
                e.HasKey(r => r.RuleId);
                e.Property(r => r.DiscountPercent).HasColumnType("decimal(5,2)");
                e.Property(r => r.MinSpendAmount).HasColumnType("decimal(18,2)");
                e.Property(r => r.MaxDiscountAmount).HasColumnType("decimal(18,2)");
                e.Property(r => r.Category).HasConversion<int>();
                e.Property(r => r.MinTransactionCount).HasDefaultValue(0);
                e.Property(r => r.LookbackMonths).HasDefaultValue(1);
                e.Property(r => r.CardTypeCondition).HasMaxLength(50).HasDefaultValue("All");
                e.Property(r => r.BenefitType).HasMaxLength(50).HasDefaultValue("Discount");
            });

            // CampaignTargeting
            modelBuilder.Entity<CampaignTargeting>(e =>
            {
                e.ToTable("CampaignTargeting");
                e.HasKey(t => t.TargetId);
                e.Property(t => t.TargetingType).HasConversion<int>();
                e.Property(t => t.CardBINs).HasMaxLength(500);
                e.Property(t => t.CustomerIds).HasMaxLength(500);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
