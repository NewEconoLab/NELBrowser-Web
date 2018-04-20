/// <reference path="./block.ts" />
/// <reference path="./address.ts" />
/// <reference path="./transaction.ts" />
namespace WebBrowser.pages
{
    export var block: string = `
    <div class="title"><span>Block Information</span></div>
    <div class="list-nel">
      <div class="list-head">
          <div class="line"><div class="title-nel"><span>Block </span></div></div>
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
                <th>Version</th>
            </tr>
        </thead>
        <tbody id="txs"></tbody>
    </table>
    `;
    export var transaction: string = `
    <div class="title"><span>Transaction Information</span></div>
    <div class="list-nel">
      <div class="list-head">
          <div class="line"><div class="title-nel"><span>Transaction </span></div></div>
      </div>
      <div class="list-body">
          <div class="line"><div class="title-nel"><span>TXID</span></div> <div class="content-nel"><span id="txid"></span></div></div>
          <div class="line"><div class="title-nel"><span>Type</span></div> <div class="content-nel"><span id="type"></span></div></div>
          <div class="line"><div class="title-nel"><span>Network Fee</span></div><div class="content-nel"><span id="netfee"></span></div></div>
          <div class="line"><div class="title-nel"><span>System Fee</span></div><div class="content-nel"><span id="sysfee"></span></div></div>
          <div class="line"><div class="title-nel"><span>Size</span></div><div class="content-nel"><span id="txsize"></span></div></div>
          <div class="line"><div class="title-nel"><span>Included in Block</span></div><div class="content-nel"><span id="blockindex"></span></div></div>
      </div>
    </div>
    <div style="padding-top:25px">
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
    export var addres: string = `
    <div class="container">
        <div class="container-box">
            <div class="title">
                <span>Address info</span>
                <div class="go-back" id="goalladress"></div>
            </div>
        
            <div class="list-nel">
                <div class="list-head">
                    <div class="line">
                    
                    </div>
                </div>
                <div class="list-body" id="address-info">
                    <div class="line">
                        <div class="title-nel"><span>Address</span></div> 
                        <div class="content-nel"><span id="address"></span></div>
                    </div>
                    <div class="line">
                        <div class="title-nel"><span>Created</span></div> 
                        <div class="content-nel"><span id="created"></span></div>
                    </div>
                    <div class="line">
                        <div class="title-nel"><span>Transactions</span></div> 
                        <div class="content-nel"><span id="totalTran"></span></div>
                    </div>
                </div>
            </div>

            <div class="title"><span>Balance</span></div>
            <div class="list-nel">
                <div class="list-head">
                    <div class="line">
                    
                    </div>
                </div>
                <div class="list-body" id="balance">
                    <div class="line">
                    </div>
                </div>
            </div>

            <div class="title"><span>Transactions</span></div>
            <div class="list-nel">
	            <div class="list-head">
		            <div class="line">
			            <div class="title-content"><span>TXID</span></div>
			            <div class="title-content"><span>Type</span></div>
			            <div class="title-content"><span>Time</span></div>
			            <div class="title-nel" style="width:60px;"></div>
		            </div>
	            </div>
	            <div class="list-body" id="addr-trans">
	            </div>
            </div>
            <div class="page-number">
                <span id="trans-page-msg"></span>
            </div>
            <div class="page" id="addr-trans-page">
                <div id="trans-previous" class="page-previous">
                    <img src="./img/lefttrangle.svg" alt="">
                </div>
                <div style="width:1px;"></div>
                <div id="trans-next" class="page-next">
                    <img src="./img/righttrangle.svg" alt="">
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
                <tbody id="add-utxos"></tbody>
            </table>
            <div class="page-number">
                <span id="utxo-page-msg"></span>
            </div>
            <div class="page" id="addr-utxo-page">
                <div id="utxo-previous" class="page-previous">
                    <img src="./img/lefttrangle.svg" alt="">
                </div>
                <div style="width:1px;"></div>
                <div id="utxo-next" class="page-next">
                    <img src="./img/righttrangle.svg" alt="">
                </div>
            </div>
        <div>
    </div>
    `;
    export var asset: string = `
    <div class="title"><span>Asset Information</span></div>
    <div class="list-nel">
      <div class="list-head">
          <div class="line"><div class="title-nel"><span>Asset information</span></div></div>
      </div>
      <div class="list-body">
          <div class="line"><div class="title-nel"><span>Asset</span></div> <div class="content-nel"><span id="name"></span></div></div>
          <div class="line"><div class="title-nel"><span>Type</span></div> <div class="content-nel"><span id="type"></span></div></div>
          <div class="line"><div class="title-nel"><span>ID</span></div> <div class="content-nel"><span id="id"></span></div></div>
          <div class="line"><div class="title-nel"><span>Available</span></div><div class="content-nel"><span id="available"></span></div></div>
          <div class="line"><div class="title-nel"><span>Precision</span></div><div class="content-nel"><span id="precision"></span></div></div>
          <div class="line"><div class="title-nel"><span>Admin</span></div><div class="content-nel"><span id="admin"></span></div></div>
      </div>
    </div>
    `;

}