using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerUI;

namespace GearVault.API.Configurations.Application;

public static class SwaggerConfiguration
{
    public static void AddSwaggerConfiguration(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Vehicle API",
                Version = "v1",
                Description = "Vehicle Portal - Web APIs"
            });

            c.EnableAnnotations();

            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "Enter JWT token only. Do not write Bearer manually.",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT"
            });

            c.AddSecurityRequirement(document => new OpenApiSecurityRequirement
            {
                [new OpenApiSecuritySchemeReference("Bearer", document)] = []
            });
        });
    }
    
    public static void AddCustomSwaggerInterface(this IApplicationBuilder app)
    {
        app.UseSwagger(options =>
        {
            options.RouteTemplate = "openapi/{documentName}.json";
        });
    
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/openapi/v1.json", "GearVault API v1");
            options.DefaultModelsExpandDepth(-1);
            options.DocExpansion(DocExpansion.None);
            options.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
        });
    }
}