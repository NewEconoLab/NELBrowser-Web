namespace WebBrowser.page
{
    export var txInfo:HTMLDivElement = document.createElement("div");
    txInfo.innerHTML=
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
    ` 
}