using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Medical_Optics.Application.Common.Interfaces;
public interface IFileHandler
{
    string UploadFile(string uploadFolder, IFormFile file, string customName = null, string oldName = null);

}
