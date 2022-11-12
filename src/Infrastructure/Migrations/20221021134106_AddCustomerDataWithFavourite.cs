using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Optics.Infrastructure.Migrations
{
    public partial class AddCustomerDataWithFavourite : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "SubComplaintPhotoPath",
                table: "SubComplaint",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ComplaintImagePath",
                table: "Complaint",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "FavoriteComplaint",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FavoriteName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsSystem = table.Column<bool>(type: "bit", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    LastModifiedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DeletedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FavoriteComplaint", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FavoriteComplaint_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteComplaint_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteComplaint_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FavoriteDiagnosis",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FavoriteName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsSystem = table.Column<bool>(type: "bit", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    LastModifiedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DeletedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FavoriteDiagnosis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FavoriteDiagnosis_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteDiagnosis_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteDiagnosis_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FavoriteExamination",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FavoriteName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsSystem = table.Column<bool>(type: "bit", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    LastModifiedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DeletedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FavoriteExamination", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FavoriteExamination_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteExamination_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoriteExamination_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FavoritePharmacy",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FavoriteName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsSystem = table.Column<bool>(type: "bit", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    LastModifiedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DeletedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FavoritePharmacy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FavoritePharmacy_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoritePharmacy_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FavoritePharmacy_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "HrSocialStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TypeCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TypeNameAr = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TypeNameEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsSystem = table.Column<bool>(type: "bit", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    LastModifiedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DeletedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HrSocialStatus", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HrSocialStatus_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_HrSocialStatus_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_HrSocialStatus_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "CustomerData",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerMRN = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    CustomerFileNo = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    CustomerNameAr = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CustomerNameEn = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FatherName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FamilyName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    BirthDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Age = table.Column<int>(type: "int", nullable: false),
                    IDType = table.Column<int>(type: "int", nullable: false),
                    PayType = table.Column<int>(type: "int", nullable: false),
                    IDNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Mobile = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Gender = table.Column<int>(type: "int", nullable: false),
                    NationalityId = table.Column<int>(type: "int", nullable: true),
                    ReligionId = table.Column<int>(type: "int", nullable: true),
                    SocialStatusId = table.Column<int>(type: "int", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(850)", maxLength: 850, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsSystem = table.Column<bool>(type: "bit", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    LastModifiedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DeletedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerData_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CustomerData_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CustomerData_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CustomerData_DefNationality_NationalityId",
                        column: x => x.NationalityId,
                        principalTable: "DefNationality",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CustomerData_DefReligion_ReligionId",
                        column: x => x.ReligionId,
                        principalTable: "DefReligion",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CustomerData_HrSocialStatus_SocialStatusId",
                        column: x => x.SocialStatusId,
                        principalTable: "HrSocialStatus",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MedicalInsurance",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<int>(type: "int", nullable: false),
                    InsuranceCompanyName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CardNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ClassType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DateIssued = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DateExpiry = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CardImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsSystem = table.Column<bool>(type: "bit", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    LastModifiedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DeletedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalInsurance", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalInsurance_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MedicalInsurance_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MedicalInsurance_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MedicalInsurance_CustomerData_ClientId",
                        column: x => x.ClientId,
                        principalTable: "CustomerData",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "NationalAddress",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClientId = table.Column<int>(type: "int", nullable: false),
                    UnifiedNationalNumber = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    BuildingNumber = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    StreetName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DistrictName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CityId = table.Column<int>(type: "int", nullable: true),
                    PostalCode = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    ExtraNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    UnitNumber = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsSystem = table.Column<bool>(type: "bit", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    LastModifiedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DeletedUserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NationalAddress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NationalAddress_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_NationalAddress_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_NationalAddress_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_NationalAddress_CustomerData_ClientId",
                        column: x => x.ClientId,
                        principalTable: "CustomerData",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_NationalAddress_DefCity_CityId",
                        column: x => x.CityId,
                        principalTable: "DefCity",
                        principalColumn: "Id");
                });

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "63998b7d-6724-49a6-8488-0798f13726d5",
                column: "ConcurrencyStamp",
                value: "36131156-571f-4d76-ac98-a9657af0a1a2");

            migrationBuilder.UpdateData(
                table: "AspNetUserDefBranch",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6341), new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6342) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "5e46158f-44e1-4e78-8101-8a4617d5daba",
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6154), new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6155) });

            migrationBuilder.UpdateData(
                table: "DefBranch",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6325), new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6326) });

            migrationBuilder.UpdateData(
                table: "DefCompany",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6312), new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6308) });

            migrationBuilder.UpdateData(
                table: "DefCountry",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6379), new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6379) });

            migrationBuilder.UpdateData(
                table: "DefCurrency",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6364), new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6364) });

            migrationBuilder.UpdateData(
                table: "DefReligion",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6393), new DateTime(2022, 10, 21, 15, 41, 5, 70, DateTimeKind.Local).AddTicks(6394) });

            migrationBuilder.CreateIndex(
                name: "IX_CustomerData_CreatedUserId",
                table: "CustomerData",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerData_DeletedUserId",
                table: "CustomerData",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerData_LastModifiedUserId",
                table: "CustomerData",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerData_NationalityId",
                table: "CustomerData",
                column: "NationalityId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerData_ReligionId",
                table: "CustomerData",
                column: "ReligionId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerData_SocialStatusId",
                table: "CustomerData",
                column: "SocialStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteComplaint_CreatedUserId",
                table: "FavoriteComplaint",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteComplaint_DeletedUserId",
                table: "FavoriteComplaint",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteComplaint_LastModifiedUserId",
                table: "FavoriteComplaint",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteDiagnosis_CreatedUserId",
                table: "FavoriteDiagnosis",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteDiagnosis_DeletedUserId",
                table: "FavoriteDiagnosis",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteDiagnosis_LastModifiedUserId",
                table: "FavoriteDiagnosis",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteExamination_CreatedUserId",
                table: "FavoriteExamination",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteExamination_DeletedUserId",
                table: "FavoriteExamination",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteExamination_LastModifiedUserId",
                table: "FavoriteExamination",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoritePharmacy_CreatedUserId",
                table: "FavoritePharmacy",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoritePharmacy_DeletedUserId",
                table: "FavoritePharmacy",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoritePharmacy_LastModifiedUserId",
                table: "FavoritePharmacy",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_HrSocialStatus_CreatedUserId",
                table: "HrSocialStatus",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_HrSocialStatus_DeletedUserId",
                table: "HrSocialStatus",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_HrSocialStatus_LastModifiedUserId",
                table: "HrSocialStatus",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalInsurance_ClientId",
                table: "MedicalInsurance",
                column: "ClientId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MedicalInsurance_CreatedUserId",
                table: "MedicalInsurance",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalInsurance_DeletedUserId",
                table: "MedicalInsurance",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalInsurance_LastModifiedUserId",
                table: "MedicalInsurance",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_NationalAddress_CityId",
                table: "NationalAddress",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_NationalAddress_ClientId",
                table: "NationalAddress",
                column: "ClientId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NationalAddress_CreatedUserId",
                table: "NationalAddress",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_NationalAddress_DeletedUserId",
                table: "NationalAddress",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_NationalAddress_LastModifiedUserId",
                table: "NationalAddress",
                column: "LastModifiedUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FavoriteComplaint");

            migrationBuilder.DropTable(
                name: "FavoriteDiagnosis");

            migrationBuilder.DropTable(
                name: "FavoriteExamination");

            migrationBuilder.DropTable(
                name: "FavoritePharmacy");

            migrationBuilder.DropTable(
                name: "MedicalInsurance");

            migrationBuilder.DropTable(
                name: "NationalAddress");

            migrationBuilder.DropTable(
                name: "CustomerData");

            migrationBuilder.DropTable(
                name: "HrSocialStatus");

            migrationBuilder.AlterColumn<string>(
                name: "SubComplaintPhotoPath",
                table: "SubComplaint",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ComplaintImagePath",
                table: "Complaint",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "63998b7d-6724-49a6-8488-0798f13726d5",
                column: "ConcurrencyStamp",
                value: "fe18d078-f0b1-44f7-bdb4-7b573409f157");

            migrationBuilder.UpdateData(
                table: "AspNetUserDefBranch",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6906), new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6907) });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "5e46158f-44e1-4e78-8101-8a4617d5daba",
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6696), new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6697) });

            migrationBuilder.UpdateData(
                table: "DefBranch",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6891), new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6891) });

            migrationBuilder.UpdateData(
                table: "DefCompany",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6874), new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6870) });

            migrationBuilder.UpdateData(
                table: "DefCountry",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6945), new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6946) });

            migrationBuilder.UpdateData(
                table: "DefCurrency",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6935), new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6935) });

            migrationBuilder.UpdateData(
                table: "DefReligion",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreationDate", "LastModifiedDate" },
                values: new object[] { new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6957), new DateTime(2022, 9, 16, 17, 38, 45, 680, DateTimeKind.Local).AddTicks(6957) });
        }
    }
}
