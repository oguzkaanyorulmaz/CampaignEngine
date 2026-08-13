using Microsoft.EntityFrameworkCore;
using CampaignEngine.Domain.Entities;
using CampaignEngine.Domain.Common.Enums;
using System;

namespace CampaignEngine.Infrastructure.Persistence.Contexts
{
    public class CampaignEngineDbContext : DbContext
    {
        public CampaignEngineDbContext(DbContextOptions<CampaignEngineDbContext> options) : base(options) { }

        public DbSet<Campaign> Campaigns { get; set; } = null!;
        public DbSet<CustomerCampaignParticipation> Participations { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Campaign>().HasKey(c => c.CampaignId);
            modelBuilder.Entity<CustomerCampaignParticipation>().HasKey(p => p.ParticipationId);

            // Başlangıç Kampanya Verileri (Seed Data)
            modelBuilder.Entity<Campaign>().HasData(
                new Campaign { CampaignId = 1, RuleCode = "MARKET_15K", Title = "Market %10 İndirim Kampanyası", Description = "Market harcamalarınıza özel %10 indirim", BenefitDescription = "%10 İndirim", MinimumSpendAmount = 15000, CampaignType = CampaignTypeEnum.Discount, PriorityWeight = 100 },
                new Campaign { CampaignId = 2, RuleCode = "FUEL_5K", Title = "Yakıt İndirim Kampanyası", Description = "Akaryakıt alımlarında geçerli indirim fırsatı", BenefitDescription = "500 TL İndirim", MinimumSpendAmount = 5000, CampaignType = CampaignTypeEnum.Discount, PriorityWeight = 90 },
                new Campaign { CampaignId = 3, RuleCode = "ONLINE_60", Title = "E-Ticaret Kampanyası", Description = "Sanal POS ve İnternet harcamalarında ekstra puan", BenefitDescription = "2x Puan", MinimumSpendAmount = 0, CampaignType = CampaignTypeEnum.Discount, PriorityWeight = 85 },
                new Campaign { CampaignId = 4, RuleCode = "RESTAURANT_8K", Title = "Restoran & Yeme-İçme Kampanyası", Description = "Seçili restoranlarda %15 nakit iade", BenefitDescription = "%15 CashBack", MinimumSpendAmount = 8000, CampaignType = CampaignTypeEnum.Cashback, PriorityWeight = 88 },
                new Campaign { CampaignId = 5, RuleCode = "INT_MILES", Title = "Mil Kart Yurt Dışı Fırsatı", Description = "Yurt dışı harcamalarınızda 3 kat mil puan imkânı", BenefitDescription = "3x Mil Puan", MinimumSpendAmount = 0, CampaignType = CampaignTypeEnum.Miles, PriorityWeight = 95 },
                new Campaign { CampaignId = 6, RuleCode = "INSTALLMENT_40", Title = "Faizsiz Taksit Kampanyası", Description = "Peşin harcamalarınıza sonradan +3 faizsiz taksit", BenefitDescription = "+3 Taksit", MinimumSpendAmount = 0, CampaignType = CampaignTypeEnum.Installment, PriorityWeight = 82 }
            );

            base.OnModelCreating(modelBuilder);
        }
    }
}
