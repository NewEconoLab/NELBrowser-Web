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
          <div class="line"><div class="title-nel"><span>System Fee</span></div><div class="content-nel"><span>0</span></div></div>
          <div class="line"><div class="title-nel"><span>Size</span></div><div class="content-nel"><span id="size"></span></div></div>
          <div class="line"><div class="title-nel"><span>Included in Block</span></div><div class="content-nel"><span id="index"></span></div></div>
      </div>
    </div>
    <div class="container">
      <div class="row">
         <div class="col-md-6">
            <div class="list-nel">
              <div class="list-head">
                  <div class="line"><div class="title-nel"><span>Input</span></div></div>
              </div>
              <div class="list-body" id="from" >
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="list-nel">
              <div class="list-head">
                  <div class="line"><div class="title-nel"><span>Output</span></div></div>
              </div>
              <div class="list-body" id="to" >
              </div>
            </div>
           </div>
        </div>
    </div>
    ` ;
    export var addres: string =
        `
        <div class="container">
            <div class="title"><span>Address info</span></div>

            <div class="list-nel">
                <div class="list-head">
                    <div class="line"><div class="title-nel"><span id="address"></span></div></div>
                </div>
                <div class="list-body" id="balance">
                    <div class="line"><div class="title-nel"><span>Address</span></div> <div class="content-nel"><span id="hash"></span></div></div>
                </div>
            </div>

            <div class="title"><span>Nep5</span></div>
            <div class="input-group " id="nel-search">
                <input id="nep5-text" type="text" class="form-control nel" placeholder="TxHash/Addr/blockHeight">
                <span id="nep5-btn" class="input-group-addon nel ">
                    <img src="fonts/search.svg" width="18" height="18" />
                </span>
            </div>
            <div class="list-nel">
                <div class="list-head">
                    <div class="line"><div class="title-nel"><span></span></div></div>
                </div>
                <div class="list-body" id="nep5balance">
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