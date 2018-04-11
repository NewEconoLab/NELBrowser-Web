/// <reference path="../app.ts"/>
/// <reference path="../Entitys.ts"/>
namespace WebBrowser
{
    export class Route
    {
        app: App;
        start( app: App )
        {
            this.app = app;
        }

        render():Page
        {
            switch ( this.currentRoute )
            {
                case "#export":
                    this.app.indexpage.div.hidden = false;
                case "#blocks":
                    Login;
                case "#transactions":
                    this.app.transaction.div.hidden = false;
                case "#addresses":
                    NNS;
                case "#settings":
                    Settings;
            }
            return notFound;
        }

        closePages()
        {
            this.app.indexpage.div.hidden = true;
            this.app.assetinfo.div.hidden = true;
            this.app.address.div.hidden = true;
            this.app.indexpage.div.hidden = true;
        }
    }
}