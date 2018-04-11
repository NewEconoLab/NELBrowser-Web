/// <reference path="../app.ts"/>
/// <reference path="../Entitys.ts"/>
namespace WebBrowser
{
    export class Route
    {
        app: App;
        pagelist: Page[] = new Array<Page>();
        start( app: App )
        {
            var hash = location.hash;
            if ( hash == "" )
            {
                window.location.hash = "#mainnet";
                return;
            }
            let arr = hash.split( '/' );
            if ( arr[0] == '#mainnet' )
                app.netWork.changeNetWork( 'mainnet' );
            if ( arr[0] == "#testnet" )
                app.netWork.changeNetWork( 'testnet' );

            this.app = app;
            this.pagelist.push( app.indexpage );
            this.pagelist.push( app.blocks );
            this.pagelist.push( app.transactions );
            this.pagelist.push( app.addresses );
            this.pagelist.push( app.assets );

            this.closePages();
            var page = this.render();
            page.start();
        }

        render(): Page
        {
            switch ( locationtool.getPage() )
            {
                case "explorer":
                    this.app.navbar.indexBtn.classList.add( "active" );
                    return this.app.indexpage;
                case "blocks":
                    this.app.navbar.blockBtn.classList.add( "active" );
                    return this.app.blocks;
                case "transactions":
                    this.app.navbar.txlistBtn.classList.add( "active" );
                    return this.app.transactions;
                case "addresses":
                    this.app.navbar.addrsBtn.classList.add( "active" );
                    return this.app.addresses;
                case "assets":
                    this.app.navbar.assetBtn.classList.add( "active" );
                    return this.app.assets;
            }
            
        }

        closePages()
        {
             let i: number = 0;
            while ( i < this.pagelist.length )
            {
                this.pagelist[i].close();
                i++;
                this.app.navbar.indexBtn.classList.remove( "active" );
                this.app.navbar.blockBtn.classList.remove( "active" );
                this.app.navbar.txlistBtn.classList.remove( "active" );
                this.app.navbar.addrsBtn.classList.remove( "active" );
                this.app.navbar.assetBtn.classList.remove( "active" );
            }
        }
    }
}