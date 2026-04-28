using Microsoft.AspNetCore.Http;
using GearVault.Application.DTOs.Assets;
using GearVault.Application.Common.Service;

namespace GearVault.Application.Interfaces.Services;

public interface IFileService: ITransientService
{
    AssetDto UploadDocument(IFormFile file, string uploadedFilePath, string? prefix = null);

    string UploadDocument(string base64Image, string uploadedFilePath, string? prefix = null);

    void DeleteFile(string uploadedFilePath);

    void DeleteFolder(string folderPath);

    string FileExistPath(string uploadedFilePath);
}