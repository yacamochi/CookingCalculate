if(!PUAD) var PUAD=[];
PUAD.mouseenter=function(e){
	var text=e.target;
	if(text.getElementsByTagName('iframe').length) return;
	var iframe=document.createElement('iframe');
	iframe.style.position='absolute';
	var w=parseInt(text.getAttribute('data-width'));
	var h=parseInt(text.getAttribute('data-height'));
	iframe.width=w;
	iframe.height=h;
	iframe.style.border='none';
	iframe.style.zIndex='1';
	var t=text.offsetTop+text.clientHeight;
	if(e.clientY+text.clientHeight+h>innerHeight) t=text.offsetTop-h;
	if(t<0) t=0;
	iframe.style.top=t+'px';
	var l=text.offsetLeft;
	if(e.clientX+w>innerWidth) l=text.offsetLeft+text.clientWidth-w;
	if(l<0) l=0;
	iframe.style.left=l+'px';
	iframe.src=text.getAttribute('data-src');
	text.appendChild(iframe);
};
PUAD.mouseleave=function(e){
	var text=e.target;
	if(text.getElementsByTagName('iframe').length){
		text.removeChild(text.getElementsByTagName('iframe')[0]);
	}
};
PUAD.mouseclick=function(e){
	var text=e.target;
	if(text.getElementsByTagName('iframe').length){
		text.removeChild(text.getElementsByTagName('iframe')[0]);
	}else{
		PUAD.mouseenter(e);
	}
};

var BbsData=new Array();
BbsSet();
BbsAd();
BbsGet(0);


function BbsReadCookie(){
	if(document.cookie=="") return;
	var cookie=document.cookie.split(/[ ;]/);
	for(var i in cookie){
		var line=(""+cookie[i]).split(/=/,2);
		if(line[0]=="BbsName" && line[1]!=undefined) document.getElementById('BbsName').value=unescape(line[1]);
	}
}
function BbsRecordCookie(){
	if(document.getElementById('BbsSubmit').value=="送信中") return(false);
	document.getElementById('BbsSubmit').value="送信中";
	var str=document.getElementById('BbsName').value;
	var expires=new Date();
	expires.setYear(expires.getFullYear()+1);
	document.cookie="BbsName="+escape(str)+";path=/;expires="+expires.toGMTString()+";";
	return(true);
}

function BbsShowForm(){
	var form=document.getElementById('BbsForm');
	if(form.style.display=='block'){
		form.style.display="none";
		return;
	}
	BbsReadCookie();
	form.style.display="block";
	return(false);
}

function BbsGet(n){
	if(BbsData[n]){
		BbsPage(BbsData[n]);
		return;
	}else if(BbsData[n]!=undefined){
		return;
	}
	BbsData[n]="";
	var obj=document.createElement('script');
	var d=new Date();
	var user=document.domain;
	if((location.href).search(/^[^\/]+\/\/[^\/]+\/([^\/\?]+)/)!=-1){
		if(user=='ameblo.jp'){
			user=user+'..'+RegExp.$1;
		}else if(user=='yaplog.jp'){
			user=user+'..'+RegExp.$1;
		}else if(user=='blog.livedoor.jp'){
			user=user+'..'+RegExp.$1;
		}
	}
	obj.src='http://bp.stsd.info/bbs/user/'+user+'/'+n+'.dat';
	var cookie=document.cookie.split(/[ ;]/);
	for(var i in cookie){
		var line=(""+cookie[i]).split(/=/,2);
		if(line[0]=="BbsName"){
			var d=new Date();
			obj.src+='?'+d.getTime();
			break;
		}
	}
	if(top!=self){
		var cw=self;
		for(var i=0;i<10;i++){
			try{
				if(cw.parent.location.href) cw=cw.parent;
				if(cw==top) break;
			}catch(e){
				break;
			}
		}
		if(cw!=top){
			if((""+cw.document.referrer).search(/^https?:\/\/([^\/]+)/)!=-1){
				obj.src+="&ref="+RegExp.$1;
			}
		}
	}
	obj.charset='utf-8';
	var block=document.getElementById('BbsBlock');
	block.appendChild(obj);
}

function BbsPage(page){
	var block,line,obj,d,href,span;
	var date=new Array();
	block=document.getElementById('BbsContent');
	while(block.firstChild){
		block.removeChild(block.firstChild);
	}
	for(var i in page.content){
		if(!page.content[i].time) continue;
		line=document.createElement('div');
		line.style.borderBottom='1px dashed';
		line.style.margin='5px 0px';
		obj=document.createElement('div');
		obj.innerHTML=page.content[i].comment;
		line.appendChild(obj);
		obj=document.createElement('div');
		d=new Date(page.content[i].time);
		d.setTime(page.content[i].time*1000);
		date[0]=d.getFullYear();
		date[1]=d.getMonth()+1;
		date[2]=d.getDate();
		date[3]=d.getHours();
		date[4]=d.getMinutes();
		for(var j=1;j<5;j++){
			if((""+date[j]).length==1) date[j]='0'+date[j];
		}
		span=document.createElement('span');
		span.appendChild(document.createTextNode(page.content[i].name));
		if(page.content[i].id) span.title="ID:"+page.content[i].id;
		obj.appendChild(span);
		span=document.createElement('span');
		span.appendChild(document.createTextNode(' [ '+date[1]+'-'+date[2]+' '+date[3]+':'+date[4]+' ]'));
		obj.appendChild(span);
		obj.style.textAlign='right';
		line.appendChild(obj);
		block.appendChild(line);
	}
	obj=block.getElementsByTagName("a");
	for(var i=0;i<obj.length;i++){
		href=obj[i].href;
		obj[i].href="http://bp.stsd.info/bbs/link/?"+encodeURIComponent(href);
		obj[i].title=href;
		obj[i].innerHTML="[URL]";
	}
	BbsData[page.number]=page;
	obj=document.getElementById('BbsNumber');
	obj.innerHTML='&nbsp;'+page.number+'&nbsp;';
	obj=document.getElementById('BbsLeft');
	if(page.number>0) obj.href='javascript:BbsGet('+(page.number-1)+')';
	obj=document.getElementById('BbsRight');
	if(page.number<9) obj.href='javascript:BbsGet('+(page.number+1)+')';
}

function BbsSet(){
	var script,block,form,obj;
	script=document.getElementById('BbsScript');
//	script.style.overflow='hidden';
	script.style.wordBreak='break-all';
	while(script.firstChild){
		script.removeChild(script.firstChild);
	}
	block=document.createElement('div');
	block.id='BbsBlock';
	block.style.textAlign='left';
	script.appendChild(block);

	obj=document.createElement('a');
	obj.appendChild(document.createTextNode('[入力フォーム]'));
	obj.style.textDecoration='none';
	obj.href='javascript:void(0)';
	if(obj.addEventListener){
		obj.addEventListener('click',BbsShowForm,false);
	}else{
		obj.attachEvent('onclick',BbsShowForm);
	}
	block.appendChild(obj);

	form=document.createElement('form');
	form.id='BbsForm';
	form.style.margin='0px';
	form.action='http://bp.stsd.info/bbs/write.cgi';
	form.method='post';
	form.acceptCharset='utf-8';
	if(form.addEventListener){
		form.addEventListener('submit',function(){return(BbsRecordCookie())},false);
	}else{
		form.attachEvent('onsubmit',function(){return(BbsRecordCookie())});
	}
	form.style.display='none';

	var meta=document.getElementsByTagName("meta");
	var charset;
	for(var i=0;i<meta.length;i++){
		if((meta[i].httpEquiv).search(/content-type/i)!=-1 && (meta[i].content).search(/charset=(\w)/i)){
			charset=(RegExp.$1).toLowerCase();
			obj=document.createElement('input');
			obj.type="hidden";
			obj.name='BbsCharset';
			obj.value=charset;
			form.appendChild(obj);
		}
	}

	obj=document.createElement('div');
	obj.appendChild(document.createTextNode('名前'));
	form.appendChild(obj);
	obj=document.createElement('input');
	obj.name='BbsName';
	obj.id='BbsName';
	obj.style.width='95%';
	obj.style.maxWidth='320px';
	form.appendChild(obj);

	obj=document.createElement('div');
	obj.appendChild(document.createTextNode('コメント'));
	form.appendChild(obj);
	obj=document.createElement('textarea');
	obj.name='BbsComment';
	obj.id='BbsComment';
	obj.style.width='95%';
	obj.style.maxWidth='640px';
	obj.style.height='100px';
	obj.style.display='block';
	form.appendChild(obj);

	obj=document.createElement('input');
	obj.id="BbsSubmit";
	obj.type='submit';
	obj.value='書き込む';
	form.appendChild(obj);

	block.appendChild(form);

	obj=document.createElement('div');
	obj.style.borderTop='1px dashed';
	obj.style.margin='5px 0px';
	obj.id='BbsContent';
	block.appendChild(obj);

	obj=document.createElement('a');
	obj.id='BbsLeft';
	obj.style.textDecoration='none';
	obj.innerHTML='&nbsp;&lt;&lt;&nbsp;';
	block.appendChild(obj);

	obj=document.createElement('span');
	obj.id='BbsNumber';
	obj.innerHTML='&nbsp;0&nbsp;';
	block.appendChild(obj);
	
	obj=document.createElement('a');
	obj.id='BbsRight';
	obj.style.textDecoration='none';
	obj.innerHTML='&nbsp;&gt;&gt;&nbsp;';
	block.appendChild(obj);

}





