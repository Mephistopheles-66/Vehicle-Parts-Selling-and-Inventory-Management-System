using GearVault.Domain.Common.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearVault.Domain.Entities;

public class User(
    Guid roleId,
    string name, 
    string username,
    string emailAddress,
    string? address,
    Asset? profileImage,
    string passwordHash,
    string phoneNumber,
    bool isVerified,
    string? verificationCode
) : BaseEntity<Guid>
{
    [ForeignKey(nameof(Role))]
    public Guid RoleId { get; private set; } = roleId;

    public string Name { get; private set; } = name;

    public string Username { get; private set; } = username;

    public string EmailAddress { get; private set; } = emailAddress;

    public string? Address { get; private set; } = address;

    public Asset? ProfileImage { get; private set; } = profileImage;

    public string PasswordHash { get; private set; } = passwordHash;

    public string PhoneNumber { get; private set; } = phoneNumber;

    public bool IsVerified { get; private set; } = isVerified;

    public string? VerificationCode { get; private set; } = verificationCode;

    public virtual Role? Role { get; set; }

    public void Update(Guid roleId, string name, string username, string emailAddress, string? address, string phoneNumber)
    {
        RoleId = roleId;
        Name = name;
        Username = username;
        EmailAddress = emailAddress;
        Address = address;
        PhoneNumber = phoneNumber;
    }

    public void UpdateProfileImage(Asset profileImage)
    {
        ProfileImage = profileImage;
    }

    public void RemoveProfileImage()
    {
        ProfileImage = null;
    }

    public void UpdatePassword(string passwordHash)
    {
        PasswordHash = passwordHash;
    }

    public void UpdateVerificationCode(string verificationCode)
    {
        VerificationCode = verificationCode;
    }

    public void Verify()
    {
        IsVerified = true;
        VerificationCode = null;
    }
}