

namespace WebBrowser
{
    export class locationtool
    {

        static getNetWork(): string
        {
            var hash = window.location.hash;
            var arr = hash.split("/");
            return arr[0].replace("#", "");
        }
    }
}