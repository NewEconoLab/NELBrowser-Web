

namespace WebBrowser
{
    export class locationtool
    {

        static getNetWork(): string
        {
            var hash = window.location.hash;
            let arr = hash.split("/");
            return arr[0].replace("#", "");
        }
        static getUrl(): string
        {
            var href = window.location.href;            
            let arr = href.split( "#" );
            var hash = window.location.hash;
            let hasharr = hash.split( "/" );
            return arr[0] + hasharr[0];
        }
        static getPage(): string
        {
            var page = location.hash;
            var arr = page.split( '/' );
            if ( arr.length == 1 && ( arr[0] == "#mainnet" || arr[0] =="#testnet" ) )
                page = 'explorer';
            else
                page = arr[1];
            return page;
        }
        static getParam(): string
        {
            var page = location.hash;
            var arr = page.split( '/' );
            return arr[2];
        }

    }
}