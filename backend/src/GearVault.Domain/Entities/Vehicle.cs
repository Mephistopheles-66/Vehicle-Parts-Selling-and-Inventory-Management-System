using GearVault.Domain.Common.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class Vehicle(
    Guid customerId,
    string vehicleNumber,
    string make,
    string model,
    int year,
    string? chassisNumber,
    string? engineNumber
) : AuditableEntity<Guid>
{
    [ForeignKey(nameof(Customer))]
    public Guid CustomerId { get; private set; } = customerId;

    public string VehicleNumber { get; private set; } = vehicleNumber;

    public string Make { get; private set; } = make;

    public string Model { get; private set; } = model;

    public int Year { get; private set; } = year;

    public string? ChassisNumber { get; private set; } = chassisNumber;

    public string? EngineNumber { get; private set; } = engineNumber;

    public virtual Customer? Customer { get; set; }

    public virtual ICollection<SalesInvoice>? SalesInvoices { get; set; }

    public void Update(string vehicleNumber, string make, string model, int year, string? chassisNumber, string? engineNumber)
    {
        if (VehicleNumber != vehicleNumber) VehicleNumber = vehicleNumber;
        if (Make != make) Make = make;
        if (Model != model) Model = model;
        if (Year != year) Year = year;
        if (ChassisNumber != chassisNumber) ChassisNumber = chassisNumber;
        if (EngineNumber != engineNumber) EngineNumber = engineNumber;
    }
}
