using System.Collections.Generic;

namespace CampaignEngine.Application.DTOs
{
    public class BankAccountDto
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; } = "Vadesiz TL Hesabı";
        public string IBAN { get; set; } = string.Empty;
        public decimal Balance { get; set; }
        public List<TransactionDto> RecentTransactions { get; set; } = new();
    }
}
