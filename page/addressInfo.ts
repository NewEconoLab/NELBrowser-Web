namespace WebBrowser.page
{
    export var addressInfo:HTMLDivElement = document.createElement("div");
    addressInfo.innerHTML=
    `
    <div class="title"><span>Address info</span></div>
    <h4 class="cool" id="address"></h4>
    <div id="balance" class="row">
    </div>
    <div class="row">
        <div class="col-md-6">
            <div class="panel panel-default" style="height:100%">
                <div class="panel-heading">
                    <h3 class="panel-title">Nep5 asset query </h3>
                </div>
                <div class="panel-body">
                    <div class="input-group">
                        <input type="text" name="query-nep5" id="nep5-text" class="form-control" aria-label="Amount (to the nearest dollar)">
                        <span class="input-group-addon btn" id="nep5-btn"><span class="glyphicon glyphicon-search"></span></span>
                    </div>
                </div>
                <ul id="nep5balance" class="list-group"></ul>
            </div>
        </div>
        <div class="col-md-6" hidden id="nep5assets">
            <div class="panel panel-default" style="height:100%">
                <div class="panel-heading">
                    <h3 class="panel-title">Nep5 Asset List</h3>
                </div>
                <ul id="nep5AssetList" class="list-group"></ul>
            </div>
        </div>
    </div>
    <div class="title">
        <span>UTXO</span>
    </div>
    <table class="table table-nel cool">
        <thead>
            <tr>
                <th>asset</th>
                <th>number</th>
                <th>txid</th>
            </tr>
        </thead>
        <tbody id="utxos"></tbody>
    </table>
    `
}