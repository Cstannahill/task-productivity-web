﻿using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Sabio.Data;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Core.Services;
using Services;
using System;

namespace Sabio.Web.StartUp
{
    public class DependencyInjection
    {
        public static void ConfigureServices(IServiceCollection services, IConfiguration configuration)
        {
            if (configuration is IConfigurationRoot)
            {
                services.AddSingleton<IConfigurationRoot>(configuration as IConfigurationRoot);   // IConfigurationRoot
            }

            services.AddSingleton<IConfiguration>(configuration);   // IConfiguration explicitly

            string connString = configuration.GetConnectionString("Default");
            // https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-2.2
            // The are a number of differe Add* methods you can use. Please verify which one you
            // should be using services.AddScoped<IMyDependency, MyDependency>();

            // services.AddTransient<IOperationTransient, Operation>();

            // services.AddScoped<IOperationScoped, Operation>();

            // services.AddSingleton<IOperationSingleton, Operation>();

            services.AddSingleton<IAuthenticationService<int>, WebAuthenticationService>();

            services.AddSingleton<Sabio.Data.Providers.IDataProvider, SqlDataProvider>(delegate (IServiceProvider provider)
            {
                return new SqlDataProvider(connString);
            }
            );

            services.AddSingleton<IIdentityProvider<int>, WebAuthenticationService>();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            // Do NOT REMOVE this line below.
            // Edits to the IUserService are OK 


            services.AddSingleton<IAddressService, AddressService>();

            services.AddSingleton<IApplicationService, ApplicationService>();

            services.AddSingleton<IAppointmentService, AppointmentService>();

            services.AddSingleton<ICourseService, CourseService>();

            services.AddSingleton<IEventService, EventService>();

            services.AddSingleton<IFriendService, FriendService>();

            services.AddSingleton<IJobService, JobService>();

            services.AddSingleton<IMusicService, MusicService>();

            services.AddSingleton<ITaskService, TaskService>();

            services.AddSingleton<ITechCompanyService, TechCompanyService>();

            services.AddSingleton<IUserService, UserService>();

            services.AddSingleton<IUserServiceV1, UserServiceV1>();





        }

        public static void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
        }
    }
}