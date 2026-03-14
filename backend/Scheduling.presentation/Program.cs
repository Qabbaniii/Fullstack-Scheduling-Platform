
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scheduling.Application.Interfaces;
using Scheduling.Application.Interfaces.Repositories;
using Scheduling.Application.Interfaces.Services;
using Scheduling.Application.Services;
using Scheduling.Infrastructure.AuthServices;
using Scheduling.Infrastructure.Contexts;
using Scheduling.Infrastructure.Repositories;
using Scheduling.Presentation.Middleware;
using System.Text;
namespace Scheduling.presentation
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            // Add Repo to the container.
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
            builder.Services.AddScoped<IAvailabilityRepository, AvailabilityRepository>();
            builder.Services.AddScoped<IBookingRepository, BookingRepository>();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            // Add services to the container.
            builder.Services.AddHttpContextAccessor();

            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<ITokenService,JwtTokenService>();
            builder.Services.AddScoped<IPasswordHasher,PasswordHasher>();
            builder.Services.AddScoped<ICurrentUserService,CurrentUserService>();
            builder.Services.AddScoped<ServiceManagementService>();
            builder.Services.AddScoped<AvailabilityService>();
            builder.Services.AddScoped<BookingService>();

            builder.Services.AddDbContext<AppDbContext>(
            options =>
                {       
                    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
                });
            builder.Services.AddControllers();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy
                        .WithOrigins("http://localhost:5174", "https://localhost:5174")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            #region JWT auth
            var jwtSection = builder.Configuration.GetSection("Jwt");
            var secret = jwtSection["Secret"]!;
            var issuer = jwtSection["Issuer"]!;
            var audience = jwtSection["Audience"]!;

            builder.Services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = issuer,

                        ValidateAudience = true,
                        ValidAudience = audience,

                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),

                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();
            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireProvider", policy => policy.RequireRole("Provider"));
                options.AddPolicy("RequireCustomer", policy => policy.RequireRole("Customer"));
            }); 
            #endregion

            var app = builder.Build();

            // Configure the HTTP request pipeline.

    
                app.UseSwagger();
                app.UseSwaggerUI();


            app.UseHttpsRedirection();
            app.UseCors("AllowFrontend");
            app.UseGlobalExceptionHandling();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
