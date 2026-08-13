namespace CampaignEngine.Domain.Interfaces.Abstractions
{
    public interface ICryptService
    {
        string HashPassword(string password);
        bool VerifyPassword(string password, string hashedPassword);
    }
}
