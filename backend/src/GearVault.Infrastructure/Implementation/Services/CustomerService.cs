using GearVault.Domain.Entities;
using GearVault.Application.Exceptions;
using GearVault.Application.DTOs.Customers;
using GearVault.Application.DTOs.Vehicles;
using GearVault.Application.Interfaces.Services;
using GearVault.Application.Interfaces.Repositories;

namespace GearVault.Infrastructure.Implementation.Services;

public class CustomerService(IGenericRepository genericRepository) : ICustomerService
{
    #region Read
    public List<CustomerDto> GetAllCustomers(
        int pageNumber,
        int pageSize,
        out int rowCount,
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null)
    {
        var customers = genericRepository.GetPagedResult<Customer>(
            pageNumber,
            pageSize,
            out rowCount,
            x =>
                (string.IsNullOrEmpty(globalSearch)
                    || x.FullName.ToLower().Contains(globalSearch.ToLower())
                    || x.PhoneNumber.ToLower().Contains(globalSearch.ToLower())
                    || (x.EmailAddress != null && x.EmailAddress.ToLower().Contains(globalSearch.ToLower()))) &&
                (isActive == null || isActive.Contains(x.IsActive)),
            orderBys).ToList();

        if (customers.Count == 0) return new List<CustomerDto>();

        var customerIds = customers.Select(c => c.Id).ToHashSet();

        var vehicles = genericRepository.Get<Vehicle>(v => customerIds.Contains(v.CustomerId)).ToList();

        var vehiclesByCustomer = vehicles.GroupBy(v => v.CustomerId).ToDictionary(g => g.Key, g => g.ToList());

        return customers
            .Select(c => c.ToCustomerDto(vehiclesByCustomer.GetValueOrDefault(c.Id) ?? new List<Vehicle>()))
            .ToList();
    }

    public List<CustomerDto> SearchCustomers(string searchTerm, int limit = 20)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
            throw new BadRequestException("Search term cannot be empty.");

        var term = searchTerm.Trim().ToLower();

        Guid? idMatch = Guid.TryParse(term, out var parsedId) ? parsedId : null;

        var directMatches = genericRepository.Get<Customer>(
            x =>
                (idMatch != null && x.Id == idMatch) ||
                x.FullName.ToLower().Contains(term) ||
                x.PhoneNumber.ToLower().Contains(term) ||
                (x.EmailAddress != null && x.EmailAddress.ToLower().Contains(term))
        ).Take(limit).ToList();

        var vehicleMatches = genericRepository.Get<Vehicle>(
            v => v.VehicleNumber.ToLower().Contains(term)
        ).Take(limit).ToList();

        var matchedCustomerIds = vehicleMatches
            .Select(v => v.CustomerId)
            .Except(directMatches.Select(c => c.Id))
            .ToHashSet();

        var indirectMatches = matchedCustomerIds.Count > 0
            ? genericRepository.Get<Customer>(c => matchedCustomerIds.Contains(c.Id)).ToList()
            : new List<Customer>();

        var allCustomers = directMatches.Concat(indirectMatches).Take(limit).ToList();

        if (allCustomers.Count == 0) return new List<CustomerDto>();

        var customerIds = allCustomers.Select(c => c.Id).ToHashSet();

        var vehicles = genericRepository.Get<Vehicle>(v => customerIds.Contains(v.CustomerId)).ToList();

        var vehiclesByCustomer = vehicles.GroupBy(v => v.CustomerId).ToDictionary(g => g.Key, g => g.ToList());

        return allCustomers
            .Select(c => c.ToCustomerDto(vehiclesByCustomer.GetValueOrDefault(c.Id) ?? new List<Vehicle>()))
            .ToList();
    }

    public CustomerDto GetCustomerById(Guid customerId)
    {
        var customer = genericRepository.GetById<Customer>(customerId)
            ?? throw new NotFoundException($"Customer with identifier '{customerId}' was not found.");

        var vehicles = genericRepository.Get<Vehicle>(v => v.CustomerId == customerId).ToList();

        return customer.ToCustomerDto(vehicles);
    }
    #endregion

    #region Write
    public Guid RegisterCustomer(CreateCustomerDto dto)
    {
        ValidateCustomerInput(dto.FullName, dto.PhoneNumber, dto.EmailAddress);

        var duplicate = genericRepository.GetFirstOrDefault<Customer>(
            x => x.PhoneNumber == dto.PhoneNumber);

        if (duplicate != null)
            throw new BadRequestException($"A customer with phone number '{dto.PhoneNumber}' already exists.");

        if (dto.Vehicles.Count > 0)
        {
            var vehicleNumbers = dto.Vehicles
                .Select(v => v.VehicleNumber.Trim())
                .ToList();

            if (vehicleNumbers.Distinct(StringComparer.OrdinalIgnoreCase).Count() != vehicleNumbers.Count)
                throw new BadRequestException("Duplicate vehicle numbers in request.");

            var existingVehicleNumbers = genericRepository.Get<Vehicle>(
                v => vehicleNumbers.Contains(v.VehicleNumber)).ToList();

            if (existingVehicleNumbers.Count > 0)
                throw new BadRequestException(
                    $"Vehicle number(s) already registered: {string.Join(", ", existingVehicleNumbers.Select(v => v.VehicleNumber))}.");
        }

        var customer = new Customer(
            dto.FullName.Trim(),
            dto.PhoneNumber.Trim(),
            string.IsNullOrWhiteSpace(dto.EmailAddress) ? null : dto.EmailAddress.Trim(),
            string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim(),
            userId: null);

        var customerId = genericRepository.Insert(customer);

        if (dto.Vehicles.Count > 0)
        {
            var vehicles = dto.Vehicles.Select(v => new Vehicle(
                customerId,
                v.VehicleNumber.Trim(),
                v.Make.Trim(),
                v.Model.Trim(),
                v.Year,
                string.IsNullOrWhiteSpace(v.ChassisNumber) ? null : v.ChassisNumber.Trim(),
                string.IsNullOrWhiteSpace(v.EngineNumber) ? null : v.EngineNumber.Trim()
            )).ToList();

            genericRepository.AddMultipleEntity(vehicles);
        }

        return customerId;
    }

    public Guid CreateCustomerForUser(Guid userId, string fullName, string phoneNumber, string? emailAddress, string? address)
    {
        ValidateCustomerInput(fullName, phoneNumber, emailAddress);

        var existingForUser = genericRepository.GetFirstOrDefault<Customer>(c => c.UserId == userId);
        if (existingForUser != null)
            throw new BadRequestException("A customer record already exists for this user account.");

        var duplicatePhone = genericRepository.GetFirstOrDefault<Customer>(c => c.PhoneNumber == phoneNumber);
        if (duplicatePhone != null)
            throw new BadRequestException($"A customer with phone number '{phoneNumber}' already exists.");

        var customer = new Customer(
            fullName.Trim(),
            phoneNumber.Trim(),
            string.IsNullOrWhiteSpace(emailAddress) ? null : emailAddress.Trim(),
            string.IsNullOrWhiteSpace(address) ? null : address.Trim(),
            userId);

        return genericRepository.Insert(customer);
    }

    public void UpdateCustomer(Guid customerId, UpdateCustomerDto dto)
    {
        if (customerId != dto.Id)
            throw new BadRequestException("Route identifier does not match payload identifier.");

        var customer = genericRepository.GetById<Customer>(customerId)
            ?? throw new NotFoundException($"Customer with identifier '{customerId}' was not found.");

        ValidateCustomerInput(dto.FullName, dto.PhoneNumber, dto.EmailAddress);

        var duplicate = genericRepository.GetFirstOrDefault<Customer>(
            x => x.PhoneNumber == dto.PhoneNumber && x.Id != customerId);

        if (duplicate != null)
            throw new BadRequestException($"Another customer is already registered with phone number '{dto.PhoneNumber}'.");

        customer.Update(
            dto.FullName.Trim(),
            dto.PhoneNumber.Trim(),
            string.IsNullOrWhiteSpace(dto.EmailAddress) ? null : dto.EmailAddress.Trim(),
            string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim());

        genericRepository.Update(customer);
    }

    public void ActivateDeactivateCustomer(Guid customerId)
    {
        var customer = genericRepository.GetById<Customer>(customerId)
            ?? throw new NotFoundException($"Customer with identifier '{customerId}' was not found.");

        customer.ActivateDeactivateEntity();

        genericRepository.Update(customer);
    }
    #endregion

    #region Helpers
    private static void ValidateCustomerInput(string fullName, string phoneNumber, string? emailAddress)
    {
        if (string.IsNullOrWhiteSpace(fullName))
            throw new BadRequestException("Customer name is required.");

        if (string.IsNullOrWhiteSpace(phoneNumber))
            throw new BadRequestException("Customer phone number is required.");

        if (!string.IsNullOrWhiteSpace(emailAddress) && !emailAddress.Contains('@'))
            throw new BadRequestException("Email address is not in a valid format.");
    }
    #endregion
}
