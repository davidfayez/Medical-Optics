using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Globalization;
using System.Text;

namespace Medical_Optics.Infrastructure.Common;

public static class ExtensionMethods
{
    #region GetNullableValues

    public static short GetValue(this short? parameter)
    {
        return (short)(parameter.HasValue ? parameter.Value : 0);
    }

    public static int GetValue(this int? parameter)
    {
        return parameter.HasValue ? parameter.Value : 0;
    }

    public static decimal GetValue(this decimal? parameter)
    {
        return parameter.HasValue ? parameter.Value : 0;
    }
    public static decimal GetValue(this decimal parameter)
    {
        return parameter != null ? parameter : 0;
    }
    public static string GetValue(this DateTime? parameter)
    {
        if (parameter.HasValue)
        {
            if (parameter.Value.Year == DateTime.MaxValue.Year)
            {
                return string.Empty;
            }
            else
            {
                return parameter.Value.ToShortDateString();
            }
        }
        else
        {
            return string.Empty;
        }
    }

    #endregion GetNullableValues

    #region Get differnt data formats from Strings

    public static DateTime TryParseToDate(this string data)
    {
        DateTime parsedDate;
        var currentCulture = CultureInfo.CreateSpecificCulture("en-GB");

        if (DateTime.TryParse(data.Trim(), currentCulture, DateTimeStyles.None, out parsedDate))
        {
            return parsedDate;
        }
        return DateTime.MaxValue;
    }

    public static int TryParseToInt(this string data)
    {
        int parsedInt;
        if (int.TryParse(data.Trim(), out parsedInt))
            return parsedInt;
        return 0;
    }

    public static short TryParseToShort(this string data)
    {
        if (data != null)
        {
            short parsedShort;
            if (short.TryParse(data.Trim(), out parsedShort))
                return parsedShort;
        }
        return 0;
    }

    public static float TryParseToFloat(this string data)
    {
        float parsedFloat;
        if (float.TryParse(data.Trim(), out parsedFloat))
            return parsedFloat;
        return 0;
    }

    public static decimal TryParseToDecimal(this string data)
    {
        decimal parsedDecimal;
        if (decimal.TryParse(!string.IsNullOrEmpty(data) ? data.Trim() : "0", out parsedDecimal))
            return parsedDecimal;
        return 0;
    }

    public static double TryParseToDouble(this string data)
    {
        double parsedDouble;
        if (double.TryParse(data.Trim(), out parsedDouble))
            return parsedDouble;
        return 0;
    }

    public static TimeSpan TryParseToTimeSpan(this string data)
    {
        TimeSpan parsedTimeSpan;
        if (TimeSpan.TryParse(data.Trim(), out parsedTimeSpan))
            return parsedTimeSpan;
        return TimeSpan.MinValue;
    }


    #endregion Get differnt data formats from Strings


    #region Other

    public static bool Includes(this string mainString, string substring)
    {
        bool result = mainString.IndexOf(substring, StringComparison.InvariantCultureIgnoreCase) >= 0;
        return result;
    }

    public static bool CompareString(this string firstString, string secondString)
    {
        return string.Equals(firstString, secondString, StringComparison.InvariantCultureIgnoreCase);
    }

    public static DataTable ConvertToDataTable<T>(this IList<T> list)
    {
        DataTable table = CreateTable<T>();
        Type entityType = typeof(T);
        PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(entityType);

        foreach (T item in list)
        {
            DataRow row = table.NewRow();

            foreach (PropertyDescriptor prop in properties)
            {
                row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
            }
            table.Rows.Add(row);
        }
        return table;
    }

    private static DataTable CreateTable<T>()
    {
        Type entityType = typeof(T);
        DataTable table = new DataTable(entityType.Name);
        PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(entityType);

        foreach (PropertyDescriptor prop in properties)
        {
            // HERE IS WHERE THE ERROR IS THROWN FOR NULLABLE TYPES
            table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(
            prop.PropertyType) ?? prop.PropertyType);
        }

        return table;
    }
    #endregion Other

    #region Casting Different DataTypes

    public static bool TryParseToBoolean(this short data)
    {
        return Convert.ToBoolean(data);
    }

    public static bool TryParseToBoolean(this decimal data)
    {
        return Convert.ToBoolean(data);
    }
    #endregion
}
