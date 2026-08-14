using CampaignPanel.Application.Interfaces;
using CampaignPanel.Application.Services;
using CampaignPanel.Domain.Interfaces;
using CampaignPanel.Infrastructure.Persistence;
using CampaignPanel.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CampaignPanel.Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCampaignPanelInfrastructure(
            this IServiceCollection services, IConfiguration configuration)
        {
            // DbContext → FraudGuard SQL Server
            services.AddDbContext<CampaignPanelDbContext>(options =>
                options.UseSqlServer(
                    configuration.GetConnectionString("FraudGuardConnection"),
                    sql => sql.MigrationsAssembly("CampaignPanel.Infrastructure")
                ));

            // Repositories
            services.AddScoped<ICampaignRepository, CampaignRepository>();
            services.AddScoped<IUserRepository, UserRepository>();

            // Application Services
            services.AddScoped<ICampaignAdminService, CampaignAdminService>();
            services.AddScoped<IAuthAdminService, AuthAdminService>();

            return services;
        }
    }
}
