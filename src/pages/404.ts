/// <reference path="../app.ts"/>
namespace WebBrowser
{
    export class Notfound implements Page
    {
        div: HTMLDivElement;
        btn: HTMLButtonElement;
        start(): void
        {
            this.btn = document.getElementById( "notfound" ) as HTMLButtonElement;
            this.btn.onclick = () =>
            {
                window.location.href = locationtool.getUrl();
            }
            $( ".notfound" ).show();
        }
        close(): void
        {
            $( '.notfound' ).hide();
        }
    }
}