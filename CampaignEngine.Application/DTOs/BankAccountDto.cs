using System.Collections.Generic;

namespace CampaignEngine.Application.DTOs
{
    public class BankAccountDto
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; } = "Vadesiz TL Hesabı";
        public string CardNumber { get; set; } = "4543 **** **** 9102";
        public string ExpiryDate { get; set; } = "09/2029";
        public string CVV { get; set; } = "582";
        public string IBAN { get; set; } = string.Empty;
        public decimal Balance { get; set; }
        public List<TransactionDto> RecentTransactions { get; set; } = new();
    }
}
