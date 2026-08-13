using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using CampaignEngine.Domain.Interfaces.Abstractions;
using CampaignEngine.Domain.Interfaces.Repositories;
using CampaignEngine.Application.Interfaces;
using CampaignEngine.Infrastructure.Persistence.Contexts;
using CampaignEngine.Infrastructure.Repositories;
using CampaignEngine.Infrastructure.Services;

namespace CampaignEngine.Infrastructure.Extensions
{
    public static class InfrastructureServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            // 1. FraudGuard Read-Only DB Connection (SQL Server veya SQLite Dinamik Desteği)
            string fraudGuardConnStr = configuration.GetConnectionString("FraudGuardConnection") 
                ?? "Server=localhost,1433;Database=FraudGuard;User Id=sa;Password=FraudGuard2026_!;TrustServerCertificate=True;";

            services.AddDbContext<FraudGuardReadOnlyDbContext>(options =>
            {
                if (fraudGuardConnStr.Contains("Server=") || fraudGuardConnStr.Contains("Database="))
                {
                    options.UseSqlServer(fraudGuardConnStr);
                }
                else
                {
                    options.UseSqlite(fraudGuardConnStr);
                }
            });

            // 2. Campaign Engine DB Connection
            string campaignConnStr = configuration.GetConnectionString("CampaignConnection") ?? "Data Source=campaignengine.db";
            services.AddDbContext<CampaignEngineDbContext>(options =>
                options.UseSqlite(campaignConnStr));

            // 3. Service & Repository Registrations
            services.AddScoped<ICryptService, CryptService>();
            services.AddScoped<ICustomerSpendReader, CustomerSpendReader>();
            services.AddScoped<ICampaignRepository, CampaignRepository>();

            return services;
        }
    }
}
