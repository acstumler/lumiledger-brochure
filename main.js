(function(){
  var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();

  function toCells(line){
    var out=[], cur='', q=false;
    for(var i=0;i<line.length;i++){
      var ch=line[i];
      if(ch==='\"'){ q=!q; continue; }
      if(ch===',' && !q){ out.push(cur); cur=''; continue; }
      cur+=ch;
    }
    out.push(cur);
    return out;
  }

  var rows=[];
  function loadCsv(){
    fetch('/data/comparison.csv',{cache:'no-store'})
      .then(function(r){return r.text();})
      .then(function(txt){
        var lines=txt.split('\n').filter(function(l){return l.trim().length>0;});
        var header=toCells(lines[0]);
        rows=[];
        for(var i=1;i<lines.length;i++) rows.push(toCells(lines[i]));
        renderTable(rows);
        renderCards(header, rows);
      })
      .catch(function(){});
  }

  function renderTable(data){
    var body=document.getElementById('matrixBody'); if(!body) return;
    body.innerHTML='';
    for(var i=0;i<data.length;i++){
      var tr=document.createElement('tr');
      for(var j=0;j<data[i].length;j++){
        var td=document.createElement('td');
        td.textContent=data[i][j];
        tr.appendChild(td);
      }
      body.appendChild(tr);
    }
  }

  function renderCards(header, data){
    var wrap=document.getElementById('cards'); if(!wrap) return;
    wrap.innerHTML='';
    for(var i=0;i<data.length;i++){
      var r=data[i];
      var card=document.createElement('div');
      card.className='card';
      var title=document.createElement('div');
      title.className='p';
      title.textContent=r[0];
      var list=document.createElement('ul');
      var items=[
        header[1]+': '+r[1],
        header[2]+': '+r[2],
        header[3]+': '+r[3],
        header[4]+': '+r[4],
        header[5]+': '+r[5]
      ];
      for(var k=0;k<items.length;k++){
        var li=document.createElement('li');
        li.textContent=items[k];
        list.appendChild(li);
      }
      card.appendChild(title);
      card.appendChild(list);
      wrap.appendChild(card);
    }
  }

  function downloadCsv(){
    fetch('/data/comparison.csv',{cache:'no-store'})
      .then(function(res){return res.blob();})
      .then(function(blob){
        var url=URL.createObjectURL(blob);
        var a=document.createElement('a');
        a.href=url; a.download='lumiledger-comparison.csv';
        document.body.appendChild(a); a.click();
        setTimeout(function(){URL.revokeObjectURL(url);document.body.removeChild(a);},0);
      });
  }

  function sortByProduct(){
    var c=rows.slice();
    c.sort(function(a,b){
      var A=a[0].toLowerCase(), B=b[0].toLowerCase();
      if(A<B) return -1; if(A>B) return 1; return 0;
    });
    renderTable(c);
    renderCards(['Product','Automation','Vendor memory','Two-sided GL','Lender-ready export','Notes'], c);
  }

  function filterRows(q){
    var query=(q||'').toLowerCase();
    if(!query){ renderTable(rows); renderCards(['Product','Automation','Vendor memory','Two-sided GL','Lender-ready export','Notes'], rows); return; }
    var f=rows.filter(function(r){
      for(var i=0;i<r.length;i++){ if((r[i]||'').toLowerCase().indexOf(query)!==-1) return true; }
      return false;
    });
    renderTable(f);
    renderCards(['Product','Automation','Vendor memory','Two-sided GL','Lender-ready export','Notes'], f);
  }

  var filter=document.getElementById('filterInput');
  if(filter) filter.addEventListener('input',function(e){filterRows(e.target.value);});
  var sortBtn=document.getElementById('sortProduct');
  if(sortBtn) sortBtn.addEventListener('click',sortByProduct);
  var dl=document.getElementById('downloadCsv');
  if(dl) dl.addEventListener('click',downloadCsv);

  loadCsv();
})();
