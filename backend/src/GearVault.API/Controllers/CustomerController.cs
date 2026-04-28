using System.Net;
using Gridforce.Attributes;
using Microsoft.AspNetCore.Mvc;
using GearVault.API.Controllers.Base;
using GearVault.Application.DTOs.Customers;
using GearVault.Application.Common.Response;
using GearVault.Application.Interfaces.Services;

namespace GearVault.API.Controllers;

public class CustomerController(ICustomerService customerService) : BaseController<CustomerController>
{
    [HttpGet]
    [Documentation("GetAllCustomers", "Retrieve all customers with pagination.")]
    public CollectionDto<CustomerDto> GetAllCustomers(
        [FromQuery] PaginationQueryDto paginationQuery,
        [FromQuery] SearchAndActiveFlagQueryDto searchAndActiveFlagQuery,
        [FromQuery] OrderQueryDto orderQuery)
    {
        var result = customerService.GetAllCustomers(
            paginationQuery.PageNumber,
            paginationQuery.PageSize,
            out var rowCount,
            searchAndActiveFlagQuery.GlobalSearch,
            searchAndActiveFlagQuery.IsActive,
            orderQuery.OrderBys);

        return new CollectionDto<CustomerDto>(
            (int)HttpStatusCode.OK,
            "Successfully fetched customers.",
            result,
            rowCount,
            paginationQuery.PageNumber,
            paginationQuery.PageSize);
    }

    [HttpGet("search")]
    [Documentation("SearchCustomers", "Search customers by name, phone, customer ID, or vehicle number.")]
    public ResponseDto<List<CustomerDto>> SearchCustomers(
        [FromQuery] string q,
        [FromQuery] int limit = 20)
    {
        var result = customerService.SearchCustomers(q, limit);

        return new ResponseDto<List<CustomerDto>>(
            (int)HttpStatusCode.OK,
            "Successfully searched customers.",
            result);
    }

    [HttpGet("{customerId:guid}")]
    [Documentation("GetCustomerById", "Retrieve customer details with vehicles by identifier.")]
    public ResponseDto<CustomerDto> GetCustomerById([FromRoute] Guid customerId)
    {
        var result = customerService.GetCustomerById(customerId);

        return new ResponseDto<CustomerDto>(
            (int)HttpStatusCode.OK,
            "Successfully fetched customer details.",
            result);
    }

    [HttpPost]
    [Documentation("RegisterCustomer", "Register a new walk-in customer with optional vehicle details.")]
    public ResponseDto<Guid> RegisterCustomer([FromBody] CreateCustomerDto dto)
    {
        var customerId = customerService.RegisterCustomer(dto);

        return new ResponseDto<Guid>(
            (int)HttpStatusCode.OK,
            "Customer registered successfully.",
            customerId);
    }

    [HttpPut("{customerId:guid}")]
    [Documentation("UpdateCustomer", "Update customer details.")]
    public ResponseDto<bool> UpdateCustomer([FromRoute] Guid customerId, [FromBody] UpdateCustomerDto dto)
    {
        customerService.UpdateCustomer(customerId, dto);

        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "Customer updated successfully.",
            true);
    }

    [HttpPatch("{customerId:guid}/activate-deactivate")]
    [Documentation("ActivateDeactivateCustomer", "Activate or deactivate a customer.")]
    public ResponseDto<bool> ActivateDeactivateCustomer([FromRoute] Guid customerId)
    {
        customerService.ActivateDeactivateCustomer(customerId);

        return new ResponseDto<bool>(
            (int)HttpStatusCode.OK,
            "Customer status updated successfully.",
            true);
    }
}