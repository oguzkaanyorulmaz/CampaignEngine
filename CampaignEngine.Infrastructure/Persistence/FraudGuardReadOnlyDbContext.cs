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

    public class FraudGuardReadOnlyDbContext : DbContext
    {
        public FraudGuardReadOnlyDbContext(DbContextOptions<FraudGuardReadOnlyDbContext> options) : base(options) { }

        public DbSet<ECustomer> Customers { get; set; } = null!;
        public DbSet<ECreditCard> CreditCards { get; set; } = null!;
        public DbSet<EDebitCard> DebitCards { get; set; } = null!;
        public DbSet<ECreditCardTransaction> CreditCardTransactions { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ECustomer>().ToTable("Customers").HasKey(c => c.CustomerId);
            modelBuilder.Entity<ECreditCard>().ToTable("CreditCards").HasKey(c => c.CardId);
            modelBuilder.Entity<EDebitCard>().ToTable("DebitCards").HasKey(d => d.CardId);
            modelBuilder.Entity<ECreditCardTransaction>().ToTable("CreditCardTransactions").HasKey(t => t.TransactionId);

            base.OnModelCreating(modelBuilder);
        }
    }
}
