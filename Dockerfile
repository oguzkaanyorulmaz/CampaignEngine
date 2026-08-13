FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["CampaignEngine.API/CampaignEngine.API.csproj", "CampaignEngine.API/"]
COPY ["CampaignEngine.Application/CampaignEngine.Application.csproj", "CampaignEngine.Application/"]
COPY ["CampaignEngine.Domain/CampaignEngine.Domain.csproj", "CampaignEngine.Domain/"]
COPY ["CampaignEngine.Infrastructure/CampaignEngine.Infrastructure.csproj", "CampaignEngine.Infrastructure/"]

RUN dotnet restore "CampaignEngine.API/CampaignEngine.API.csproj"

# Copy full source code and publish
COPY . .
WORKDIR "/src/CampaignEngine.API"
RUN dotnet publish "CampaignEngine.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app
COPY --from=build /app/publish .

# Directory for SQLite DB persistence
RUN mkdir -p /app/data

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "CampaignEngine.API.dll"]
