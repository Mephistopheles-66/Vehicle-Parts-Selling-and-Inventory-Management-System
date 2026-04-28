using GearVault.Domain.Common.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class Customer(
    string fullName,
    string phoneNumber,
    string? emailAddress,
    string? address,
    Guid? userId
) : AuditableEntity<Guid>
{
    public string FullName { get; private set; } = fullName;

    public string PhoneNumber { get; private set; } = phoneNumber;

    public string? EmailAddress { get; private set; } = emailAddress;

    public string? Address { get; private set; } = address;

    [ForeignKey(nameof(User))]
    public Guid? UserId { get; private set; } = userId;

    public virtual User? User { get; set; }

    public virtual ICollection<Vehicle>? Vehicles { get; set; }

    public virtual ICollection<SalesInvoice>? SalesInvoices { get; set; }

    public void Update(string fullName, string phoneNumber, string? emailAddress, string? address)
    {
        if (FullName != fullName) FullName = fullName;
        if (PhoneNumber != phoneNumber) PhoneNumber = phoneNumber;
        if (EmailAddress != emailAddress) EmailAddress = emailAddress;
        if (Address != address) Address = address;
    }

    public void LinkToUser(Guid userId)
    {
        UserId = userId;
    }
}
