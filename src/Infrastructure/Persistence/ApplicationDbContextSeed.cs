using ERP.DAL.Domains;
using ERP.DAL.Domains.Authentication;
using Medical_Optics.Domain.ValueObjects;
using Medical_Optics.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace Medical_Optics.Infrastructure.Persistence;

public static class ApplicationDbContextSeed
{
    public static async Task SeedDefaultUserAsync(UserManager<AspNetUser> userManager, RoleManager<ApplicationRole> roleManager)
    {
        //var administratorRole = new IdentityRole("Administrator");

        //if (roleManager.Roles.All(r => r.Name != administratorRole.Name))
        //{
        //    await roleManager.CreateAsync(administratorRole);
        //}

        //var administrator = new AspNetUser { UserName = "administrator@localhost", Email = "administrator@localhost" };

        //if (userManager.Users.All(u => u.UserName != administrator.UserName))
        //{
        //    await userManager.CreateAsync(administrator, "Administrator1!");
        //    await userManager.AddToRolesAsync(administrator, new[] { administratorRole.Name });
        //}
    }

    public static async Task SeedSampleDataAsync(ApplicationDbContext context)
    {
        // Seed, if necessary
    }
}
