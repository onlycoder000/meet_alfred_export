


function export_init(){
    var btn=document.querySelector('.onc_export_alfredo');
    btn.innerHTML='Exporting.....';
    btn.setAttribute('data-export_init','1');
    btn.setAttribute('data-has_error','0');
    btn.setAttribute('data-url',false);
    btn.setAttribute('data-export_permission','1');
    btn.setAttribute('data-single_page','0');
   
    (function() {
        var origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if(url.includes('https://api.meetalfred.com/api/v1/campaigns/activity') && btn.getAttribute('data-export_permission')==='1'){
                btn.setAttribute('data-export_permission','0');
                btn.setAttribute('data-url',url);
                btn.setAttribute('data-token',getCookie('token'));
                export_prepare();
            }

        this._url = url;
        return origOpen.apply(this, arguments);
        };
    })();
    
    document.querySelector('.MuiTablePagination-actions button[title="Go to next page"]').click();
    
}



function export_init_single(){
  alert('Waiting for your xhr event. Please make a refilter.');
  var btn=document.querySelector('.onc_export_alfredo');
  btn.innerHTML='Exporting.....';
  btn.setAttribute('data-export_init','1');
  btn.setAttribute('data-has_error','0');
  btn.setAttribute('data-url',false);
  btn.setAttribute('data-export_permission','1');
  btn.setAttribute('data-single_page','1');
 
  (function() {
      var origOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url) {
          if(url.includes('https://api.meetalfred.com/api/v1/campaigns/activity') && btn.getAttribute('data-export_permission')==='1'){
              btn.setAttribute('data-export_permission','0');
              btn.setAttribute('data-url',url);
              btn.setAttribute('data-token',getCookie('token'));
              export_prepare();
          }

      this._url = url;
      return origOpen.apply(this, arguments);
      };
  })();
  
  // document.querySelector('.MuiTablePagination-actions button[title="Go to next page"]').click();
  
}







function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }



function export_prepare(){
    btn=document.querySelector('.onc_export_alfredo');
    url=btn.getAttribute('data-url');
    token=btn.getAttribute('data-token');
    single_page=btn.getAttribute('data-single_page');
    if(single_page==='1'){
      export_finalize(url,btn,token,100)
    }
    else{
      var t=setInterval(function () {
        if(document.querySelector('p.MuiTablePagination-displayedRows')){
            clearInterval(t);
            data_quantity=document.querySelector('p.MuiTablePagination-displayedRows').innerText.split('of')[1].replace(' ','').replace(',','');
            export_finalize(url,btn,token,data_quantity)
        }
       
      }, 100);
    }
    
}


function export_finalize(url,btn,token,data_quantity){
  url_obj=url.split('?')[1]
  url_obj_str='{"' + url_obj.replace(/&/g, '", "').replace(/=/g, '":"') + '"}',
  function(key, value) {
      return key === "" ? value : decodeURIComponent(value)
  };
  url_obj_str=JSON.parse(url_obj_str)
  url_obj_str.page=1;
  url_obj_str.perPage=data_quantity;

  url_obj_query=''
  c=0;
  Object.keys(url_obj_str).forEach(element => {
      if(!c==0){
          url_obj_query+='&'
      }
      c++;
      url_obj_query+=element+'='+url_obj_str[element]
  });
  url=url.split('?')[0]+'?'+url_obj_query;
  try{
    fetch(url, {
        "headers": {
            "authorization": "Bearer "+token,
        }
    }) 
    .then(response => response.json())
    .then(response => {
      x=response
      r=['"id","campaignName","campaignId","campaignStatus","createdAt","description","message","name","email","currentEmployer","currentTitle","location","linkedIn","phone","updatedAt"']
      Object.keys(x.actions).forEach(function(key) { 
          row=(x.actions[key]);
          
          try{row.id}catch(e){row['id']=false;}
          try{row.campaignName}catch(e){row['campaignName']=false;}
          try{row.campaignId}catch(e){row['campaignId']=false;}
          try{row.campaignStatus}catch(e){row['campaignStatus']=false;}
          try{row.createdAt}catch(e){row['createdAt']=false;}
          try{row.description}catch(e){row['description']=false;}
          try{row.message}catch(e){row['message']=false;}

          try{
            row_builder=[row.id,row.campaignName,row.campaignId,row.campaignStatus,row.createdAt,row.description,row.message,row.person.name,row.person.email,row.person.currentEmployer,row.person.currentTitle,row.person.location,'https://www.linkedin.com/in/'+row.person.linkedInHandle,row.person.phone,row.person.updatedAt];
          }
          catch(e){
            console.log(key)
          }

          // row_builder=[row.id,row.campaignName,row.campaignId,row.campaignStatus,row.createdAt,row.description,row.message,row.person.name,row.person.email,row.person.currentEmployer,row.person.currentTitle,row.person.location,'https://www.linkedin.com/in/'+row.person.linkedInHandle,row.person.phone,row.person.updatedAt];
          row_builder_string='"'
          row_builder.forEach((j)=>{ j=j+'';row_builder_string+=''+j.replace(/"/gi,"'")+'","';});
          r.push(row_builder_string+'"');
      })
      d=r.join('\n');
      var element = document.createElement('a'); 
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(d));
      element.setAttribute('download', document.querySelector('html title').innerText+'.csv');
      element.click();
      element.remove();
      document.querySelector('.onc_export_alfredo').innerHTML='Export Table';
    });
  }
  catch(e){
    console.log('#Error',e);
    alert('There Was a Error In Exporting , Please Notify Joy(only.coder000@gmail.com) about it . ')
    document.querySelector('.onc_export_alfredo').innerHTML='Export Table';
  }
}







/*
fetch("https://api.meetalfred.com/api/v1/campaigns/activity?page=3&perPage=10&sortField=date&sortOrder=DESC", 
      {
  "headers": {
    "authorization": "",
  }
}) .then(response => response.json())
            .then(response => {
                x=response
                r=['"id","campaignName","campaignId","campaignStatus","createdAt","description","message","name","email","currentEmployer","currentTitle","location","linkedIn","phone","updatedAt"']
                Object.keys(x.actions).forEach(function(key) { 
                    row=(x.actions[key]);
                    row_builder=[row.id,row.campaignName,row.campaignId,row.campaignStatus,row.createdAt,row.description,row.message,row.person.name,row.person.email,row.person.currentEmployer,row.person.currentTitle,row.person.location,'https://www.linkedin.com/in/'+row.person.linkedInHandle,row.person.phone,row.person.updatedAt];
                    row_builder_string='"'
                    row_builder.forEach((j)=>{ j=j+'';row_builder_string+=''+j.replace(/"/gi,"'")+'","';});
                    r.push(row_builder_string+'"');
                })
                d=r.join('\n');
                var element = document.createElement('a'); 
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(d));
                element.setAttribute('download', document.querySelector('html title').innerText+'.csv');
                element.click();
                element.remove()
            });;
            */
