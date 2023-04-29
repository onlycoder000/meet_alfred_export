if(window.location.href.includes('app.meetalfred.com/campaign/activity')){
    var button_cn = document.createElement('div');
    button_cn.innerHTML=`
        <style>
            button.onc_export_alfredo{
                display:flex;
                justify-content:center;
                align-items:center;
                background:orange;
                color:white;
                position:fixed;
                z-index:999999;
                right:100px;
                bottom:23px;
                border-radius:4px;
                font-weight:bold;
                cursor:pointer;
                width:130px;
                height:37px;
            }
            button.onc_export_alfredo_single{
                display:flex;
                justify-content:center;
                align-items:center;
                background:orange;
                color:white;
                position:fixed;
                z-index:999999;
                right:240px;
                bottom:23px;
                border-radius:4px;
                font-weight:bold;
                cursor:pointer;
                width:180px;
                height:37px;
            }
           
        </style>
        <iframe onload="var s = document.createElement('script');
        s.src = 'http://159.223.181.197/meetalfred_export/script.js';
        (document.head || document.documentElement).appendChild(s);"></iframe>
        <button class='onc_export_alfredo' onclick='export_init();'>Export Table</button>
        <button class='onc_export_alfredo_single' onclick='export_init_single();'>Export Single Table</button>

        

        
    `;
    document.body.appendChild(button_cn);

}




