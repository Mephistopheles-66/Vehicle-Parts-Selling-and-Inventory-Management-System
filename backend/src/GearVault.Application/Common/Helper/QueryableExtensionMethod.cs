using System.Linq.Expressions;

namespace GearVault.Application.Common.Helper;

public static class QueryableExtensionMethod
{
    public static IOrderedQueryable<T> OrderByDynamic<T>(this IQueryable<T> query, string propertyName, bool descending, bool firstOrder)
    {
        var parameter = Expression.Parameter(typeof(T), "x");
        Expression property = parameter;

        foreach (var member in propertyName.Split('.'))
        {
            property = Expression.PropertyOrField(property, member);
        }

        var lambda = Expression.Lambda(property, parameter);

        string methodName;

        if (firstOrder)
        {
            methodName = descending ? "OrderByDescending" : "OrderBy";
        }
        else
        {
            methodName = descending ? "ThenByDescending" : "ThenBy";
        }

        var result = typeof(Queryable).GetMethods()
            .First(m => m.Name == methodName && m.GetParameters().Length == 2)
            .MakeGenericMethod(typeof(T), property.Type)
            .Invoke(null, new object[] { query, lambda });

        return (IOrderedQueryable<T>)result!;
    }
}