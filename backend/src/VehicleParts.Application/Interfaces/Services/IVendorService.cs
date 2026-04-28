using VehicleParts.Application.DTOs.Vendors;
using VehicleParts.Application.Common.Service;

namespace VehicleParts.Application.Interfaces.Services;

public interface IVendorService : ITransientService
{
    List<VendorDto> GetAllVendors();

    VendorDto GetVendorById(Guid vendorId);

    VendorDto CreateVendor(CreateVendorDto dto);

    VendorDto UpdateVendor(Guid vendorId, UpdateVendorDto dto);

    void DeleteVendor(Guid vendorId);
}
