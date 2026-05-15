using System.Text.Json;
using GearVault.Domain.Common;
using GearVault.Domain.Entities;
using GearVault.Domain.Common.Enum;
using GearVault.Application.Exceptions;
using GearVault.Application.DTOs.Users;
using GearVault.Application.DTOs.Assets;
using GearVault.Application.Common.Helper;
using GearVault.Application.DTOs.Emails;
using GearVault.Application.Interfaces.Services;
using GearVault.Application.Interfaces.Repositories;
using GearVault.Application.DTOs.Vehicles;
using GearVault.Application.DTOs.SalesInvoices;

namespace GearVault.Infrastructure.Implementation.Services;

public class UserService(
    IFileService fileService,
    IGenericRepository genericRepository) : IUserService
{
    private const string UserImagesFilePath = Constants.FilePath.UserImagesFilePath;

    public List<UserDto> GetAllUsers(
        int pageNumber,
        int pageSize,
        out int rowCount,
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null,
        string? name = null,
        string? username = null,
        string? emailAddress = null,
        string? address = null,
        string? phoneNumber = null,
        List<Guid>? roleIds = null)
    {
        var roleIdentifiers = roleIds != null ? new HashSet<Guid>(roleIds) : null;

        var userModels = genericRepository.GetPagedResult<User>(pageNumber, pageSize, out rowCount,
            x => 
                (string.IsNullOrEmpty(globalSearch) 
                    || x.Name.ToLower().Contains(globalSearch.ToLower())
                    || x.Username.ToLower().Contains(globalSearch.ToLower())
                    || x.EmailAddress.ToLower().Contains(globalSearch.ToLower())
                    || (x.Address != null && x.Address.ToLower().Contains(globalSearch.ToLower()))
                    || x.PhoneNumber.ToLower().Contains(globalSearch.ToLower())) && 
                 (isActive == null || isActive.Contains(x.IsActive)) && 
                 (name == null || x.Name.ToLower().Contains(name.ToLower())) &&
                 (username == null || x.Username.ToLower().Contains(username.ToLower())) &&
                 (emailAddress == null || x.EmailAddress.ToLower().Contains(emailAddress.ToLower())) &&
                 (address == null || (x.Address != null && x.Address.ToLower().Contains(address.ToLower()))) &&
                 (phoneNumber == null || x.PhoneNumber.ToLower().Contains(phoneNumber.ToLower())) &&
                 (roleIdentifiers == null || roleIdentifiers.Contains(x.RoleId)),
            orderBys).ToList();
        
        if (userModels.Count == 0) return new List<UserDto>();

        var roles = genericRepository.Get<Role>(x =>
            userModels.Select(z => z.RoleId).Distinct().ToHashSet().Contains(x.Id)).ToList();

        var roleDictionary = roles.ToDictionary(x => x.Id, x => x);

        var users = new List<UserDto>();

        foreach (var userModel in userModels)
        {
            if (!roleDictionary.TryGetValue(userModel.RoleId, out var role))
                throw new NotFoundException($"The following role with the identifier of {userModel.RoleId} could not be found.");

            var user = userModel.ToUserDto(role);

            users.Add(user);
        }

        return users;
    }

    public List<UserDto> GetAllUsers(
        string? globalSearch = null,
        bool[]? isActive = null,
        string[]? orderBys = null,
        string? name = null,
        string? username = null,
        string? emailAddress = null,
        string? address = null,
        string? phoneNumber = null,
        List<Guid>? roleIds = null)
    {
        var roleIdentifiers = roleIds != null ? new HashSet<Guid>(roleIds) : null;

        var userModels = genericRepository.Get<User>(
            x => 
                (string.IsNullOrEmpty(globalSearch) 
                    || x.Name.ToLower().Contains(globalSearch.ToLower())
                    || x.Username.ToLower().Contains(globalSearch.ToLower())
                    || x.EmailAddress.ToLower().Contains(globalSearch.ToLower())
                    || (x.Address != null && x.Address.ToLower().Contains(globalSearch.ToLower()))
                    || x.PhoneNumber.ToLower().Contains(globalSearch.ToLower())) && 
                 (isActive == null || isActive.Contains(x.IsActive)) && 
                 (name == null || x.Name.ToLower().Contains(name.ToLower())) &&
                 (username == null || x.Username.ToLower().Contains(username.ToLower())) &&
                 (emailAddress == null || x.EmailAddress.ToLower().Contains(emailAddress.ToLower())) &&
                 (address == null || (x.Address != null && x.Address.ToLower().Contains(address.ToLower()))) &&
                 (phoneNumber == null || x.PhoneNumber.ToLower().Contains(phoneNumber.ToLower())) &&
                 (roleIdentifiers == null || roleIdentifiers.Contains(x.RoleId)),
            orderBys).ToList();

        if (userModels.Count == 0) return new List<UserDto>();

        var roles = roleIdentifiers != null 
            ? genericRepository.Get<Role>(x => roleIdentifiers.Contains(x.Id)).ToList()
            : genericRepository.Get<Role>().ToList();

        var roleDictionary = roles.ToDictionary(x => x.Id, x => x);

        var users = new List<UserDto>();

        foreach (var userModel in userModels)
        {
            if (!roleDictionary.TryGetValue(userModel.RoleId, out var role))
                throw new NotFoundException($"Role with identifier {userModel.RoleId} not found.");

            var user = userModel.ToUserDto(role);

            users.Add(user);
        }

        return users;
    }

    public UserDto GetUserById(Guid userId)
    {
        var userModel = genericRepository.GetById<User>(userId)
            ?? throw new NotFoundException($"User with identifier '{userId}' was not found.");

        var role = genericRepository.GetById<Role>(userModel.RoleId)
            ?? throw new NotFoundException("The following role could not be found.");

        return userModel.ToUserDto(role);
    }

    public List<CustomerSearchResultDto> SearchCustomers(string searchTerm, int limit = 20)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
            throw new BadRequestException("Search term cannot be empty.");

        if (limit <= 0 || limit > 100) limit = 20;

        var term = searchTerm.Trim().ToLower();
        var customerRoleId = Guid.Parse(Constants.Roles.Customer.Id);

        // Try parsing as a Guid — supports search by customer ID.
        Guid? idMatch = Guid.TryParse(term, out var parsedId) ? parsedId : null;

        // Step 1: find customers (RoleId = Customer) whose own fields match.
        var directMatches = genericRepository.Get<User>(
            u =>
                u.RoleId == customerRoleId &&
                (
                    (idMatch != null && u.Id == idMatch) ||
                    u.Name.ToLower().Contains(term) ||
                    u.PhoneNumber.ToLower().Contains(term) ||
                    u.EmailAddress.ToLower().Contains(term)
                )
        ).Take(limit).ToList();

        // Step 2: find vehicles whose number matches; collect their owner user IDs.
        var vehicleMatches = genericRepository.Get<Vehicle>(
            v => v.VehicleNumber.ToLower().Contains(term)
                 || v.LicenseNumber.ToLower().Contains(term)
        ).Take(limit).ToList();

        var matchedCustomerIds = vehicleMatches
            .Select(v => v.UserId)
            .Except(directMatches.Select(c => c.Id))
            .ToHashSet();

        // Step 3: load the additional customers from vehicle matches.
        var indirectMatches = matchedCustomerIds.Count > 0
            ? genericRepository.Get<User>(
                u => u.RoleId == customerRoleId && matchedCustomerIds.Contains(u.Id)
            ).ToList()
            : new List<User>();

        var allCustomers = directMatches.Concat(indirectMatches).Take(limit).ToList();

        if (allCustomers.Count == 0) return new List<CustomerSearchResultDto>();

        // Step 4: load all vehicles for the matched customers in one query.
        var customerIds = allCustomers.Select(c => c.Id).ToHashSet();

        var allVehicles = genericRepository.Get<Vehicle>(
            v => customerIds.Contains(v.UserId)
        ).ToList();

        var vehiclesByCustomer = allVehicles
            .GroupBy(v => v.UserId)
            .ToDictionary(g => g.Key, g => g.ToList());

        // Step 5: load the Customer role so UserDto includes role info.
        var customerRole = genericRepository.GetById<Role>(customerRoleId);

        // Step 6: project to result DTOs.
        return allCustomers
            .Select(c =>
            {
                c.Role = customerRole;
                return new CustomerSearchResultDto
                {
                    Customer = c.ToUserDto(),
                    Vehicles = (vehiclesByCustomer.GetValueOrDefault(c.Id) ?? new List<Vehicle>())
                        .Select(v => v.ToVehicleDto(c))
                        .ToList()
                };
            })
            .ToList();
    }

    public void RegisterUser(RegisterUserDto user)
    {
        var duplicateUser = genericRepository.GetFirstOrDefault<User>(x => x.Username == user.Username || x.EmailAddress == user.EmailAddress || x.PhoneNumber == user.PhoneNumber);

        if (duplicateUser != null)
        {
            throw new BadRequestException("The following user with the specified username, phone number or email address already exists.");
        }

        var role = genericRepository.GetById<Role>(user.RoleId)
                   ?? throw new NotFoundException("The respective role with the specified identifier was not found.");

        if (!role.IsRegisterable)
        {
            throw new BadRequestException("A new user with the respective role cannot be be registered.");
        }

        var password = user.Password.Hash();

        var asset = user.ProfileImage != null ? fileService.UploadDocument(user.ProfileImage, UserImagesFilePath) : null;

        var userModel = new User(
            role.Id,
            user.Name,
            user.Username,
            user.EmailAddress,
            user.Address,
            asset?.ToAssetModel(),
            password,
            user.PhoneNumber,
            true,
            null);

        genericRepository.Insert(userModel);

        var emailModel = new RegistrationConfirmationDto()
        {
            UserId = userModel.Id,
            Password = user.Password.Encrypt(Constants.Password.SecretKey)
        };

        var outbox = new EmailOutbox(
            user.EmailAddress,
            user.Name,
            "Account Registration",
            EmailProcess.UserRegistration,
            JsonSerializer.Serialize(emailModel)
        );

        genericRepository.Insert(outbox);
    }

    public void UpdateUser(Guid userId, UpdateUserDto user)
    {
        if (userId != user.Id)
        {
            throw new BadRequestException("Route identifier does not match payload identifier.");
        }

        var userModel = genericRepository.GetById<User>(user.Id)
                            ?? throw new NotFoundException($"User with identifier '{userId}' was not found.");

        var duplicateUser = genericRepository.GetFirstOrDefault<User>(x =>
            (x.Username == user.Username || x.EmailAddress == user.EmailAddress || x.PhoneNumber == user.PhoneNumber) && x.Id != userModel.Id);

        if (duplicateUser != null)
        {
            throw new BadRequestException("The following user with the specified username or email address already exists.");
        }

        var roleId = userModel.RoleId;

        if (userModel.RoleId != user.RoleId)
        {
            var role = genericRepository.GetById<Role>(user.RoleId)
                           ?? throw new NotFoundException("The respective role with the specified identifier was not found.");

            roleId = role.Id;
        }

        if (user.ProfileImage is not null)
        {
            if (userModel.ProfileImage is not null && !string.IsNullOrEmpty(userModel.ProfileImage.FileUrl))
            {
                var oldImagePath = Path.Combine(UserImagesFilePath, userModel.ProfileImage.FileUrl);
                
                fileService.DeleteFile(oldImagePath);
            }

            var profileImageAsset = fileService.UploadDocument(user.ProfileImage, UserImagesFilePath);
            
            userModel.UpdateProfileImage(profileImageAsset.ToAssetModel());
        }
        
        userModel.Update(
            roleId,
            user.Name,
            user.Username,
            user.EmailAddress,
            user.Address,
            user.PhoneNumber);

        genericRepository.Update(userModel);
    }

    public void ActivateDeactivateUser(Guid userId)
    {
        var userModel = genericRepository.GetById<User>(userId)
                            ?? throw new NotFoundException($"User with identifier '{userId}' was not found.");

        var role = genericRepository.GetById<Role>(userModel.RoleId)
                   ?? throw new NotFoundException("The respective role with the specified identifier was not found.");

        if (!role.IsRegisterable)
        {
            throw new BadRequestException("A user with the respective assigned role cannot be deactivated.");
        }

        userModel.ActivateDeactivateEntity();

        genericRepository.Update(userModel);
    }

    public Guid RegisterWalkInCustomer(RegisterWalkInCustomerDto dto)
    {
        // 1. Validate required fields.
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new BadRequestException("Customer name is required.");

        if (string.IsNullOrWhiteSpace(dto.PhoneNumber))
            throw new BadRequestException("Customer phone number is required.");

        if (string.IsNullOrWhiteSpace(dto.EmailAddress))
            throw new BadRequestException("Customer email address is required.");

        if (!dto.EmailAddress.Contains('@'))
            throw new BadRequestException("Email address is not in a valid format.");

        // 2. Check for duplicates against existing Users.
        var duplicate = genericRepository.GetFirstOrDefault<User>(
            x => x.PhoneNumber == dto.PhoneNumber || x.EmailAddress == dto.EmailAddress);

        if (duplicate != null)
            throw new BadRequestException("A user with this phone number or email already exists.");

        // 3. Validate vehicle inputs for duplicates within request and against the database.
        var vehicleNumbers = dto.Vehicles
            .Select(v => v.VehicleNumber.Trim())
            .Where(v => !string.IsNullOrEmpty(v))
            .ToList();

        if (vehicleNumbers.Distinct(StringComparer.OrdinalIgnoreCase).Count() != vehicleNumbers.Count)
            throw new BadRequestException("Duplicate vehicle numbers in request.");

        foreach (var vn in vehicleNumbers)
        {
            if (genericRepository.Exists<Vehicle>(v => v.VehicleNumber == vn))
                throw new BadRequestException($"Vehicle number '{vn}' is already registered.");
        }

        // 4. Look up the Customer role.
        var customerRoleId = Guid.Parse(Constants.Roles.Customer.Id);
        var customerRole = genericRepository.GetById<Role>(customerRoleId)
            ?? throw new NotFoundException("Customer role is not configured.");

        // 5. Generate a username and a temporary password.
        var baseUsername = $"cust_{dto.PhoneNumber.Trim()}";
        var username = baseUsername;
        var suffix = 0;
        while (genericRepository.Exists<User>(u => u.Username == username))
        {
            suffix++;
            username = $"{baseUsername}_{suffix}";
        }

        var tempPassword = GenerateTemporaryPassword();
        var passwordHash = tempPassword.Hash();

        // 6. Create the user (mark as verified — staff vouches for them).
        var user = new User(
            roleId: customerRole.Id,
            name: dto.Name.Trim(),
            username: username,
            emailAddress: dto.EmailAddress.Trim(),
            address: string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim(),
            profileImage: null,
            passwordHash: passwordHash,
            phoneNumber: dto.PhoneNumber.Trim(),
            isVerified: true,
            verificationCode: null);

        var userId = genericRepository.Insert(user);

        // 7. Create the vehicles linked to the new user.
        if (dto.Vehicles.Count > 0)
        {
            var vehicles = dto.Vehicles
                .Where(v => !string.IsNullOrWhiteSpace(v.VehicleNumber))
                .Select(v => new Vehicle(
                    userId,
                    v.VehicleNumber.Trim(),
                    v.LicenseNumber?.Trim() ?? string.Empty,
                    v.Make.Trim(),
                    v.Model.Trim(),
                    v.Year,
                    v.FuelType
                )).ToList();

            if (vehicles.Count > 0)
                genericRepository.AddMultipleEntity(vehicles);
        }

        // 8. Queue a welcome email with the temporary password.
        var emailPayload = new RegistrationConfirmationDto
        {
            UserId = userId,
            Password = tempPassword.Encrypt(Constants.Password.SecretKey)
        };

        var outbox = new EmailOutbox(
            dto.EmailAddress.Trim(),
            dto.Name.Trim(),
            "Welcome — your customer account at GearVault",
            EmailProcess.UserRegistration,
            JsonSerializer.Serialize(emailPayload));

        genericRepository.Insert(outbox);

        return userId;
    }

    private static string GenerateTemporaryPassword()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
        var bytes = new byte[10];
        System.Security.Cryptography.RandomNumberGenerator.Fill(bytes);
        var result = new char[10];
        for (int i = 0; i < 10; i++)
        {
            result[i] = chars[bytes[i] % chars.Length];
        }
        return new string(result);
    }

    public CustomerFullProfileDto GetCustomerFullProfile(Guid customerId, int recentInvoiceLimit = 20)
    {
        if (recentInvoiceLimit <= 0 || recentInvoiceLimit > 100) recentInvoiceLimit = 20;

        // 1. Load the customer.
        var customer = genericRepository.GetById<User>(customerId)
            ?? throw new NotFoundException("Customer not found.");

        var role = genericRepository.GetById<Role>(customer.RoleId);
        customer.Role = role;

        // 2. Load all the customer's vehicles.
        var vehicles = genericRepository.Get<Vehicle>(
            v => v.UserId == customerId,
            asNoTracking: true
        ).ToList();

        // 3. Load all sales invoices for the customer (via their vehicles).
        var vehicleIds = vehicles.Select(v => v.Id).ToHashSet();

        var allInvoices = vehicleIds.Count > 0
            ? genericRepository.Get<SalesInvoice>(
                i => vehicleIds.Contains(i.VehicleId),
                asNoTracking: true
            ).ToList()
            : new List<SalesInvoice>();

        var totalInvoiceCount = allInvoices.Count;
        var lifetimeSpend = allInvoices.Sum(i => i.TotalAmount);
        var outstandingBalance = allInvoices
            .Where(i => i.PaymentStatus != PaymentStatus.Paid)
            .Sum(i => i.BalanceDue);

        var recentInvoices = allInvoices
            .OrderByDescending(i => i.CreatedAt)
            .Take(recentInvoiceLimit)
            .ToList();

        // 4. Hydrate the recent invoices with their items + staff names.
        var invoiceIds = recentInvoices.Select(i => i.Id).ToHashSet();
        var staffIds = recentInvoices.Select(i => i.StaffId).Distinct().ToHashSet();

        var invoiceVehicles = vehicles.ToDictionary(v => v.Id, v => v);

        var staffUsers = genericRepository.Get<User>(u => staffIds.Contains(u.Id))
            .ToDictionary(u => u.Id, u => u);

        var items = invoiceIds.Count > 0
            ? genericRepository.Get<SalesInvoiceItem>(i => invoiceIds.Contains(i.SalesInvoiceId))
                .GroupBy(i => i.SalesInvoiceId)
                .ToDictionary(g => g.Key, g => g.ToList())
            : new Dictionary<Guid, List<SalesInvoiceItem>>();

        var partIds = items.Values
            .SelectMany(x => x)
            .Select(i => i.PartId)
            .Distinct()
            .ToHashSet();

        var parts = partIds.Count > 0
            ? genericRepository.Get<Part>(p => partIds.Contains(p.Id))
                .ToDictionary(p => p.Id, p => p)
            : new Dictionary<Guid, Part>();

        var invoiceDtos = recentInvoices.Select(invoice =>
        {
            invoiceVehicles.TryGetValue(invoice.VehicleId, out var vehicle);
            staffUsers.TryGetValue(invoice.StaffId, out var staff);

            var invoiceItems = items.GetValueOrDefault(invoice.Id) ?? new List<SalesInvoiceItem>();
            foreach (var item in invoiceItems)
            {
                if (parts.TryGetValue(item.PartId, out var part))
                {
                    item.Part = part;
                }
            }

            return invoice.ToSalesInvoiceDto(customer, vehicle!, staff, invoiceItems);
        }).ToList();

        // 5. Project.
        return new CustomerFullProfileDto
        {
            Customer = customer.ToUserDto(),
            Vehicles = vehicles.Select(v => v.ToVehicleDto(customer)).ToList(),
            RecentInvoices = invoiceDtos,
            TotalInvoiceCount = totalInvoiceCount,
            LifetimeSpend = lifetimeSpend,
            OutstandingBalance = outstandingBalance
        };
    }
}
