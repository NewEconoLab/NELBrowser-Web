/// <reference path="./blockInfo.ts" />
/// <reference path="./addressInfo.ts" />
/// <reference path="./txInfo.ts" />
namespace WebBrowser.pages
{
    export var block: string = `
    <div class="title"><span>Block Information</span></div>
    <div class="list-nel">
      <div class="list-head">
          <div class="line"><div class="title-nel"><span>Block 1723980</span></div></div>
      </div>
      <div class="list-body">
          <div class="line"><div class="title-nel"><span>Hash</span></div> <div class="content-nel"><span id="hash"></span></div></div>
          <div class="line"><div class="title-nel"><span>Index</span></div> <div class="content-nel"><span id="index"></span></div></div>
          <div class="line"><div class="title-nel"><span>Time</span></div> <div class="content-nel"><span id="time"></span></div></div>
          <div class="line"><div class="title-nel"><span>Size</span></div><div class="content-nel"><span id="size"></span></div></div>
          <div class="line"><div class="title-nel"><span>Previous Block</span></div><div class="content-nel"></div><span></span></div>
          <div class="line"><div class="title-nel"><span>Next Block</span></div><div class="content-nel"></div><span></span></div>
      </div>
    </div>
    <div class="title">
        <span>Transactions</span>
    </div>
    <table class="table table-nel cool">
        <thead>
            <tr>
                <th>TXID</th>
                <th>Type</th>
                <th>Size</th>
                <th>Vesion</th>
            </tr>
        </thead>
        <tbody id="txs"></tbody>
    </table>
    `;
    export var transaction: string =
        `
    <div class="title"><span>Transaction Information</span></div>
    <div class="list-nel">
      <div class="list-head">
          <div class="line"><div class="title-nel"><span>Block 1723980</span></div></div>
      </div>
      <div class="list-body">
          <div class="line"><div class="title-nel"><span>TXID</span></div> <div class="content-nel"><span id="hash"></span></div></div>
          <div class="line"><div class="title-nel"><span>Type</span></div> <div class="content-nel"><span id="txInfo"></span></div></div>
          <div class="line"><div class="title-nel"><span>Time</span></div> <div class="content-nel"><span id="time"></span></div></div>
          <div class="line"><div class="title-nel"><span>Network Fee</span></div><div class="content-nel"><span>0</span></div></div>
          <div class="line"><div class="title-nel"><span>System Fee</span></div><div class="content-nel"></div><span>0</span></div>
          <div class="line"><div class="title-nel"><span>Size</span></div><div class="content-nel"></div><span id="size"></span></div>
          <div class="line"><div class="title-nel"><span>Included in Block</span></div><div class="content-nel"></div><span id="index"></span></div>
      </div>
    </div>
    <div class="container">
      <div class="row">
         <div class="col-md-6">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">
                      输入
                    </h3>
                </div>
                <ul id="from" class="list-group">
                </ul>
            </div> 
          </div>
          <div class="col-md-6">
             <div class="panel panel-default" style="height:100%">
                <div class="panel-heading">
                    <h3 class="panel-title">
                      输出
                    </h3>
                </div>
                <ul id="to" class="list-group">
                </ul>
             </div> 
           </div>
      </div>
   </div>
    ` ;
    export var addres: string =
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
    `;
}