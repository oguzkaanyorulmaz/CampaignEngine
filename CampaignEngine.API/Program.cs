using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using CampaignEngine.Application.Extensions;
using CampaignEngine.Infrastructure.Extensions;
using CampaignEngine.Infrastructure.Persistence.Contexts;

var builder = WebApplication.CreateBuilder(args);

// 1. Controller ve Swagger Servisleri
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "CampaignEngine API",
        Version = "v1",
        Description = "Müşteri harcama davranışlarına dayalı kampanya öneri sistemi API'si"
    });
});

// 2. CORS (Frontend ve yerel istekler için izin ver)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 3. Application ve Infrastructure Katman Servislerinin Kaydı
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

var app = builder.Build();

// 4. Otomatik DB Oluşturma & Tüm Kullanıcı Şifrelerini '123456' Hash'i Olarak Güncelleme
using (var scope = app.Services.CreateScope())
{
    var campaignDb = scope.ServiceProvider.GetRequiredService<CampaignEngineDbContext>();
    campaignDb.Database.EnsureCreated();

    try
    {
        var fgDb = scope.ServiceProvider.GetRequiredService<FraudGuardReadOnlyDbContext>();
        var cryptService = scope.ServiceProvider.GetRequiredService<CampaignEngine.Domain.Interfaces.Abstractions.ICryptService>();

        // 1. PasswordHash sütununu kontrol et ve ekle
        fgDb.Database.ExecuteSqlRaw("IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Customers') AND name = 'PasswordHash') ALTER TABLE Customers ADD PasswordHash NVARCHAR(MAX) NULL;");

        // 2. Her kullanıcı için PBKDF2 ile hash'lenmiş '123456' şifresini ayarla
        string defaultHash = cryptService.HashPassword("123456");
        fgDb.Database.ExecuteSqlRaw("UPDATE Customers SET PasswordHash = {0};", defaultHash);

        // 3. FraudGuard DB'deki luhn uyumsuz kart numaralarını (5400123456784582 ve 5520987654328819) doğrudan veritabanında güncelle
        fgDb.Database.ExecuteSqlRaw("UPDATE CreditCards SET CardNumber = '4000000000000002' WHERE CardNumber LIKE '%5400123456784582%' OR CardId = 1002;");
        fgDb.Database.ExecuteSqlRaw("UPDATE CreditCards SET CardNumber = '5500000000000004' WHERE CardNumber LIKE '%5520987654328819%' OR CardId = 1003;");
        fgDb.Database.ExecuteSqlRaw("UPDATE CreditCards SET CardNumber = '4111111111111111' WHERE CardNumber LIKE '5400%' OR CardNumber LIKE '5520%';");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"PasswordHash migration note: {ex.Message}");
    }
}

// 5. Swagger'ı her ortamda (Production & Development) aktif et
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "CampaignEngine API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
