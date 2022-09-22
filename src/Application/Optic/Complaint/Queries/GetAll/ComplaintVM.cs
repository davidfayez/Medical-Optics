﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Medical_Optics.Application.Common.Mappings;
using Medical_Optics.Application.Optic.Complaint.Commands.Add;
using DB = Medical_Optics.Domain.Entities.Optic;

namespace Medical_Optics.Application.Optic.Complaint.Queries.GetAll;
public class ComplaintVM: IMapFrom<DB.Complaint>
{
    public void Mapping(Profile profile)
    {
        profile.CreateMap<ComplaintVM, DB.Complaint>()
               .ReverseMap();
    }

    public int Id { get; set; }
    public string ComplaintCode { get; set; }
    public string ComplaintNameAr { get; set; }
    public string ComplaintNameEn { get; set; }
    public string ComplaintImagePath { get; set; } // صورة الشكوى 
    public string Description { get; set; }
}
