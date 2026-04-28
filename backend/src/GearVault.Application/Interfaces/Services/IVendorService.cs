using GearVault.Application.DTOs.Vendors;
using GearVault.Application.Common.Service;

namespace GearVault.Application.Interfaces.Services;

public interface IVendorService : ITransientService
{
    List<VendorDto> GetAllVendors();

    VendorDto GetVendorById(Guid vendorId);

    VendorDto CreateVendor(CreateVendorDto dto);

    VendorDto UpdateVendor(Guid vendorId, UpdateVendorDto dto);

    void DeleteVendor(Guid vendorId);
}
