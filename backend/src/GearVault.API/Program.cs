using Microsoft.Net.Http.Headers;
using Hangfire;
using GearVault.API.Middleware;
using System.IdentityModel.Tokens.Jwt;
using GearVault.Infrastructure.Dependency;
using GearVault.API.Configurations.Application;
using GearVault.Domain.Common;
using GearVault.Application.Interfaces.Services;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;

var configuration = builder.Configuration;

services.AddControllerConfiguration();

builder.AddConfigurations();

services.AddDependencyServices();

services.AddInfrastructureService(configuration);

services.AddDataSeedService();

services.AddEndpointsApiExplorer();

services.AddSwaggerConfiguration();

var app = builder.Build();

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

app.AddCustomSwaggerInterface();

app.AddCustomScalarInterface();

app.UseHangfireDashboard();

RecurringJob.AddOrUpdate<ICreditReminderJob>(
    "overdue-credit-reminders",
    job => job.QueueOverdueCreditReminders(),
    Cron.Daily);

app.UseRouting();

app.UseCors(Constants.Cors.MyAllowSpecificOrigins);

app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<TokenCookieMiddleware>();
app.UseMiddleware<RequestNormalizationMiddleware>();

app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = context =>
    {
        var origin = context.Context.Request.Headers.Origin.ToString();

        context.Context.Response.Headers[HeaderNames.AccessControlAllowOrigin] = origin;
        context.Context.Response.Headers[HeaderNames.Vary] = "Origin";
        context.Context.Response.Headers["Cross-Origin-Resource-Policy"] = "cross-origin";
    }
});

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
