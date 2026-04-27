using System.Net;

namespace VehicleParts.Application.Exceptions;

public class UnauthorizedException(string message, object? result = null) : Exception(message)
{
    public int Status { get; private set; } = (int)HttpStatusCode.Unauthorized;
    
    public object? Result { get; private set; } = result;
}
