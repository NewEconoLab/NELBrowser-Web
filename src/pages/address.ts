namespace WebBrowser
{
    export class Address implements Page
    {
        close(): void
        {
            throw new Error( "Method not implemented." );
        }
        div: HTMLDivElement = document.getElementById( "address-info" ) as HTMLDivElement;
        start()
        {
            this.div.hidden = true;
            this.div.innerHTML = pages.addres;
        }
    }
}