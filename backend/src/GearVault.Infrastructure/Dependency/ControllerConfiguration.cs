using System.Net;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using Microsoft.Extensions.DependencyInjection;
using GearVault.Application.Common.Response;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using GearVault.Application.Common.Configuration;

namespace GearVault.Infrastructure.Dependency;

public static class ControllerConfiguration
{
    public static IServiceCollection AddControllerConfiguration(this IServiceCollection services)
    {
        services.AddControllers(options =>
            {
                options.Conventions.Add(new RouteTokenTransformerConvention(new SlugifyParameterConfiguration()));
                options.Filters.Add<FluentValidationService>();
            })
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

        services.Configure<ApiBehaviorOptions>(options =>
        {
            options.SuppressModelStateInvalidFilter = true;
            options.InvalidModelStateResponseFactory = context =>
            {
                var errors = context.ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .SelectMany(e => e.Value!.Errors.Select(err => new
                    {
                        err.ErrorMessage
                    }))
                    .ToList();

                var exception = errors.Select(x => x.ErrorMessage);

                var response = new ResponseDto<object>((int)HttpStatusCode.BadRequest, string.Join(" ", exception), null);

                return new BadRequestObjectResult(response);
            };
        });

        return services;
    }
}