using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Medical_Optics.Application.Common.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Medical_Optics.Infrastructure.Services;
public class FileHandler : IFileHandler
{
    private readonly IWebHostEnvironment _hostingEnvironment;

    public FileHandler(IWebHostEnvironment hostingEnvironment)
    {
        _hostingEnvironment = hostingEnvironment;
    }
    public string UploadFile(string uploadFolder, IFormFile file, string customName = null, string oldName = null)
    {
        var fileName = string.Empty;
        try
        {
            var mainFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "images");
            var subFolderPath = Path.Combine(mainFolderPath, uploadFolder);

            if (!Directory.Exists(subFolderPath))
                Directory.CreateDirectory(subFolderPath);
            fileName = !string.IsNullOrWhiteSpace(customName) ? customName + file.FileName.Substring(file.FileName.LastIndexOf('.')) : file.FileName;

            if (oldName != null)
            {
                var oLdPhysicalFilePath = Path.Combine(subFolderPath, oldName);
                if (File.Exists(oLdPhysicalFilePath))
                    File.Delete(oLdPhysicalFilePath);
            }

            if (customName == null)
            {
                string guid = Guid.NewGuid().ToString();
                fileName = guid.Substring(guid.Length - 8) + "_" + fileName;
            }


            var physicalFilePath = Path.Combine(subFolderPath, fileName);
            if (File.Exists(physicalFilePath))
                File.Delete(physicalFilePath);
            using (FileStream fs = System.IO.File.Create(physicalFilePath))
            {
                file.CopyTo(fs);
                fs.Flush();
            }
            return fileName;
        }
        catch (Exception exception)
        {

            return fileName;
        }
    }
}
