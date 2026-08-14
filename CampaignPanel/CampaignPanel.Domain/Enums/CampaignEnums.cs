namespace CampaignPanel.Domain.Enums
{
    public enum CampaignStatus
    {
        Draft = 0,
        Active = 1,
        Inactive = 2,
        Expired = 3
    }

    public enum TargetingType
    {
        All = 0,
        SpecificCards = 1,
        CustomerSegment = 2
    }

    public enum SpendCategory
    {
        All = 0,
        Fuel = 1,
        ECommerce = 2,
        Restaurant = 3,
        Market = 4,
        Travel = 5,
        Entertainment = 6
    }
}
