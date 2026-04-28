using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GearVault.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomerVehicleSalesInvoice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Users_CreatedBy",
                table: "Customer");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Users_DeletedBy",
                table: "Customer");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Users_LastModifiedBy",
                table: "Customer");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Users_UserId",
                table: "Customer");

            migrationBuilder.DropForeignKey(
                name: "FK_SalesInvoice_Customer_CustomerId",
                table: "SalesInvoice");

            migrationBuilder.DropForeignKey(
                name: "FK_SalesInvoice_Users_CreatedBy",
                table: "SalesInvoice");

            migrationBuilder.DropForeignKey(
                name: "FK_SalesInvoice_Users_DeletedBy",
                table: "SalesInvoice");

            migrationBuilder.DropForeignKey(
                name: "FK_SalesInvoice_Users_LastModifiedBy",
                table: "SalesInvoice");

            migrationBuilder.DropForeignKey(
                name: "FK_SalesInvoice_Users_StaffId",
                table: "SalesInvoice");

            migrationBuilder.DropForeignKey(
                name: "FK_SalesInvoice_Vehicle_VehicleId",
                table: "SalesInvoice");

            migrationBuilder.DropForeignKey(
                name: "FK_SalesInvoiceItem_SalesInvoice_SalesInvoiceId",
                table: "SalesInvoiceItem");

            migrationBuilder.DropForeignKey(
                name: "FK_Vehicle_Customer_CustomerId",
                table: "Vehicle");

            migrationBuilder.DropForeignKey(
                name: "FK_Vehicle_Users_CreatedBy",
                table: "Vehicle");

            migrationBuilder.DropForeignKey(
                name: "FK_Vehicle_Users_DeletedBy",
                table: "Vehicle");

            migrationBuilder.DropForeignKey(
                name: "FK_Vehicle_Users_LastModifiedBy",
                table: "Vehicle");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Vehicle",
                table: "Vehicle");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SalesInvoiceItem",
                table: "SalesInvoiceItem");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SalesInvoice",
                table: "SalesInvoice");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer",
                table: "Customer");

            migrationBuilder.RenameTable(
                name: "Vehicle",
                newName: "Vehicles");

            migrationBuilder.RenameTable(
                name: "SalesInvoiceItem",
                newName: "SalesInvoiceItems");

            migrationBuilder.RenameTable(
                name: "SalesInvoice",
                newName: "SalesInvoices");

            migrationBuilder.RenameTable(
                name: "Customer",
                newName: "Customers");

            migrationBuilder.RenameIndex(
                name: "IX_Vehicle_VehicleNumber",
                table: "Vehicles",
                newName: "IX_Vehicles_VehicleNumber");

            migrationBuilder.RenameIndex(
                name: "IX_Vehicle_LastModifiedBy",
                table: "Vehicles",
                newName: "IX_Vehicles_LastModifiedBy");

            migrationBuilder.RenameIndex(
                name: "IX_Vehicle_DeletedBy",
                table: "Vehicles",
                newName: "IX_Vehicles_DeletedBy");

            migrationBuilder.RenameIndex(
                name: "IX_Vehicle_CustomerId",
                table: "Vehicles",
                newName: "IX_Vehicles_CustomerId");

            migrationBuilder.RenameIndex(
                name: "IX_Vehicle_CreatedBy",
                table: "Vehicles",
                newName: "IX_Vehicles_CreatedBy");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoiceItem_SalesInvoiceId",
                table: "SalesInvoiceItems",
                newName: "IX_SalesInvoiceItems_SalesInvoiceId");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoiceItem_PartId",
                table: "SalesInvoiceItems",
                newName: "IX_SalesInvoiceItems_PartId");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoice_VehicleId",
                table: "SalesInvoices",
                newName: "IX_SalesInvoices_VehicleId");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoice_StaffId",
                table: "SalesInvoices",
                newName: "IX_SalesInvoices_StaffId");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoice_PaymentStatus",
                table: "SalesInvoices",
                newName: "IX_SalesInvoices_PaymentStatus");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoice_LastModifiedBy",
                table: "SalesInvoices",
                newName: "IX_SalesInvoices_LastModifiedBy");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoice_InvoiceNumber",
                table: "SalesInvoices",
                newName: "IX_SalesInvoices_InvoiceNumber");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoice_DeletedBy",
                table: "SalesInvoices",
                newName: "IX_SalesInvoices_DeletedBy");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoice_CustomerId",
                table: "SalesInvoices",
                newName: "IX_SalesInvoices_CustomerId");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoice_CreatedBy",
                table: "SalesInvoices",
                newName: "IX_SalesInvoices_CreatedBy");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoice_CreatedAt",
                table: "SalesInvoices",
                newName: "IX_SalesInvoices_CreatedAt");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_UserId",
                table: "Customers",
                newName: "IX_Customers_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_PhoneNumber",
                table: "Customers",
                newName: "IX_Customers_PhoneNumber");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_LastModifiedBy",
                table: "Customers",
                newName: "IX_Customers_LastModifiedBy");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_FullName",
                table: "Customers",
                newName: "IX_Customers_FullName");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_EmailAddress",
                table: "Customers",
                newName: "IX_Customers_EmailAddress");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_DeletedBy",
                table: "Customers",
                newName: "IX_Customers_DeletedBy");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_CreatedBy",
                table: "Customers",
                newName: "IX_Customers_CreatedBy");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Vehicles",
                table: "Vehicles",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SalesInvoiceItems",
                table: "SalesInvoiceItems",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SalesInvoices",
                table: "SalesInvoices",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customers",
                table: "Customers",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Users_CreatedBy",
                table: "Customers",
                column: "CreatedBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Users_DeletedBy",
                table: "Customers",
                column: "DeletedBy",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Users_LastModifiedBy",
                table: "Customers",
                column: "LastModifiedBy",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Users_UserId",
                table: "Customers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_SalesInvoiceItems_Parts_PartId",
                table: "SalesInvoiceItems",
                column: "PartId",
                principalTable: "Parts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SalesInvoiceItems_SalesInvoices_SalesInvoiceId",
                table: "SalesInvoiceItems",
                column: "SalesInvoiceId",
                principalTable: "SalesInvoices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SalesInvoices_Customers_CustomerId",
                table: "SalesInvoices",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SalesInvoices_Users_CreatedBy",
                table: "SalesInvoices",
                column: "CreatedBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SalesInvoices_Users_DeletedBy",
                table: "SalesInvoices",
                column: "DeletedBy",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SalesInvoices_Users_LastModifiedBy",
                table: "SalesInvoices",
                column: "LastModifiedBy",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SalesInvoices_Users_StaffId",
                table: "SalesInvoices",
                column: "StaffId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SalesInvoices_Vehicles_VehicleId",
                table: "SalesInvoices",
                column: "VehicleId",
                principalTable: "Vehicles",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicles_Customers_CustomerId",
                table: "Vehicles",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicles_Users_CreatedBy",
                table: "Vehicles",
                column: "CreatedBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicles_Users_DeletedBy",
                table: "Vehicles",
                column: "DeletedBy",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicles_Users_LastModifiedBy",
                table: "Vehicles",
                column: "LastModifiedBy",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Users_CreatedBy",
                table: "Customers");

            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Users_DeletedBy",
                table: "Customers");

            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Users_LastModifiedBy",
                table: "Customers");

            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Users_UserId",
                table: "Customers");

            migrationBuilder.DropForeignKey(
                name: "FK_SalesInvoiceItems_Parts_PartId",
                table: "SalesInvoiceItems");

            migrationBuilder.DropForeignKey(
                name: "FK_SalesInvoiceItems_SalesInvoices_SalesInvoiceId",
                table: "SalesInvoiceItems");

            migrationBuilder.DropForeignKey(
                name: "FK_SalesInvoices_Customers_CustomerId",
                table: "SalesInvoices");

            migrationBuilder.DropForeignKey(
                name: "FK_SalesInvoices_Users_CreatedBy",
                table: "SalesInvoices");

            migrationBuilder.DropForeignKey(
                name: "FK_SalesInvoices_Users_DeletedBy",
                table: "SalesInvoices");

            migrationBuilder.DropForeignKey(
                name: "FK_SalesInvoices_Users_LastModifiedBy",
                table: "SalesInvoices");

            migrationBuilder.DropForeignKey(
                name: "FK_SalesInvoices_Users_StaffId",
                table: "SalesInvoices");

            migrationBuilder.DropForeignKey(
                name: "FK_SalesInvoices_Vehicles_VehicleId",
                table: "SalesInvoices");

            migrationBuilder.DropForeignKey(
                name: "FK_Vehicles_Customers_CustomerId",
                table: "Vehicles");

            migrationBuilder.DropForeignKey(
                name: "FK_Vehicles_Users_CreatedBy",
                table: "Vehicles");

            migrationBuilder.DropForeignKey(
                name: "FK_Vehicles_Users_DeletedBy",
                table: "Vehicles");

            migrationBuilder.DropForeignKey(
                name: "FK_Vehicles_Users_LastModifiedBy",
                table: "Vehicles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Vehicles",
                table: "Vehicles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SalesInvoices",
                table: "SalesInvoices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SalesInvoiceItems",
                table: "SalesInvoiceItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customers",
                table: "Customers");

            migrationBuilder.RenameTable(
                name: "Vehicles",
                newName: "Vehicle");

            migrationBuilder.RenameTable(
                name: "SalesInvoices",
                newName: "SalesInvoice");

            migrationBuilder.RenameTable(
                name: "SalesInvoiceItems",
                newName: "SalesInvoiceItem");

            migrationBuilder.RenameTable(
                name: "Customers",
                newName: "Customer");

            migrationBuilder.RenameIndex(
                name: "IX_Vehicles_VehicleNumber",
                table: "Vehicle",
                newName: "IX_Vehicle_VehicleNumber");

            migrationBuilder.RenameIndex(
                name: "IX_Vehicles_LastModifiedBy",
                table: "Vehicle",
                newName: "IX_Vehicle_LastModifiedBy");

            migrationBuilder.RenameIndex(
                name: "IX_Vehicles_DeletedBy",
                table: "Vehicle",
                newName: "IX_Vehicle_DeletedBy");

            migrationBuilder.RenameIndex(
                name: "IX_Vehicles_CustomerId",
                table: "Vehicle",
                newName: "IX_Vehicle_CustomerId");

            migrationBuilder.RenameIndex(
                name: "IX_Vehicles_CreatedBy",
                table: "Vehicle",
                newName: "IX_Vehicle_CreatedBy");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoices_VehicleId",
                table: "SalesInvoice",
                newName: "IX_SalesInvoice_VehicleId");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoices_StaffId",
                table: "SalesInvoice",
                newName: "IX_SalesInvoice_StaffId");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoices_PaymentStatus",
                table: "SalesInvoice",
                newName: "IX_SalesInvoice_PaymentStatus");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoices_LastModifiedBy",
                table: "SalesInvoice",
                newName: "IX_SalesInvoice_LastModifiedBy");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoices_InvoiceNumber",
                table: "SalesInvoice",
                newName: "IX_SalesInvoice_InvoiceNumber");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoices_DeletedBy",
                table: "SalesInvoice",
                newName: "IX_SalesInvoice_DeletedBy");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoices_CustomerId",
                table: "SalesInvoice",
                newName: "IX_SalesInvoice_CustomerId");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoices_CreatedBy",
                table: "SalesInvoice",
                newName: "IX_SalesInvoice_CreatedBy");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoices_CreatedAt",
                table: "SalesInvoice",
                newName: "IX_SalesInvoice_CreatedAt");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoiceItems_SalesInvoiceId",
                table: "SalesInvoiceItem",
                newName: "IX_SalesInvoiceItem_SalesInvoiceId");

            migrationBuilder.RenameIndex(
                name: "IX_SalesInvoiceItems_PartId",
                table: "SalesInvoiceItem",
                newName: "IX_SalesInvoiceItem_PartId");

            migrationBuilder.RenameIndex(
                name: "IX_Customers_UserId",
                table: "Customer",
                newName: "IX_Customer_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Customers_PhoneNumber",
                table: "Customer",
                newName: "IX_Customer_PhoneNumber");

            migrationBuilder.RenameIndex(
                name: "IX_Customers_LastModifiedBy",
                table: "Customer",
                newName: "IX_Customer_LastModifiedBy");

            migrationBuilder.RenameIndex(
                name: "IX_Customers_FullName",
                table: "Customer",
                newName: "IX_Customer_FullName");

            migrationBuilder.RenameIndex(
                name: "IX_Customers_EmailAddress",
                table: "Customer",
                newName: "IX_Customer_EmailAddress");

            migrationBuilder.RenameIndex(
                name: "IX_Customers_DeletedBy",
                table: "Customer",
                newName: "IX_Customer_DeletedBy");

            migrationBuilder.RenameIndex(
                name: "IX_Customers_CreatedBy",
                table: "Customer",
                newName: "IX_Customer_CreatedBy");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Vehicle",
                table: "Vehicle",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SalesInvoice",
                table: "SalesInvoice",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SalesInvoiceItem",
                table: "SalesInvoiceItem",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer",
                table: "Customer",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Users_CreatedBy",
                table: "Customer",
                column: "CreatedBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Users_DeletedBy",
                table: "Customer",
                column: "DeletedBy",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Users_LastModifiedBy",
                table: "Customer",
                column: "LastModifiedBy",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Users_UserId",
                table: "Customer",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_SalesInvoice_Customer_CustomerId",
                table: "SalesInvoice",
                column: "CustomerId",
                principalTable: "Customer",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SalesInvoice_Users_CreatedBy",
                table: "SalesInvoice",
                column: "CreatedBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SalesInvoice_Users_DeletedBy",
                table: "SalesInvoice",
                column: "DeletedBy",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SalesInvoice_Users_LastModifiedBy",
                table: "SalesInvoice",
                column: "LastModifiedBy",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SalesInvoice_Users_StaffId",
                table: "SalesInvoice",
                column: "StaffId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SalesInvoice_Vehicle_VehicleId",
                table: "SalesInvoice",
                column: "VehicleId",
                principalTable: "Vehicle",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_SalesInvoiceItem_SalesInvoice_SalesInvoiceId",
                table: "SalesInvoiceItem",
                column: "SalesInvoiceId",
                principalTable: "SalesInvoice",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicle_Customer_CustomerId",
                table: "Vehicle",
                column: "CustomerId",
                principalTable: "Customer",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicle_Users_CreatedBy",
                table: "Vehicle",
                column: "CreatedBy",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicle_Users_DeletedBy",
                table: "Vehicle",
                column: "DeletedBy",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicle_Users_LastModifiedBy",
                table: "Vehicle",
                column: "LastModifiedBy",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
