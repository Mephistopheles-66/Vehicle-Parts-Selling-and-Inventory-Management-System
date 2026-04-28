using VehicleParts.Domain.Common.Base;

namespace VehicleParts.Domain.Entities;

public class Vendor(
    string name,
    string? contactEmail,
    string? phone,
    string? address
) : BaseEntity<Guid>
{
    public string Name { get; private set; } = name;

    public string? ContactEmail { get; private set; } = contactEmail;

    public string? Phone { get; private set; } = phone;

    public string? Address { get; private set; } = address;

    public DateTime UpdatedAt { get; private set; } = DateTime.Now;

    public virtual ICollection<PurchaseInvoice> PurchaseInvoices { get; set; } = new List<PurchaseInvoice>();

    public void Update(string name, string? contactEmail, string? phone, string? address, bool isActive)
    {
        Name = name;
        ContactEmail = contactEmail;
        Phone = phone;
        Address = address;
        IsActive = isActive;
        UpdatedAt = DateTime.Now;
    }
}
