var $=function(s){return document.querySelector(s)};
var brl=function(n){return n.toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0})};
var carSvg=function(c){return '<svg viewBox="0 0 200 90" role="img" aria-label="Ilustração do carro"><path d="M12 62c0-8 4-12 12-14l28-6 22-20c3-3 7-4 11-4h42c6 0 11 2 15 6l18 18 20 4c8 2 12 6 12 14v8c0 3-2 5-5 5h-10a22 22 0 0 0-44 0H72a22 22 0 0 0-44 0H17c-3 0-5-2-5-5z" fill="'+c+'" stroke="rgba(0,0,0,.35)" stroke-width="2"/><path d="M76 24l-16 17h44V20H86c-4 0-8 1-10 4zm34-4v21h44l-14-16c-3-3-6-5-10-5z" fill="rgba(180,210,235,.75)"/><g fill="#1a1a1a"><circle cx="50" cy="74" r="17"/><circle cx="152" cy="74" r="17"/></g><g fill="#c8cdd2"><circle cx="50" cy="74" r="8"/><circle cx="152" cy="74" r="8"/></g></svg>'};
var marcas=[...new Set(CARS.map(function(c){return c.marca}))].sort();
marcas.forEach(function(m){$("#marca").insertAdjacentHTML("beforeend","<option>"+m+"</option>")});

function render(){
  var q=$("#q").value.toLowerCase(),m=$("#marca").value,max=+$("#preco").value,o=$("#ord").value;
  $("#pv").textContent=brl(max);
  var l=CARS.filter(function(c){return (c.marca+" "+c.modelo).toLowerCase().includes(q)&&(!m||c.marca===m)&&c.preco<=max});
  l.sort(function(a,b){return o==="p1"?a.preco-b.preco:o==="p2"?b.preco-a.preco:o==="a"?b.ano-a.ano:a.km-b.km});
  $("#count").textContent=l.length?l.length+" veículo(s) encontrado(s)":"Nenhum veículo encontrado. Aumente o preço máximo ou limpe a busca.";
  $("#grid").innerHTML=l.map(function(c){return '<button class="card" data-id="'+c.id+'"><div class="pic">'+carSvg(c.cor)+'</div><div class="info"><small>'+c.marca+'</small><h3>'+c.modelo+'</h3><small>'+c.ano+' · '+c.km.toLocaleString("pt-BR")+' km · '+c.cambio+'</small><span class="plate">'+brl(c.preco)+'</span></div></button>'}).join("");
}
["#q","#marca","#preco","#ord"].forEach(function(s){$(s).addEventListener("input",render)});

$("#grid").addEventListener("click",function(e){
  var b=e.target.closest(".card");if(!b)return;
  var c=CARS.find(function(x){return x.id==b.dataset.id});
  var msg=encodeURIComponent("Olá! Tenho interesse no "+c.marca+" "+c.modelo+" "+c.ano+" ("+brl(c.preco)+").");
  $("#dbody").innerHTML='<div class="pic" style="border-radius:8px">'+carSvg(c.cor)+'</div><h2>'+c.marca+' '+c.modelo+'</h2><div class="plate">'+brl(c.preco)+'</div>'
  +'<ul class="specs"><li><b>Ano</b>'+c.ano+'</li><li><b>Quilometragem</b>'+c.km.toLocaleString("pt-BR")+' km</li><li><b>Combustível</b>'+c.comb+'</li><li><b>Câmbio</b>'+c.cambio+'</li><li><b>Placa</b>'+c.placa+'</li><li><b>Garantia</b>90 dias</li></ul>'
  +'<div class="sim"><label for="ent">Entrada: <b id="ev"></b></label><input id="ent" type="range" min="0" max="'+Math.round(c.preco*0.8/1000)*1000+'" step="1000" value="'+Math.round(c.preco*0.3/1000)*1000+'"><p style="margin:8px 0 0">48x de <span class="parc" id="par"></span><br><small style="color:var(--muted)">Simulação com juros de 1,8% ao mês. Valores sujeitos à aprovação de crédito.</small></p></div>'
  +'<div class="btns"><a class="btn p" target="_blank" rel="noopener" href="https://wa.me/5531999999999?text='+msg+'">Chamar no WhatsApp</a><button class="btn s" id="fechar">Fechar</button></div>';
  var calc=function(){var en=+$("#ent").value,i=0.018,n=48,v=c.preco-en;$("#ev").textContent=brl(en);$("#par").textContent=brl(v*i/(1-Math.pow(1+i,-n)))};
  $("#ent").addEventListener("input",calc);calc();
  $("#fechar").onclick=function(){$("#dlg").close()};
  $("#dlg").showModal();
});
$("#dlg").addEventListener("click",function(e){if(e.target===this)this.close()});
render();