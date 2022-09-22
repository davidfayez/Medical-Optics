using Medical_Optics.Application;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Infrastructure;
using Medical_Optics.Infrastructure.Persistence;
using Medical_Optics.WebUI.Filters;
using Medical_Optics.WebUI.Services;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using NSwag;
using NSwag.Generation.Processors.Security;
using System.Globalization;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Localization.Routing;
using System.Reflection;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Medical_Optics.WebUI;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddAuthentication().AddCookie(config =>
         {
             config.Cookie.HttpOnly = true;
             //options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
             config.Cookie.SameSite = SameSiteMode.Lax;
             config.Cookie.Name = CookieAuthenticationDefaults.AuthenticationScheme;
             config.LoginPath = "/Account/Login";
         });
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        services.AddInfrastructure(Configuration);
        services.AddApplication();


        services.AddDatabaseDeveloperPageExceptionFilter();

        services.AddSingleton<ICurrentUserService, CurrentUserService>();

        services.AddHttpContextAccessor();

        //services.AddAuthentication(x =>
        // {
        //     x.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        //     x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        // })
        //.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
        //.AddCookie(IdentityConstants.ApplicationScheme);

        //services.AddHealthChecks()
        //    .AddDbContextCheck<ApplicationDbContext>();

        //services.AddControllersWithViews(options =>
        //    options.Filters.Add<ApiExceptionFilterAttribute>())
        //        .AddFluentValidation(x => x.AutomaticValidationEnabled = false);

        services.AddControllersWithViews()
                .AddFluentValidation();

        services.AddRazorPages();

        // Customise default API behaviour
        //services.Configure<ApiBehaviorOptions>(options => 
        //    options.SuppressModelStateInvalidFilter = true);

        // In production, the Angular files will be served from this directory
        //services.AddSpaStaticFiles(configuration => 
        //    configuration.RootPath = "ClientApp/dist");

        //services.AddOpenApiDocument(configure =>
        //{
        //    configure.Title = "Medical_Optics API";
        //    configure.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
        //    {
        //        Type = OpenApiSecuritySchemeType.ApiKey,
        //        Name = "Authorization",
        //        In = OpenApiSecurityApiKeyLocation.Header,
        //        Description = "Type into the textbox: Bearer {your JWT token}."
        //    });

        //    configure.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
        //});
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseMigrationsEndPoint();
        }
        else
        {
            app.UseExceptionHandler("/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }

        //app.UseHealthChecks("/health");
        app.UseHttpsRedirection();
        app.UseStaticFiles();

        //if (!env.IsDevelopment())
        //{
        //    app.UseSpaStaticFiles();
        //}

        //app.UseSwaggerUi3(settings =>
        //{
        //    settings.Path = "/api";
        //    settings.DocumentPath = "/api/specification.json";
        //});
        //app.UseHttpsRedirection();

        //app.UseFileServer(enableDirectoryBrowsing: true);
        app.UseRouting();

        app.UseAuthentication();
        //app.UseIdentityServer();
        app.UseAuthorization();

        #region Configure Multi Language

        var dateformat = new DateTimeFormatInfo
        {
            Calendar = new GregorianCalendar(GregorianCalendarTypes.Localized),
            ShortDatePattern = "dd/MM/yyyy",
            LongDatePattern = "dd/MM/yyyy"
        };


        IList<CultureInfo> supportedCultures = new List<CultureInfo>
            {
                     new CultureInfo("ar"){ DateTimeFormat = dateformat },
                     new CultureInfo("en-US"){ DateTimeFormat = dateformat },
            };
        var localizationOptions = new RequestLocalizationOptions
        {
            //DefaultRequestCulture = new RequestCulture(new CultureInfo("ar") { DateTimeFormat = dateformat }),
             DefaultRequestCulture = new RequestCulture("en", uiCulture: "en"),
            SupportedCultures = supportedCultures,
            SupportedUICultures = supportedCultures
        };
        // Find the cookie provider with LINQ
        var cookieProvider = localizationOptions.RequestCultureProviders
            .OfType<CookieRequestCultureProvider>()
            .First();
        // Set the new cookie name
        cookieProvider.CookieName = "AnsariERPLang";
        app.UseRequestLocalization(localizationOptions);

        #endregion

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
            endpoints.MapRazorPages();
        });

        //app.UseSpa(spa =>
        //{
        //        // To learn more about options for serving an Angular SPA from ASP.NET Core,
        //        // see https://go.microsoft.com/fwlink/?linkid=864501

        //        spa.Options.SourcePath = "ClientApp";

        //    if (env.IsDevelopment())
        //    {
        //            //spa.UseAngularCliServer(npmScript: "start");
        //            spa.UseProxyToSpaDevelopmentServer(Configuration["SpaBaseUrl"] ?? "http://localhost:4200");
        //    }
        //});
    }
}
