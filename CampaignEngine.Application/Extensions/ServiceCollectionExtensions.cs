using Microsoft.Extensions.DependencyInjection;
using CampaignEngine.Application.Interfaces;
using CampaignEngine.Application.Services;
using CampaignEngine.Domain.Interfaces.Rules;
using CampaignEngine.Domain.Services;
using CampaignEngine.Domain.Services.Rules;

namespace CampaignEngine.Application.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // 1. Tüm İş Kurallarının DI kaydı
            services.AddScoped<ICampaignRule, MarketCampaignRule>();
            services.AddScoped<ICampaignRule, FuelCampaignRule>();
            services.AddScoped<ICampaignRule, ECommerceCampaignRule>();
            services.AddScoped<ICampaignRule, RestaurantCampaignRule>();
            services.AddScoped<ICampaignRule, InternationalCampaignRule>();
            services.AddScoped<ICampaignRule, InstallmentCampaignRule>();

            // 2. Recommendation Engine, Auth ve AppService Kaydı
            services.AddScoped<CampaignRecommendationEngine>();
            services.AddScoped<ICampaignAppService, CampaignAppService>();
            services.AddScoped<IAuthAppService, AuthAppService>();

            return services;
        }
    }
}
