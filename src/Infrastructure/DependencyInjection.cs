using ERP.DAL.Domains;
using ERP.DAL.Domains.Authentication;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Infrastructure.Identity;
using Medical_Optics.Infrastructure.Persistence;
using Medical_Optics.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Medical_Optics.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        if (configuration.GetValue<bool>("UseInMemoryDatabase"))
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase("Medical_OpticsDb"));
        }
        else
        {
            //services.AddDbContext<ApplicationDbContext>(options =>
            //    options.UseSqlServer(
            //        configuration.GetConnectionString("DefaultConnection"),
            //        b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

            //services.AddDbContext<ApplicationDbContext>(options =>
            //       options.UseSqlServer(
            //           configuration.GetConnectionString("DefaultConnection")));


            services.AddDbContext<ApplicationDbContext>(options =>
                   options.UseSqlServer(
                       configuration.GetConnectionString("DefaultConnection")));

        }

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        services.AddScoped<IDomainEventService, DomainEventService>();
        services.AddTransient<ICookieHandler, CookieHandler>();
        services.AddTransient<IFileHandler, FileHandler>();


        //services
        //    .AddDefaultIdentity<AspNetUser>()
        //    .AddRoles<ApplicationRole>()
        //    .AddEntityFrameworkStores<ApplicationDbContext>();

        services.AddIdentity<AspNetUser, ApplicationRole> () // </-- here you have to replace `IdenityUser` and `IdentityRole` with `ApplicationUser` and `ApplicationRole` respectively
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultUI()
            .AddDefaultTokenProviders();

        //services.AddDefaultIdentity<AspNetUser>(options =>
        //{
        //    options.SignIn.RequireConfirmedEmail = true;
        //    options.Password.RequireDigit = false;
        //    options.Password.RequireLowercase = false;
        //    options.Password.RequireUppercase = false;
        //    options.Password.RequireNonAlphanumeric = false;
        //    options.Password.RequiredLength = 6;
        //})
        //.AddRoles<AspNetRole>()
        //.AddEntityFrameworkStores<ApplicationDbContext>();


        services.ConfigureApplicationCookie(options =>
        {
            options.ExpireTimeSpan = TimeSpan.FromDays(6);
            options.SlidingExpiration = true;
        });

        //services.AddIdentityServer()
        //    .AddApiAuthorization<AspNetUser, ApplicationDbContext>();
        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.AddSession();
        services.AddTransient<IDateTime, DateTimeService>();
        services.AddTransient<IIdentityService, IdentityService>();

        //services.AddAuthentication()
        //    .AddIdentityServerJwt();

        services.AddAuthorization(options => 
            options.AddPolicy("CanPurge", policy => policy.RequireRole("Administrator")));

        return services;
    }
}
