using CampaignPanel.Infrastructure.Extensions;
using CampaignPanel.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "CampaignPanel API", Version = "v1" });
});

// CORS — Frontend (Port 1000)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// CampaignPanel Infrastructure (DbContext, Repos, Services)
builder.Services.AddCampaignPanelInfrastructure(builder.Configuration);

var app = builder.Build();

// Ensure database tables are created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CampaignPanelDbContext>();
    
    // Sadece yeni tabloları oluştur, mevcut FraudGuard tablolarına dokunma
    db.Database.ExecuteSqlRaw(@"
        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Campaigns')
        BEGIN
            CREATE TABLE Campaigns (
                CampaignId INT IDENTITY(1,1) PRIMARY KEY,
                Title NVARCHAR(200) NOT NULL,
                [Description] NVARCHAR(1000) NULL,
                BenefitDescription NVARCHAR(500) NULL,
                StartDate DATETIME2 NOT NULL,
                EndDate DATETIME2 NOT NULL,
                Status INT NOT NULL DEFAULT 0,
                CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
                UpdatedAt DATETIME2 NULL
            );
        END

        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'CampaignRules')
        BEGIN
            CREATE TABLE CampaignRules (
                RuleId INT IDENTITY(1,1) PRIMARY KEY,
                CampaignId INT NOT NULL,
                DiscountPercent DECIMAL(5,2) NOT NULL DEFAULT 0,
                MinSpendAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
                MaxDiscountAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
                Category INT NOT NULL DEFAULT 0,
                CONSTRAINT FK_CampaignRules_Campaigns FOREIGN KEY (CampaignId) REFERENCES Campaigns(CampaignId) ON DELETE CASCADE
            );
        END

        IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'CampaignTargeting')
        BEGIN
            CREATE TABLE CampaignTargeting (
                TargetId INT IDENTITY(1,1) PRIMARY KEY,
                CampaignId INT NOT NULL,
                TargetingType INT NOT NULL DEFAULT 0,
                CardBINs NVARCHAR(500) NULL,
                CustomerIds NVARCHAR(500) NULL,
                CONSTRAINT FK_CampaignTargeting_Campaigns FOREIGN KEY (CampaignId) REFERENCES Campaigns(CampaignId) ON DELETE CASCADE
            );
        END
    ");
    
    Console.WriteLine("✅ CampaignPanel DB tabloları kontrol edildi / oluşturuldu.");
}

// Middleware
app.UseCors();

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
