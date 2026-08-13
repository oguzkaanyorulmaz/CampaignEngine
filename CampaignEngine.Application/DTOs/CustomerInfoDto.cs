namespace CampaignEngine.Application.DTOs
{
    public class CustomerInfoDto
    {
        public int CustomerId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
    }
}
