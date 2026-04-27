using Microsoft.AspNetCore.Mvc;
using VehicleParts.API.Attributes;

namespace VehicleParts.API.Controllers.Base;

[Authorize]
[ApiController]
[Route("api/v1/[controller]")]
public abstract class BaseController<T> : ControllerBase where T : BaseController<T>;
