namespace Medical_Optics.Application.Common.Extensions
{
    public static class StringExtension
    {
        public static bool IsNullOrEmpty(this string str)
        {
            return str == null || str.Length == 0;
        }

        public static bool IsNotNullOrEmpty(this string str)
        {
            return str != null && str.Trim().Length > 0;
        }

        public static string StringFormat(this string str, params object[] args)
        {
            return string.Format(str, args);
        }
    }
}