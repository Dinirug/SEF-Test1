using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<AppDbContext>>();

            try
            {
                // Ensure database is created
                await context.Database.EnsureCreatedAsync();

                // Seed Hardcoded Admin User
                var adminEmail = "admin@gmail.com";
                var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == adminEmail);

                if (adminUser == null)
                {
                    adminUser = new User
                    {
                        FullName = "System Administrator",
                        Email = adminEmail,
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                        Role = "Admin",
                        CreatedAt = DateTime.UtcNow
                    };
                    context.Users.Add(adminUser);
                    await context.SaveChangesAsync();
                    logger.LogInformation("Hardcoded Admin account seeded successfully (Admin@gmail.com).");
                }

                // Seed Initial Demo Generic Items if table is empty
                if (!await context.GenericItems.AnyAsync())
                {
                    var sampleItems = new List<GenericItem>
                    {
                        // Management items
                        new GenericItem
                        {
                            Category = "management",
                            Title = "Core System Settings",
                            Description = "Global configuration parameters for the hackathon application core.",
                            Status = "Active",
                            Amount = 100.00m,
                            CreatedBy = "Admin",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new GenericItem
                        {
                            Category = "management",
                            Title = "User Permission Roles",
                            Description = "Access controls for Admin and standard User roles.",
                            Status = "Active",
                            Amount = 50.00m,
                            CreatedBy = "Admin",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        // Records items
                        new GenericItem
                        {
                            Category = "records",
                            Title = "Primary Audit Log #101",
                            Description = "Initial audit trace record generated during database setup.",
                            Status = "Completed",
                            Amount = 250.50m,
                            CreatedBy = "Admin",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new GenericItem
                        {
                            Category = "records",
                            Title = "Data Synchronization Entry",
                            Description = "Record tracking API endpoint sync and EF Core persistence.",
                            Status = "Active",
                            Amount = 175.00m,
                            CreatedBy = "Admin",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        // Transactions items
                        new GenericItem
                        {
                            Category = "transactions",
                            Title = "Initial Infrastructure Provisioning",
                            Description = "Railway backend and Vercel frontend deployment resource allocation.",
                            Status = "Completed",
                            Amount = 1200.00m,
                            CreatedBy = "Admin",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new GenericItem
                        {
                            Category = "transactions",
                            Title = "JWT Token Key Renewal",
                            Description = "Automated token security key validation transaction.",
                            Status = "Pending",
                            Amount = 450.00m,
                            CreatedBy = "Admin",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        // Reports items
                        new GenericItem
                        {
                            Category = "reports",
                            Title = "Q3 Hackathon Performance Summary",
                            Description = "Analytical breakdown of system usage, response times, and API metrics.",
                            Status = "Active",
                            Amount = 3500.00m,
                            CreatedBy = "Admin",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        },
                        new GenericItem
                        {
                            Category = "reports",
                            Title = "User Activity & Retention Overview",
                            Description = "Comprehensive statistical analysis of registered platform users.",
                            Status = "Completed",
                            Amount = 890.00m,
                            CreatedBy = "Admin",
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        }
                    };

                    await context.GenericItems.AddRangeAsync(sampleItems);
                    await context.SaveChangesAsync();
                    logger.LogInformation("Sample generic items seeded successfully across all 4 categories.");
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding the database.");
            }
        }
    }
}
