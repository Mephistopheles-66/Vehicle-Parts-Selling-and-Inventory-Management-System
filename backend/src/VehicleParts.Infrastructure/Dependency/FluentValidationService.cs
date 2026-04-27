using System.Net;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using VehicleParts.Application.Common.Response;

namespace VehicleParts.Infrastructure.Dependency;

public class FluentValidationService : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        foreach (var argument in context.ActionArguments.Values)
        {
            if (argument is null) continue;

            var validatorType = typeof(IValidator<>).MakeGenericType(argument.GetType());
            var validator = context.HttpContext.RequestServices.GetService(validatorType);

            if (validator is null) continue;

            var validationContext = new ValidationContext<object>(argument);
            var result = ((IValidator)validator).Validate(validationContext);

            if (!result.IsValid)
            {
                var errors = result.Errors.Select(e => e.ErrorMessage);

                var response = new ResponseDto<object>(
                    (int)HttpStatusCode.BadRequest,
                    string.Join(" ", errors),
                    null
                );

                context.Result = new BadRequestObjectResult(response);
                return;
            }
        }
    }

    public void OnActionExecuted(ActionExecutedContext context) { }
}