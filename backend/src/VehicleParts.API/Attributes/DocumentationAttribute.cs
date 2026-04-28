using Swashbuckle.AspNetCore.Annotations;

namespace Gridforce.Attributes;

[AttributeUsage(AttributeTargets.Method, Inherited = false)]
public class DocumentationAttribute : SwaggerOperationAttribute
{
    public DocumentationAttribute(string title, string description) : base(title, description)
    {
        OperationId = title;
    }
}