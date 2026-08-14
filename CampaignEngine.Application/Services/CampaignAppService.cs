using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CampaignEngine.Application.DTOs;
using CampaignEngine.Application.Interfaces;
using CampaignEngine.Domain.Common.Enums;
using CampaignEngine.Domain.Entities;
using CampaignEngine.Domain.Interfaces.Repositories;
using CampaignEngine.Domain.Services;

namespace CampaignEngine.Application.Services
{
    public class CampaignAppService : ICampaignAppService
    {
        private readonly ICustomerSpendReader _spendReader;
        private readonly ICampaignRepository _campaignRepository;
        private readonly CampaignRecommendationEngine _recommendationEngine;

        public CampaignAppService(
            ICustomerSpendReader spendReader,
            ICampaignRepository campaignRepository,
            CampaignRecommendationEngine recommendationEngine)
        {
            _spendReader = spendReader;
            _campaignRepository = campaignRepository;
            _recommendationEngine = recommendationEngine;
        }

        public async Task<CustomerDashboardDto?> GetCustomerDashboardAsync(int customerId)
        {
            var customerInfo = await _spendReader.GetCustomerInfoAsync(customerId);
            string customerName = customerInfo?.FullName ?? $"Müşteri {customerId}";

            var customerCards = await _spendReader.GetCustomerCardsAsync(customerId);
            var customerAccounts = await _spendReader.GetCustomerBankAccountsAsync(customerId);

            decimal totalAccountBalance = customerAccounts.Any() ? customerAccounts.Sum(a => a.Balance) : 0;
            decimal totalCreditCardLimit = customerCards.Any() ? customerCards.Sum(c => c.AvailableLimit) : 0;

            var metrics = await _spendReader.GetCustomerSpendMetricsAsync(customerId);

            // Gerçek FraudGuard veritabanındaki aktif kampanyaları sorgula
            var activeCampaigns = await _campaignRepository.GetActiveCampaignsAsync();
            var participations = await _campaignRepository.GetCustomerParticipationsAsync(customerId);

            RecommendationDto? recommendationDto = null;

            if (activeCampaigns.Any() && metrics != null)
            {
                var eligibleCampaigns = new List<(Campaign Campaign, int Priority, string Reason)>();

                metrics.CategorySpends.TryGetValue(CategoryEnum.GasStation, out decimal fuelSpend);
                metrics.CategorySpends.TryGetValue(CategoryEnum.Market, out decimal marketSpend);
                metrics.CategorySpends.TryGetValue(CategoryEnum.Restaurant, out decimal restaurantSpend);
                metrics.CategorySpends.TryGetValue(CategoryEnum.ECommerce, out decimal ecomSpend);

                var allTxns = customerCards.SelectMany(c => c.RecentTransactions).ToList();
                int onlineTxnCount = allTxns.Count(t => t.IsOnline || t.MerchantCategory.ToLower().Contains("online") || t.MerchantCategory.ToLower().Contains("e-ticaret") || t.MerchantCategory.ToLower().Contains("elektronik"));
                int fuelTxnCount = allTxns.Count(t => t.MerchantCategory.ToLower().Contains("akaryakıt") || t.MerchantCategory.ToLower().Contains("benzin") || t.MerchantCategory.ToLower().Contains("yakıt") || t.MerchantCategory.ToLower().Contains("petrol"));
                int restaurantTxnCount = allTxns.Count(t => t.MerchantCategory.ToLower().Contains("restoran") || t.MerchantCategory.ToLower().Contains("yemek") || t.MerchantCategory.ToLower().Contains("cafe"));
                int marketTxnCount = allTxns.Count(t => t.MerchantCategory.ToLower().Contains("market") || t.MerchantCategory.ToLower().Contains("gıda") || t.MerchantCategory.ToLower().Contains("süpermarket"));

                foreach (var c in activeCampaigns)
                {
                    // 1. Kart Tipi Kuralı ("Credit", "Debit", "All")
                    if (c.CardTypeCondition == "Credit" && !customerCards.Any(card => !card.IsBlocked))
                        continue;
                    if (c.CardTypeCondition == "Debit" && !customerAccounts.Any())
                        continue;

                    // 2. Hedef Kitle (Targeting) Doğrulaması
                    bool isTargetMatch = false;
                    if (c.TargetingType == 0) // Tüm Kullanıcılar
                    {
                        isTargetMatch = true;
                    }
                    else if (c.TargetingType == 1) // Spesifik Kartlar / BIN
                    {
                        if (!string.IsNullOrWhiteSpace(c.CardBINs))
                        {
                            var bins = c.CardBINs.Split(new[] { ',', ';', ' ' }, StringSplitOptions.RemoveEmptyEntries);
                            isTargetMatch = customerCards.Any(card =>
                                bins.Any(bin => card.CardNumber.Replace(" ", "").StartsWith(bin.Trim().Replace(" ", ""))));
                        }
                    }
                    else if (c.TargetingType == 2) // Müşteri Segmenti / ID Listesi
                    {
                        if (!string.IsNullOrWhiteSpace(c.CustomerIds))
                        {
                            var ids = c.CustomerIds.Split(new[] { ',', ';', ' ' }, StringSplitOptions.RemoveEmptyEntries);
                            isTargetMatch = ids.Any(id => id.Trim() == customerId.ToString());
                        }
                    }

                    if (!isTargetMatch) continue;

                    // 3. Harcama Kuralı & İşlem Adedi Şartı Doğrulaması
                    bool isRuleMatch = false;
                    string reason = "";
                    int priority = (int)c.DiscountPercent;

                    switch (c.Category)
                    {
                        case 1: // Fuel / Akaryakıt
                            if (c.MinTransactionCount == 0 || fuelTxnCount >= c.MinTransactionCount)
                            {
                                isRuleMatch = true;
                                reason = fuelTxnCount > 0
                                    ? (c.MinTransactionCount > 0
                                        ? $"Son {c.LookbackMonths} ayda {fuelTxnCount} adet Akaryakıt alışverişinize istinaden özel kampanya tanımlandı"
                                        : $"Harcamalarınızın {fuelSpend:N2} TL'si Akaryakıt işlemlerinden oluşuyor")
                                    : $"Akaryakıt harcamalarınıza özel %{c.DiscountPercent:N0} indirim fırsatı";
                                priority += 20;
                            }
                            break;

                        case 2: // ECommerce / Online
                            if (c.MinTransactionCount == 0 || onlineTxnCount >= c.MinTransactionCount)
                            {
                                isRuleMatch = true;
                                reason = onlineTxnCount > 0
                                    ? (c.MinTransactionCount > 0
                                        ? $"Son {c.LookbackMonths} ayda kredi kartınızla {onlineTxnCount} adet E-Ticaret alışverişi şartını sağladığınız için %{c.DiscountPercent:N0} indirim tanımlandı"
                                        : $"Harcamalarınızın %{(metrics.OnlineSpendRatio * 100):N0}'i Online/E-Ticaret işlemlerinden oluşuyor")
                                    : $"E-Ticaret alışverişlerinize özel %{c.DiscountPercent:N0} indirim fırsatı";
                                priority += 25;
                            }
                            break;

                        case 3: // Restaurant / Yeme-İçme
                            if (c.MinTransactionCount == 0 || restaurantTxnCount >= c.MinTransactionCount)
                            {
                                isRuleMatch = true;
                                reason = restaurantTxnCount > 0
                                    ? $"Son {c.LookbackMonths} ayda {restaurantTxnCount} adet Restoran harcamanıza istinaden kampanya fırsatı"
                                    : $"Restoran ve yeme-içme harcamalarınıza özel %{c.DiscountPercent:N0} avantaj";
                                priority += 15;
                            }
                            break;

                        case 4: // Market / Süpermarket
                            if (c.MinTransactionCount == 0 || marketTxnCount >= c.MinTransactionCount)
                            {
                                isRuleMatch = true;
                                reason = marketTxnCount > 0
                                    ? $"Son {c.LookbackMonths} ayda {marketTxnCount} adet Süpermarket harcamanıza istinaden %{c.DiscountPercent:N0} indirim tanımlandı"
                                    : $"Market harcamalarınıza özel %{c.DiscountPercent:N0} indirim fırsatı";
                                priority += 15;
                            }
                            break;

                        case 5: // Travel / Seyahat
                            isRuleMatch = true;
                            reason = $"Seyahat ve Ulaşım harcamalarınıza özel %{c.DiscountPercent:N0} indirim ({c.MinimumSpendAmount:N0} TL ve üzeri)";
                            break;

                        case 6: // Entertainment / Eğlence
                            isRuleMatch = true;
                            reason = $"Kültür, Sanat ve Eğlence harcamalarınıza özel %{c.DiscountPercent:N0} indirim";
                            break;

                        default: // 0: Tüm İşlemler
                            if (c.MinTransactionCount == 0 || allTxns.Count >= c.MinTransactionCount)
                            {
                                isRuleMatch = true;
                                reason = c.MinimumSpendAmount > 0
                                    ? $"{c.MinimumSpendAmount:N0} TL ve üzeri harcamalarınıza özel %{c.DiscountPercent:N0} indirim (Maks. {c.MaxDiscountAmount:N0} TL)"
                                    : $"Tüm harcamalarınıza özel %{c.DiscountPercent:N0} indirim fırsatı";
                            }
                            break;
                    }

                    if (isRuleMatch)
                    {
                        eligibleCampaigns.Add((c, priority, reason));
                    }
                }

                var activeList = new List<RecommendationDto>();
                var redeemedList = new List<RecommendationDto>();

                foreach (var item in eligibleCampaigns.OrderByDescending(x => x.Priority))
                {
                    var c = item.Campaign;
                    var userPart = participations.FirstOrDefault(p => p.CampaignId == c.CampaignId);
                    bool isJoined = userPart != null;
                    bool isRedeemed = userPart?.IsRedeemed ?? false;
                    decimal totalSaved = userPart?.TotalSavedAmount ?? 0;

                    // Eğer müşteri katılmış ama henüz kullanılmadıysa, katılım sonrası geçerli ve kategoriyle uyuşan bir işlem var mı kontrol et
                    if (isJoined && !isRedeemed)
                    {
                        var redeemingTx = allTxns.FirstOrDefault(t =>
                            !t.IsRefund &&
                            !t.IsDeclined &&
                            !t.IsSuspicious &&
                            t.TransactionDate >= userPart!.JoinedDate.AddSeconds(-30) &&
                            (c.MinimumSpendAmount <= 0 || t.Amount >= c.MinimumSpendAmount) &&
                            IsCategoryMatch(c.Category, t));

                        if (redeemingTx != null)
                        {
                            if (c.BenefitType == "Cashback")
                            {
                                totalSaved = c.MaxDiscountAmount > 0
                                    ? Math.Min(c.MaxDiscountAmount, redeemingTx.Amount)
                                    : (c.DiscountPercent > 0 ? redeemingTx.Amount * (c.DiscountPercent / 100m) : 250m);
                            }
                            else
                            {
                                decimal calculated = redeemingTx.Amount * (c.DiscountPercent / 100m);
                                totalSaved = c.MaxDiscountAmount > 0
                                    ? Math.Min(calculated, c.MaxDiscountAmount)
                                    : calculated;
                            }

                            if (totalSaved == 0 && c.MaxDiscountAmount > 0)
                                totalSaved = c.MaxDiscountAmount;

                            await _campaignRepository.RedeemCampaignAsync(customerId, c.CampaignId, totalSaved, redeemingTx.CreditCardId, redeemingTx.Location, redeemingTx.Country);
                            isRedeemed = true;
                        }
                    }

                    var dto = new RecommendationDto
                    {
                        CampaignId = c.CampaignId,
                        Title = c.Title,
                        Description = c.Description,
                        BenefitDescription = c.BenefitDescription,
                        Reason = isRedeemed
                            ? $"🎉 Kampanyadan başarıyla {totalSaved:N2} ₺ indirim/kazanç sağladınız!"
                            : item.Reason,
                        PriorityScore = item.Priority,
                        IsJoined = isJoined,
                        IsRedeemed = isRedeemed,
                        TotalSavedAmount = totalSaved
                    };

                    if (isRedeemed)
                    {
                        redeemedList.Add(dto);
                    }
                    else
                    {
                        activeList.Add(dto);
                    }
                }

                recommendationDto = activeList.FirstOrDefault() ?? redeemedList.FirstOrDefault();

                return new CustomerDashboardDto
                {
                    CustomerId = customerId,
                    CustomerName = customerName,
                    TotalAccountBalance = totalAccountBalance,
                    TotalCreditCardAvailableLimit = totalCreditCardLimit,
                    BankAccounts = customerAccounts,
                    CreditCards = customerCards,
                    RecommendedCampaign = recommendationDto,
                    ActiveCampaigns = activeList,
                    RedeemedCampaigns = redeemedList
                };
            }

            return new CustomerDashboardDto
            {
                CustomerId = customerId,
                CustomerName = customerName,
                TotalAccountBalance = totalAccountBalance,
                TotalCreditCardAvailableLimit = totalCreditCardLimit,
                BankAccounts = customerAccounts,
                CreditCards = customerCards,
                RecommendedCampaign = recommendationDto,
                ActiveCampaigns = new(),
                RedeemedCampaigns = new()
            };
        }

        public async Task<bool> JoinCampaignAsync(int customerId, int campaignId)
        {
            return await _campaignRepository.JoinCampaignAsync(customerId, campaignId);
        }

        public async Task<List<CustomerRecommendationResultDto>> GetAllCustomerRecommendationsAsync()
        {
            var customers = await _spendReader.GetAllCustomersAsync();
            var results = new List<CustomerRecommendationResultDto>();

            foreach (var cust in customers)
            {
                var dashboard = await GetCustomerDashboardAsync(cust.CustomerId);
                if (dashboard?.RecommendedCampaign != null)
                {
                    results.Add(new CustomerRecommendationResultDto
                    {
                        CustomerId = cust.CustomerId,
                        CustomerName = cust.FullName,
                        SpendAnalysisSummary = dashboard.RecommendedCampaign.Reason,
                        RecommendedCampaignTitle = dashboard.RecommendedCampaign.Title,
                        RuleCode = $"CAMP_{dashboard.RecommendedCampaign.CampaignId}"
                    });
                }
            }

            return results;
        }

        public async Task<List<CustomerInfoDto>> GetAllCustomersAsync()
        {
            return await _spendReader.GetAllCustomersAsync();
        }

        private static bool IsCategoryMatch(int category, TransactionDto t)
        {
            if (category == 0) return true; // Tüm sektörler
            string cat = (t.MerchantCategory ?? "").ToLowerInvariant();
            return category switch
            {
                1 => cat.Contains("akaryakıt") || cat.Contains("akaryakit") || cat.Contains("petrol") || cat.Contains("benzin") || cat.Contains("fuel"),
                2 => t.IsOnline || cat.Contains("e-ticaret") || cat.Contains("eticaret") || cat.Contains("online"),
                3 => cat.Contains("restoran") || cat.Contains("restaurant") || cat.Contains("yemek") || cat.Contains("cafe") || cat.Contains("kafe"),
                4 => cat.Contains("market") || cat.Contains("gıda") || cat.Contains("gida") || cat.Contains("supermarket") || cat.Contains("bakkal"),
                5 => cat.Contains("seyahat") || cat.Contains("turizm") || cat.Contains("bilet") || cat.Contains("otel") || cat.Contains("travel"),
                6 => cat.Contains("eğlence") || cat.Contains("eglence") || cat.Contains("sinema") || cat.Contains("tiyatro") || cat.Contains("konser"),
                _ => true
            };
        }
    }
}
