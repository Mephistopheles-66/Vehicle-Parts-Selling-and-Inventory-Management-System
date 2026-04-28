using Microsoft.AspNetCore.Mvc;
using GearVault.API.Attributes;

namespace GearVault.API.Controllers.Base;

[Authorize]
[ApiController]
[Route("api/v1/[controller]")]
public abstract class BaseController<T> : ControllerBase where T : BaseController<T>;
