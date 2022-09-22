using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Medical_Optics.Infrastructure.Migrations
{
    public partial class InitialProject : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    NameAr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Image = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SurName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsDeveloper = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AuthenticationTickets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    LastActivity = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Expires = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuthenticationTickets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AuthenticationTickets_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DefCompany",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyNameAr = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CompanyNameEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CompanyAddress = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Phone1 = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Phone2 = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Phone3 = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Fax = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PostCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Website = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LogoUrl = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FinancialYearStart = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FinancialYearEnd = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CommercialRegister = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Location = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    TaxCard = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
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
                    table.PrimaryKey("PK_DefCompany", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DefCompany_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefCompany_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefCompany_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DefCountry",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CountryCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CountryNameAr = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CountryNameEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CapitalNameAr = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CapitalNameEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
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
                    table.PrimaryKey("PK_DefCountry", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DefCountry_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefCountry_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefCountry_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DefDocumentTypes",
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
                    table.PrimaryKey("PK_DefDocumentTypes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DefDocumentTypes_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefDocumentTypes_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefDocumentTypes_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DefReligion",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReligionCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ReligionNameAr = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ReligionNameEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
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
                    table.PrimaryKey("PK_DefReligion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DefReligion_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefReligion_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefReligion_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DefCity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CityCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CityNameAr = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CityNameEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    GovernorateNameAr = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    GovernorateNameEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DefCountryId = table.Column<int>(type: "int", maxLength: 1000, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                    table.PrimaryKey("PK_DefCity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DefCity_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefCity_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefCity_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefCity_DefCountry_DefCountryId",
                        column: x => x.DefCountryId,
                        principalTable: "DefCountry",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DefBranch",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BranchCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    BranchNameAr = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    BranchNameEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DefCompanyId = table.Column<int>(type: "int", nullable: false),
                    BranchAddress = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Phone1 = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Phone2 = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Phone3 = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Fax = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Fax2 = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Fax3 = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PostCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    LogoUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DefCountryId = table.Column<int>(type: "int", nullable: true),
                    DefCityId = table.Column<int>(type: "int", nullable: true),
                    CommercialRegister = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TaxCard = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Website = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
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
                    table.PrimaryKey("PK_DefBranch", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DefBranch_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefBranch_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefBranch_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefBranch_DefCity_DefCityId",
                        column: x => x.DefCityId,
                        principalTable: "DefCity",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefBranch_DefCompany_DefCompanyId",
                        column: x => x.DefCompanyId,
                        principalTable: "DefCompany",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DefBranch_DefCountry_DefCountryId",
                        column: x => x.DefCountryId,
                        principalTable: "DefCountry",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserDefBranch",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DefBranchId = table.Column<int>(type: "int", nullable: false),
                    AspNetUserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
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
                    table.PrimaryKey("PK_AspNetUserDefBranch", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserDefBranch_AspNetUsers_AspNetUserId",
                        column: x => x.AspNetUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserDefBranch_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AspNetUserDefBranch_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AspNetUserDefBranch_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AspNetUserDefBranch_DefBranch_DefBranchId",
                        column: x => x.DefBranchId,
                        principalTable: "DefBranch",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DefBranchId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_DefBranch_DefBranchId",
                        column: x => x.DefBranchId,
                        principalTable: "DefBranch",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DefCurrency",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CurrencyNameAr = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CurrencyNameEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    AbbreviationAr = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    AbbreviationEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsPimary = table.Column<bool>(type: "bit", nullable: false),
                    DefaultFactor = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    DefBranchId = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_DefCurrency", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DefCurrency_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefCurrency_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefCurrency_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefCurrency_DefBranch_DefBranchId",
                        column: x => x.DefBranchId,
                        principalTable: "DefBranch",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DefNationality",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NationalityCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    NationalityNameAr = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NationalityNameEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    DefBranchId = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_DefNationality", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DefNationality_AspNetUsers_CreatedUserId",
                        column: x => x.CreatedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefNationality_AspNetUsers_DeletedUserId",
                        column: x => x.DeletedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefNationality_AspNetUsers_LastModifiedUserId",
                        column: x => x.LastModifiedUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DefNationality_DefBranch_DefBranchId",
                        column: x => x.DefBranchId,
                        principalTable: "DefBranch",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NameAr", "NormalizedName", "Order" },
                values: new object[] { "63998b7d-6724-49a6-8488-0798f13726d5", "25412697-424a-47c2-b9f5-564376791d6f", "Developer", "مبرمج", "DEVELOPER", 0 });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "CreationDate", "Email", "EmailConfirmed", "FullName", "Image", "IsDeleted", "IsDeveloper", "LastModifiedDate", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "Password", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "SurName", "TwoFactorEnabled", "UserName" },
                values: new object[] { "5e46158f-44e1-4e78-8101-8a4617d5daba", 0, "b795837e-ee8a-41ac-aed4-3fea2f771308", new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6227), null, false, "ERP Developer", "profile-icon.jpg", false, true, new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6227), true, null, null, "DEVELOPER", "123456", "AQAAAAEAACcQAAAAEHaohoeqzEiX/FGJWJ4i64MQ6gJjBAQ1ywiJKpFTlBacjNpMMDJCYRjyZcDfdeS57Q==", null, false, "THFLQTJYXMDTPEPOVONPR6R2WZBOCJMA", "Developer", false, "Developer" });

            migrationBuilder.InsertData(
                table: "DefCompany",
                columns: new[] { "Id", "CommercialRegister", "CompanyAddress", "CompanyNameAr", "CompanyNameEn", "CreatedUserId", "CreationDate", "DeletedUserId", "Email", "Fax", "FinancialYearEnd", "FinancialYearStart", "IsActive", "IsDeleted", "IsSystem", "LastModifiedDate", "LastModifiedUserId", "Location", "LogoUrl", "Notes", "Phone1", "Phone2", "Phone3", "PostCode", "TaxCard", "Website" },
                values: new object[] { 1, "123456", "المملكة العربية السعودية", "الشركة", "Company", "5e46158f-44e1-4e78-8101-8a4617d5daba", new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6395), null, "test@example.com", "123456", new DateTime(2022, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2022, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), false, false, false, new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6390), null, "Riadh", "//test.jpg", "No", "01204789654", "01204789654", "01204789654", "1234", "1234", "www.Ansari.Com" });

            migrationBuilder.InsertData(
                table: "DefCountry",
                columns: new[] { "Id", "CapitalNameAr", "CapitalNameEn", "CountryCode", "CountryNameAr", "CountryNameEn", "CreatedUserId", "CreationDate", "DeletedUserId", "Description", "IsActive", "IsDeleted", "IsSystem", "LastModifiedDate", "LastModifiedUserId" },
                values: new object[] { 1, "سعودي", "Saudian", "1", "السعودية", "KSA", "5e46158f-44e1-4e78-8101-8a4617d5daba", new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6489), null, "NO", true, false, false, new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6489), null });

            migrationBuilder.InsertData(
                table: "DefCurrency",
                columns: new[] { "Id", "AbbreviationAr", "AbbreviationEn", "Code", "CreatedUserId", "CreationDate", "CurrencyNameAr", "CurrencyNameEn", "DefBranchId", "DefaultFactor", "DeletedUserId", "IsActive", "IsDeleted", "IsPimary", "IsSystem", "LastModifiedDate", "LastModifiedUserId", "Notes" },
                values: new object[] { 1, "", "", "1", "5e46158f-44e1-4e78-8101-8a4617d5daba", new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6478), "العملة الافتراضية", "Default Currency", null, 1m, null, true, false, true, false, new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6479), null, null });

            migrationBuilder.InsertData(
                table: "DefReligion",
                columns: new[] { "Id", "CreatedUserId", "CreationDate", "DeletedUserId", "Description", "IsActive", "IsDeleted", "IsSystem", "LastModifiedDate", "LastModifiedUserId", "ReligionCode", "ReligionNameAr", "ReligionNameEn" },
                values: new object[] { 1, "5e46158f-44e1-4e78-8101-8a4617d5daba", new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6500), null, "", true, false, false, new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6501), null, "1", "مسلم", "Mulslim" });

            migrationBuilder.InsertData(
                table: "DefBranch",
                columns: new[] { "Id", "BranchAddress", "BranchCode", "BranchNameAr", "BranchNameEn", "CommercialRegister", "CreatedUserId", "CreationDate", "DefCityId", "DefCompanyId", "DefCountryId", "DeletedUserId", "Email", "Fax", "Fax2", "Fax3", "IsActive", "IsDeleted", "IsSystem", "LastModifiedDate", "LastModifiedUserId", "LogoUrl", "Notes", "Phone1", "Phone2", "Phone3", "PostCode", "TaxCard", "Website" },
                values: new object[] { 1, "عنوان الفرع", "1", "الفرع الرئيسي", "Main Branch", "123456", "5e46158f-44e1-4e78-8101-8a4617d5daba", new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6429), null, 1, null, null, "test@example.com", "123456", "123456", "123456", true, false, false, new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6429), null, "//test.jpg", "No", "01204789654", "01204789654", "01204789654", "1234", "1234", "www.Ansari.Com" });

            migrationBuilder.InsertData(
                table: "AspNetUserDefBranch",
                columns: new[] { "Id", "AspNetUserId", "CreatedUserId", "CreationDate", "DefBranchId", "DeletedUserId", "IsActive", "IsDeleted", "IsSystem", "LastModifiedDate", "LastModifiedUserId" },
                values: new object[] { 1, "5e46158f-44e1-4e78-8101-8a4617d5daba", "5e46158f-44e1-4e78-8101-8a4617d5daba", new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6448), 1, null, true, false, false, new DateTime(2022, 9, 15, 21, 48, 34, 199, DateTimeKind.Local).AddTicks(6448), null });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId", "DefBranchId" },
                values: new object[] { "63998b7d-6724-49a6-8488-0798f13726d5", "5e46158f-44e1-4e78-8101-8a4617d5daba", 1 });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserDefBranch_AspNetUserId",
                table: "AspNetUserDefBranch",
                column: "AspNetUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserDefBranch_CreatedUserId",
                table: "AspNetUserDefBranch",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserDefBranch_DefBranchId",
                table: "AspNetUserDefBranch",
                column: "DefBranchId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserDefBranch_DeletedUserId",
                table: "AspNetUserDefBranch",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserDefBranch_LastModifiedUserId",
                table: "AspNetUserDefBranch",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_DefBranchId",
                table: "AspNetUserRoles",
                column: "DefBranchId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AuthenticationTickets_UserId",
                table: "AuthenticationTickets",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefBranch_CreatedUserId",
                table: "DefBranch",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefBranch_DefCityId",
                table: "DefBranch",
                column: "DefCityId");

            migrationBuilder.CreateIndex(
                name: "IX_DefBranch_DefCompanyId",
                table: "DefBranch",
                column: "DefCompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_DefBranch_DefCountryId",
                table: "DefBranch",
                column: "DefCountryId");

            migrationBuilder.CreateIndex(
                name: "IX_DefBranch_DeletedUserId",
                table: "DefBranch",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefBranch_LastModifiedUserId",
                table: "DefBranch",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefCity_CreatedUserId",
                table: "DefCity",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefCity_DefCountryId",
                table: "DefCity",
                column: "DefCountryId");

            migrationBuilder.CreateIndex(
                name: "IX_DefCity_DeletedUserId",
                table: "DefCity",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefCity_LastModifiedUserId",
                table: "DefCity",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefCompany_CreatedUserId",
                table: "DefCompany",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefCompany_DeletedUserId",
                table: "DefCompany",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefCompany_LastModifiedUserId",
                table: "DefCompany",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefCountry_CreatedUserId",
                table: "DefCountry",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefCountry_DeletedUserId",
                table: "DefCountry",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefCountry_LastModifiedUserId",
                table: "DefCountry",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefCurrency_CreatedUserId",
                table: "DefCurrency",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefCurrency_DefBranchId",
                table: "DefCurrency",
                column: "DefBranchId");

            migrationBuilder.CreateIndex(
                name: "IX_DefCurrency_DeletedUserId",
                table: "DefCurrency",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefCurrency_LastModifiedUserId",
                table: "DefCurrency",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefDocumentTypes_CreatedUserId",
                table: "DefDocumentTypes",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefDocumentTypes_DeletedUserId",
                table: "DefDocumentTypes",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefDocumentTypes_LastModifiedUserId",
                table: "DefDocumentTypes",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefNationality_CreatedUserId",
                table: "DefNationality",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefNationality_DefBranchId",
                table: "DefNationality",
                column: "DefBranchId");

            migrationBuilder.CreateIndex(
                name: "IX_DefNationality_DeletedUserId",
                table: "DefNationality",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefNationality_LastModifiedUserId",
                table: "DefNationality",
                column: "LastModifiedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefReligion_CreatedUserId",
                table: "DefReligion",
                column: "CreatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefReligion_DeletedUserId",
                table: "DefReligion",
                column: "DeletedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DefReligion_LastModifiedUserId",
                table: "DefReligion",
                column: "LastModifiedUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserDefBranch");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "AuthenticationTickets");

            migrationBuilder.DropTable(
                name: "DefCurrency");

            migrationBuilder.DropTable(
                name: "DefDocumentTypes");

            migrationBuilder.DropTable(
                name: "DefNationality");

            migrationBuilder.DropTable(
                name: "DefReligion");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "DefBranch");

            migrationBuilder.DropTable(
                name: "DefCity");

            migrationBuilder.DropTable(
                name: "DefCompany");

            migrationBuilder.DropTable(
                name: "DefCountry");

            migrationBuilder.DropTable(
                name: "AspNetUsers");
        }
    }
}
