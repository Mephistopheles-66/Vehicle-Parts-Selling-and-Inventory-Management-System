using VehicleParts.Domain.Entities;

namespace VehicleParts.Application.DTOs.Vendors;

public static class VendorExtensionMethod
{
    public static VendorDto ToVendorDto(this Vendor vendor)
    {
        return new VendorDto
        {
            Id = vendor.Id,
            Name = vendor.Name,
            ContactEmail = vendor.ContactEmail,
            Phone = vendor.Phone,
            Address = vendor.Address,
            IsActive = vendor.IsActive,
            CreatedAt = vendor.CreatedAt,
            UpdatedAt = vendor.UpdatedAt
        };
    }
}
