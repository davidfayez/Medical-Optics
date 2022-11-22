using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Medical_Optics.Application.Common.Enums;
public enum PayType
{
    Cash=1,
    Credit
}

public enum IDType
{
    Iqama=1,
    Hawia,
    Passport
}

public enum DiagnoseType
{
    Principal = 1,
    Secondary
}

public enum Gender
{
    Male = 1,
    Female,
}

public enum Side
{
    None = 1,
    Right,
    Left,
    Bilateral,
}

