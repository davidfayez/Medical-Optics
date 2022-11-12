using System.Collections.Generic;
using System.Reflection;
using AutoMapper;
using MediatR;
using Medical_Optics.Application.Common.Enums;
using Medical_Optics.Application.Common.Interfaces;
using Medical_Optics.Application.Common.Resources;
using Medical_Optics.Application.Def.City.Queries.GetAll;
using Medical_Optics.Application.Def.Nationality.Queries.GetAll;
using Medical_Optics.Application.HR.SocialStatus.Queries.GetAll;
using Medical_Optics.Application.Optic.Complaint.Commands.Create;
using Medical_Optics.Application.Optic.Complaint.Commands.Update;
using Medical_Optics.Application.Optic.Complaint.Queries.GetAll;
using Medical_Optics.Application.Optic.Complaint.Queries.GetById;
using Medical_Optics.Application.Optic.CustomerData.Commands.Create;
using Medical_Optics.Application.Optic.CustomerData.Commands.ViewModels;
using Medical_Optics.Application.Optic.CustomerData.Queries.GetAll;
using Medical_Optics.Application.Optic.CustomerData.Queries.GetById;
using Medical_Optics.Application.Optic.DefReligion.Queries.GetAll;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Medical_Optics.WebUI.Controllers;
public class CustomerDataController : BaseController
{
    private readonly IMapper _mapper;
    private readonly IFileHandler _fileHandler;

    public CustomerDataController(IMapper mapper, IFileHandler fileHandler)
    {
        _mapper = mapper;
        _fileHandler = fileHandler;
    }

    public async Task<IActionResult> IndexAsync()
    {
        var PatientsFiles = await Mediator.Send(new GetAllPatientsFilesQuery());
        return View(PatientsFiles);
    }

    [HttpGet]
    public async Task<IActionResult> CreateAsync()
    {
        var command = new CreateCustomerDataCommand();
        await FillCustomerDataDDLAsync(command);
        return View(command);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync(CreateCustomerDataCommand command/*, IFormCollection form*/)
    {
        if (ModelState.IsValid)
        {
            #region is National Address Not Null
            var isNationalAddressNotNull = command.NationalAddressVM.GetType()
                                                  .GetProperties() //get all properties on object
                                                  .Select(pi => pi.GetValue(command.NationalAddressVM)) //get value for the property
                                                  .Any(value => value != null); // Check if one of the values is not null, if so it returns true.

            if (!isNationalAddressNotNull)
                command.NationalAddressVM = null;
            #endregion

            #region is Medical Insurance Not Null
            var isMedicalInsuranceNotNull = command.MedicalInsuranceVM.GetType()
                 .GetProperties() //get all properties on object
                 .Select(pi => pi.GetValue(command.MedicalInsuranceVM)) //get value for the property
                 .Any(value => value != null); // Check if one of the values is not null, if so it returns true.
            
            if(!isMedicalInsuranceNotNull)
                command.MedicalInsuranceVM = null;
            #endregion

            string? MedicalImagePath = null;
            var CustomerImagePath = (command.CustomerDataVM.CustomerImage != null) ? command.CustomerDataVM.CustomerMRN 
                                  + command.CustomerDataVM.CustomerImage.FileName.Substring(command.CustomerDataVM.CustomerImage.FileName.LastIndexOf('.')) : null;
            
            if(command.CustomerDataVM.Id == 0 || (command.CustomerDataVM.Id > 0 && CustomerImagePath != null))
                command.CustomerDataVM.ImageUrl = CustomerImagePath;

            if (command.MedicalInsuranceVM != null)
            {
                MedicalImagePath = (command.MedicalInsuranceVM.CardImage != null) ? command.CustomerDataVM.CustomerMRN
                                  + command.MedicalInsuranceVM.CardImage.FileName.Substring(command.MedicalInsuranceVM.CardImage.FileName.LastIndexOf('.')) : null;
                
                if (command.MedicalInsuranceVM.Id == 0 || (command.MedicalInsuranceVM.Id > 0 && MedicalImagePath != null))
                    command.MedicalInsuranceVM.CardImageUrl = MedicalImagePath;

            }
            
            var isSuccess = await Mediator.Send(command);
            if (isSuccess)
            {
                if (CustomerImagePath != null)
                    _fileHandler.UploadFile("CustomerData", command.CustomerDataVM.CustomerImage, command.CustomerDataVM.CustomerMRN);

                if (MedicalImagePath != null)
                    _fileHandler.UploadFile("MedicalInsurance", command.MedicalInsuranceVM.CardImage, command.CustomerDataVM.CustomerMRN);


                return RedirectToAction("Index");
            }
        }
        await FillCustomerDataDDLAsync(command);
        return View(command);

    }

    [HttpGet]
    public async Task<IActionResult> EditAsync(int id)
    {
        if (id > 0)
        {
            var command = await Mediator.Send(new GetCustomerDataByIdQuery
            {
                Id = id,
            });

            if (command != null)
            {
                await FillCustomerDataDDLAsync(command);
                return RedirectToAction("Create", command);
            }
        }

        return RedirectToAction("Create",new CreateCustomerDataCommand());
    }

    public async Task<JsonResult> GetAllPatientsFiles(string customerMRN, string iDNumber, string clientName)
    {
        var PatientsFiles = await Mediator.Send(new GetAllPatientsFilesQuery
        {
            ClientName = clientName,
            CustomerMRN = customerMRN,
            IDNumber = iDNumber,
        });
        return Json(PatientsFiles);
    }

    public async Task<IActionResult> GetAllPatientsFilesByFilter(GetAllPatientsFilesQuery query)
    {
        var model = await Mediator.Send(query);
        return PartialView("_PatientsFilesList", model);
    }




    private async Task FillCustomerDataDDLAsync(CreateCustomerDataCommand command)
    {
        command.CustomerDataVM.Nationalities.Add(new SelectListItem { Text = Global.SelectOne, Value = "" });
        var Nationalities = await Mediator.Send(new GetAllNationalityQuery());
        command.CustomerDataVM.Nationalities.AddRange(Nationalities.Select(a => new SelectListItem { Text = a.NationalityNameAr, Value = a.Id.ToString() }));

        command.CustomerDataVM.Religiones.Add(new SelectListItem { Text = Global.SelectOne, Value = "" });
        var Religiones = await Mediator.Send(new GetAllDefReligionQuery());
        command.CustomerDataVM.Religiones.AddRange(Religiones.Select(a => new SelectListItem { Text = a.ReligionNameAr, Value = a.Id.ToString() }));

        command.CustomerDataVM.SocialStatuses.Add(new SelectListItem { Text = Global.SelectOne, Value = "" });
        var SocialStatus = await Mediator.Send(new GetAllSocialStatusQuery());
        command.CustomerDataVM.SocialStatuses.AddRange(SocialStatus.Select(a => new SelectListItem { Text = a.TypeNameAr, Value = a.Id.ToString() }));

        command.CustomerDataVM.IDTypes.Add(new SelectListItem { Text = Global.SelectOne, Value = "" });
        command.CustomerDataVM.IDTypes.Add(new SelectListItem { Text = nameof(IDType.Iqama), Value = ((int)IDType.Iqama).ToString() });
        command.CustomerDataVM.IDTypes.Add(new SelectListItem { Text = nameof(IDType.Hawia), Value = ((int)IDType.Hawia).ToString() });
        command.CustomerDataVM.IDTypes.Add(new SelectListItem { Text = nameof(IDType.Passport), Value = ((int)IDType.Passport).ToString() });


        //command.NationalAddressVM.Cities.Add(new SelectListItem { Text = Global.SelectOne, Value = "0" });
        //var Cities = await Mediator.Send(new GetAllCitiesQuery());
        //command.NationalAddressVM.Cities.AddRange(Cities.Select(a => new SelectListItem { Text = a.CityNameAr, Value = a.Id.ToString() }));

    }
}
