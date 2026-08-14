using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace CampaignEngine.Infrastructure.Persistence.Contexts
{
    public class ECustomer 
    { 
        public int CustomerId { get; set; } 
        public string FirstName { get; set; } = string.Empty; 
        public string LastName { get; set; } = string.Empty;
        public string IdentityNumber { get; set; } = string.Empty;
        public string? PasswordHash { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public class ECreditCard 
    { 
        public int CardId { get; set; } 
        public int CustomerId { get; set; } 
        public string CardNumber { get; set; } = string.Empty; 
        public string ExpiryDate { get; set; } = string.Empty; 
        public string CVV { get; set; } = string.Empty;
        public decimal CardLimit { get; set; } 
        public decimal AvailableLimit { get; set; } 
        public bool IsBlocked { get; set; }
        public virtual ECustomer Customer { get; set; } = null!;
        public virtual List<ECreditCardTransaction> Transactions { get; set; } = new(); 
    }

    public class EDebitCard
    {
        public int CardId { get; set; }
        public int CustomerId { get; set; }
        public string CardNumber { get; set; } = string.Empty;
        public string ExpiryDate { get; set; } = string.Empty;
        public decimal Balance { get; set; }
        public string IBAN { get; set; } = string.Empty;
        public bool IsBlocked { get; set; }
        public virtual ECustomer Customer { get; set; } = null!;
    }

    public class ECreditCardTransaction 
    { 
        public int TransactionId { get; set; } 
        public string RRN { get; set; } = string.Empty; 
        public int CreditCardId { get; set; } 
        public int TransactionTypeId { get; set; } 
        public int ChannelTypeId { get; set; } 
        public decimal Amount { get; set; } 
        public string Currency { get; set; } = "TRY"; 
        public DateTime TransactionDate { get; set; } 
        public string Location { get; set; } = string.Empty; 
        public string Country { get; set; } = "Türkiye"; 
        public string MerchantCategory { get; set; } = string.Empty; 
        public string Status { get; set; } = string.Empty; 
        public string? DeclineReason { get; set; }
        public string? FraudReason { get; set; } 
        public virtual ECreditCard CreditCard { get; set; } = null!; 
    }

    public class ECampaign
    {
        public int CampaignId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? BenefitDescription { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Status { get; set; } // 0: Draft, 1: Active, 2: Inactive, 3: Expired
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public virtual ECampaignRule? Rule { get; set; }
        public virtual ECampaignTargeting? Targeting { get; set; }
    }

    public class ECampaignRule
    {
        public int RuleId { get; set; }
        public int CampaignId { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal MinSpendAmount { get; set; }
        public decimal MaxDiscountAmount { get; set; }
        public int Category { get; set; } // 0: All, 1: Fuel, 2: ECommerce, 3: Restaurant, 4: Market, 5: Travel, 6: Entertainment
        public int MinTransactionCount { get; set; }
        public int LookbackMonths { get; set; }
        public string CardTypeCondition { get; set; } = "All";
        public string BenefitType { get; set; } = "Discount";
        public virtual ECampaign Campaign { get; set; } = null!;
    }

    public class ECampaignTargeting
    {
        public int TargetId { get; set; }
        public int CampaignId { get; set; }
        public int TargetingType { get; set; } // 0: All, 1: SpecificCards, 2: CustomerSegment
        public string? CardBINs { get; set; }
        public string? CustomerIds { get; set; }
        public virtual ECampaign Campaign { get; set; } = null!;
    }

    public class ECampaignParticipation
    {
        public int ParticipationId { get; set; }
        public int CustomerId { get; set; }
        public int CampaignId { get; set; }
        public DateTime JoinedDate { get; set; }
        public bool IsRedeemed { get; set; }
        public decimal TotalSavedAmount { get; set; }
        public virtual ECampaign Campaign { get; set; } = null!;
    }

    public class FraudGuardReadOnlyDbContext : DbContext
    {
        public FraudGuardReadOnlyDbContext(DbContextOptions<FraudGuardReadOnlyDbContext> options) : base(options) { }

        public DbSet<ECustomer> Customers { get; set; } = null!;
        public DbSet<ECreditCard> CreditCards { get; set; } = null!;
        public DbSet<EDebitCard> DebitCards { get; set; } = null!;
        public DbSet<ECreditCardTransaction> CreditCardTransactions { get; set; } = null!;
        public DbSet<ECampaign> Campaigns { get; set; } = null!;
        public DbSet<ECampaignRule> CampaignRules { get; set; } = null!;
        public DbSet<ECampaignTargeting> CampaignTargetings { get; set; } = null!;
        public DbSet<ECampaignParticipation> CampaignParticipations { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ECustomer>().ToTable("Customers").HasKey(c => c.CustomerId);
            modelBuilder.Entity<ECreditCard>().ToTable("CreditCards").HasKey(c => c.CardId);
            modelBuilder.Entity<EDebitCard>().ToTable("DebitCards").HasKey(d => d.CardId);
            modelBuilder.Entity<ECreditCardTransaction>().ToTable("CreditCardTransactions").HasKey(t => t.TransactionId);

            modelBuilder.Entity<ECampaign>(e =>
            {
                e.ToTable("Campaigns").HasKey(c => c.CampaignId);
                e.HasOne(c => c.Rule).WithOne(r => r.Campaign).HasForeignKey<ECampaignRule>(r => r.CampaignId);
                e.HasOne(c => c.Targeting).WithOne(t => t.Campaign).HasForeignKey<ECampaignTargeting>(t => t.CampaignId);
            });

            modelBuilder.Entity<ECampaignRule>().ToTable("CampaignRules").HasKey(r => r.RuleId);
            modelBuilder.Entity<ECampaignTargeting>().ToTable("CampaignTargeting").HasKey(t => t.TargetId);
            modelBuilder.Entity<ECampaignParticipation>().ToTable("CampaignParticipations").HasKey(p => p.ParticipationId);

            base.OnModelCreating(modelBuilder);
        }
    }
}
