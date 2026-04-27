using System.Text;
using System.Security.Cryptography;

namespace VehicleParts.Application.Common.Helper;

public static class PasswordExtensionMethods
{
    #region Hashing and Verification
    private const char SegmentDelimiter = ':';

    public static string Hash(this string input)
    {
        const int keySize = 32;
        const int saltSize = 16;
        const int iterations = 100_000;
        
        var algorithm = HashAlgorithmName.SHA256;
        var salt = RandomNumberGenerator.GetBytes(saltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(input, salt, iterations, algorithm, keySize);

        return string.Join(
            SegmentDelimiter,
            Convert.ToHexString(hash),
            Convert.ToHexString(salt),
            iterations,
            algorithm
        );
    }

    public static bool VerifyHash(this string input, string hashString)
    {
        var segments = hashString.Split(SegmentDelimiter);
        
        var hash = Convert.FromHexString(segments[0]);
        
        var salt = Convert.FromHexString(segments[1]);
        
        var iterations = int.Parse(segments[2]);
        
        var algorithm = new HashAlgorithmName(segments[3]);
        
        var inputHash = Rfc2898DeriveBytes.Pbkdf2(
            input,
            salt,
            iterations,
            algorithm,
            hash.Length
        );

        return CryptographicOperations.FixedTimeEquals(inputHash, hash);
    }
    #endregion

    #region Encryption & Decryption
    private const int KeySize = 32;
    private const int IvSize = 16;

    public static string Encrypt(this string plainText, string key)
    {
        var keyBytes = SHA256.HashData(Encoding.UTF8.GetBytes(key));

        using var aes = Aes.Create();
        aes.Key = keyBytes;
        aes.GenerateIV();

        using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

        var plainBytes = Encoding.UTF8.GetBytes(plainText);
        var cipherBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

        var result = new byte[IvSize + cipherBytes.Length];
        Buffer.BlockCopy(aes.IV, 0, result, 0, IvSize);
        Buffer.BlockCopy(cipherBytes, 0, result, IvSize, cipherBytes.Length);

        return Convert.ToBase64String(result);
    }

    public static string Decrypt(this string cipherText, string key)
    {
        var fullCipher = Convert.FromBase64String(cipherText);

        var keyBytes = SHA256.HashData(Encoding.UTF8.GetBytes(key));

        using var aes = Aes.Create();
        aes.Key = keyBytes;

        var iv = new byte[IvSize];
        var cipherBytes = new byte[fullCipher.Length - IvSize];

        Buffer.BlockCopy(fullCipher, 0, iv, 0, IvSize);
        Buffer.BlockCopy(fullCipher, IvSize, cipherBytes, 0, cipherBytes.Length);

        aes.IV = iv;

        using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

        var plainBytes = decryptor.TransformFinalBlock(cipherBytes, 0, cipherBytes.Length);

        return Encoding.UTF8.GetString(plainBytes);
    }
    #endregion

    #region Generation
    private const string Lowercase = "abcdefghijklmnopqrstuvwxyz";
    private const string Uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private const string Numbers = "0123456789";
    private const string Special = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

    public static string GeneratePassword(int length = 8, bool includeLowercase = true, bool includeUppercase = true, bool includeNumbers = true, bool includeSpecial = true)
    {
        var charPool = new StringBuilder();

        if (includeLowercase) charPool.Append(Lowercase);
        if (includeUppercase) charPool.Append(Uppercase);
        if (includeNumbers) charPool.Append(Numbers);
        if (includeSpecial) charPool.Append(Special);

        if (charPool.Length == 0)
            throw new ArgumentException("At least one character set must be included.");

        var random = new Random();
        var password = new char[length];

        for (var i = 0; i < length; i++)
        {
            password[i] = charPool[random.Next(charPool.Length)];
        }

        return new string(password);
    }
    #endregion
}