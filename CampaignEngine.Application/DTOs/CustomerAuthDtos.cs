namespace CampaignEngine.Application.DTOs
{
    public class CustomerLoginRequestDto
    {
        public string IdentityNumber { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class CustomerAuthResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string IdentityNumber { get; set; } = string.Empty;
    }
}
