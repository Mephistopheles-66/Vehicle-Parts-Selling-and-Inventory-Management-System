namespace GearVault.Domain.Common;

public abstract class Constants
{
    public abstract class Roles
    {
        public abstract class Administrator
        {
            public const string Id = "019b68f0-0001-7000-a000-cc30eb9410dc";
            public const string Name = "Super Admin";
            public const string Description = "The highest authority role, responsible for overseeing operational governance across all modules.";
            public const bool IsRegisterable = false;
        }

        public abstract class Staff
        {
            public const string Id = "019b68f0-0002-7000-a000-cc30eb9410dc";
            public const string Name = "Staff";
            public const string Description = "Role applicable for handling sales, customer service, and transactions smoothly.";
            public const bool IsRegisterable = true;
        }

        public abstract class Customer
        {
            public const string Id = "019b68f0-0003-7000-a000-cc30eb9410dc";
            public const string Name = "Customer";
            public const string Description = "The lowest level of role to interact with the service center easily without depending fully on staff.";
            public const bool IsRegisterable = true;
        }
    }

    public abstract class DbProviderKeys
    {
        public const string Npgsql = "postgresql";
        public const string SqlServer = "mssql";
    }

    private abstract class FolderPath
    {
        public const string Images = "images";
        public const string EmailTemplates = "email-templates";
    }

    private abstract class FolderPrefix
    {
        public const string UserImagesPrefix = "user-images";
    }

    public abstract class FilePath
    {
        public const string UserImagesFilePath = $"{FolderPath.Images}/{FolderPrefix.UserImagesPrefix}/";
        public const string EmailTemplatesFilePath = $"{FolderPath.EmailTemplates}/";
    }

    public abstract class Cors
    {
        public const string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
    }

    public abstract class Password
    {
        public const string SecretKey = "secret-key-for-encryption-and-decryption";
    }

    public abstract class Cookie
    {
        public const string TokenPayload = "X-Vehicle-Token-Payload";
        public const string TokenSignature = "X-Vehicle-Token-Signature";
        public const string TokenExpiration = "X-Vehicle-Token-Expiration";
    }
}