using GearVault.Domain.Entities;
using GearVault.Application.DTOs.Vendors;
using GearVault.Application.Exceptions;
using GearVault.Application.Interfaces.Services;
using GearVault.Application.Interfaces.Repositories;

namespace GearVault.Infrastructure.Implementation.Services;

public class VendorService(IGenericRepository genericRepository) : IVendorService
{
    #region Vendor CRUD
    /// <summary>
    /// Retrieves all vendors for the admin vendor management list.
    /// </summary>
    public List<VendorDto> GetAllVendors()
    {
        var vendors = genericRepository.Get<Vendor>(asNoTracking: true).ToList();

        return vendors.ConvertAll(x => x.ToVendorDto());
    }

    /// <summary>
    /// Retrieves a single vendor profile by identifier for the vendor details page.
    /// </summary>
    public VendorDto GetVendorById(Guid vendorId)
    {
        var vendor = genericRepository.GetById<Vendor>(vendorId, asNoTracking: true)
                     ?? throw new NotFoundException("Vendor not found.");

        return vendor.ToVendorDto();
    }

    /// <summary>
    /// Creates a new vendor after validating that the vendor name is unique.
    /// </summary>
    public VendorDto CreateVendor(CreateVendorDto dto)
    {
        if (genericRepository.Exists<Vendor>(v => v.Name == dto.Name))
            throw new BadRequestException("A vendor with this name already exists.");

        var vendor = new Vendor(
            dto.Name,
            dto.ContactEmail,
            dto.Phone,
            dto.Address
        );

        vendor.IsActive = dto.IsActive;

        genericRepository.Insert(vendor);

        return vendor.ToVendorDto();
    }

    /// <summary>
    /// Updates vendor contact details and active status while preventing duplicate vendor names.
    /// </summary>
    public VendorDto UpdateVendor(Guid vendorId, UpdateVendorDto dto)
    {
        var vendor = genericRepository.GetById<Vendor>(vendorId)
                     ?? throw new NotFoundException("Vendor not found.");

        if (dto.Name != null && dto.Name != vendor.Name)
        {
            if (genericRepository.Exists<Vendor>(v => v.Name == dto.Name && v.Id != vendorId))
                throw new BadRequestException("A vendor with this name already exists.");
        }

        vendor.Update(
            dto.Name ?? vendor.Name,
            dto.ContactEmail ?? vendor.ContactEmail,
            dto.Phone ?? vendor.Phone,
            dto.Address ?? vendor.Address,
            dto.IsActive ?? vendor.IsActive
        );

        genericRepository.Update(vendor);

        return vendor.ToVendorDto();
    }

    /// <summary>
    /// Deletes a vendor record from the system when it is no longer required.
    /// </summary>
    public void DeleteVendor(Guid vendorId)
    {
        var vendor = genericRepository.GetById<Vendor>(vendorId)
                     ?? throw new NotFoundException("Vendor not found.");

        genericRepository.Delete(vendor);
    }
    #endregion
}
