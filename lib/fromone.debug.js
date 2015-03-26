/* 用户信息 */
var USERSTATUS = {
	islogin: false
}

/* 畅言评论相关数据 */
var APP_ID = 'cyrCA2YHb';
var APP_KEY = '5c81636378414a40b658c06b10d10f34';
var REDIRECT_URL = 'http://yansm.github.io/fromone/checkOAUTH.html';
var TOKEN = '';
var REACT_COMMENT = {};
var COMMENT_URL_TOKEN =  'https://changyan.sohu.com/api/oauth2/token';
var COMMENT_URL_USER = 'http://changyan.sohu.com/api/2/user/info';
var COMMENT_URL_LIST = 'http://changyan.sohu.com/api/2/topic/load';
var COMMENT_URL_LOGOUT = 'http://changyan.sohu.com/api/2/logout';
var COMMENT_URL_COMMENTS = 'http://changyan.sohu.com/api/2/topic/comments';
var COMMENT_URL_ADD =  'http://changyan.sohu.com/api/2/comment/submit';
var COMMENT_URL_LOGIN = 'https://changyan.sohu.com/api/oauth2/authorize?client_id=cyrCA2YHb&redirect_uri=http://yansm.github.io/fromone/checkOAUTH.html&response_type=code';

/* 日期缩写映射 */
var MONTHS = [
	'Jan.','Feb.','Mar.','Apr.','May.','Jun.','Jul.','Aug.','Sept.','Oct.','Nov.','Dec.'
]

/* 日期格式化 */
Date.prototype.format = function(format){ 
	var o = { 
		"M+" : this.getMonth()+1, //month 
		"d+" : this.getDate(), //day 
		"h+" : this.getHours(), //hour 
		"m+" : this.getMinutes(), //minute 
		"s+" : this.getSeconds(), //second 
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
		"S" : this.getMilliseconds() //millisecond 
	} 

	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 

	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 
	return format; 
} 

$.extend({
  /* 获取url参数 */
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  //获取url单个参数
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  },
  //获取跟路径
  getRootPath: function(){
		var curWwwPath=window.document.location.href;
		var pathName=window.document.location.pathname;
		var pos=curWwwPath.indexOf(pathName);
		var localhostPaht=curWwwPath.substring(0,pos);
		var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
		return(localhostPaht+projectName);
		//return 'file:///C:/Users/yansanmu/Desktop/fromone_template/dist';
  },
  //cookie操作
  cookie: function (key, value, options) {

    // key and value given, set cookie...
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        options = jQuery.extend({}, options);

        if (value === null) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setTime(t.getTime() + days*1000);
        }

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? String(value) : encodeURIComponent(String(value)),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
},
  //获取url路径
  setUrlWidthVars: function (vars,path) {
	var url = path + '/' + vars.url + '.html';
	return url;
  },
  //图片预加载
  loadImg: function (arr,funLoading,funOnLoad,funOnError){
	var numLoaded=0,
	numError=0,
	isObject=Object.prototype.toString.call(arr)==="[object Object]" ? true : false;
 
	var arr=isObject ? arr.get() : arr;
	for(a in arr){
		var src=isObject ? $(arr[a]).attr("data-src") : arr[a];
		preload(src,arr[a]);
	}
 
	function preload(src,obj){
		var img=new Image();
		img.onload=function(){
			numLoaded++;
			funLoading && funLoading(numLoaded,arr.length,src,obj);
			funOnLoad && numLoaded==arr.length && funOnLoad(numError);
		};
		img.onerror=function(){
			numLoaded++;
			numError++;
			funOnError && funOnError(numLoaded,arr.length,src,obj);
		}
		img.src=src;
	}
  },
  /* 生成随机数组 */
  getRndNum : function (n) {
	var rnd = [];
	for(var i=0;i<n;i++)
		rnd.push(Math.floor(Math.random()*4 + 1));
	return rnd;
 },
 /* 获取token */
 getToken : function () {
	var code = $.getUrlVar('code');
	$.ajax({
		data: {
			code: code,
			client_id: APP_ID, 
			client_secret: APP_KEY,
			grant_type: 'authorization_code',
			redirect_uri: REDIRECT_URL
		},
		url: COMMENT_URL_TOKEN,
		type: 'post',
		success: function (data) {
			
			parent.$.setToken(data);
		},
		erroe: function (data) {
			console.debug(data);
		}
	});
 },
 /*添加token  */
 setToken: function (data) {
	$.cookie('fromone_token',data.access_token, {expires: data.expires_in,path: '/'});
	$.setUser();
	$.closeModal();
	
 },
 /* 获取用户信息 */
 setUser : function () {
	var token = $.cookie('fromone_token');
	//console.log('token:'+ token);
	var flag = 'theComment';
	if(!token ) {
		if(REACT_COMMENT[flag] && REACT_COMMENT[flag].takeUser)
			REACT_COMMENT[flag].takeUser(null,{});
	};
	$.ajax({
		data: {
			access_token: token,
			client_id: APP_ID
		},
		sync:false,
		url: COMMENT_URL_USER,
		type: 'get',
		dataType: 'JSONP',
		success: function (data) {
			if(REACT_COMMENT[flag] && REACT_COMMENT[flag].takeUser)
				REACT_COMMENT[flag].takeUser(token,data);
		},
		error: function (data) {
			console.debug(data);
			$.cookie('fromone_token','',{expires: -1});
			if(REACT_COMMENT[flag] && REACT_COMMENT[flag].takeUser)
					REACT_COMMENT[flag].takeUser(null,{});
		}
	});
 },
 /* 打开modal框 */
 openModal : function (html) {
	$('.modal-area').eq(0).find('.modal-box').html(html).end().show(function(){
		$(this).addClass('current');
	});
 },
 /* 关闭modal框 */ 
 closeModal: function () {
	$('.modal-area').eq(0).find('.modal-box').html('').end().removeClass('current');
	setTimeout(function () {
		$('.modal-area').eq(0).hide();
	},500);
 },
  
});


/* 初始化的一些项 */
$(function () {
	var $body = $('body'),
			$fullScreen = $('.full-screen'),
			$loadArea = $('.loading-area');
	/* 默认state */
	var DEFAULT_STATE = {
		level: 1,
		type: 'bottom',
		model: 'index',
		url: 'index'
	};
	/* 存在的models */
	var MODELS = ['essay','css','index','phrase','about'];
	/* 跟路径 */
	var PATH = $.getRootPath();
	/* 预加载图片 */
	var URLPATHS = [
		PATH + '/' + 'images/index-background.jpg',
		PATH + '/' + 'images/phrase-background.jpg',
		PATH + '/' + 'images/about-background.jpg',
		PATH + '/' + 'images/css-background.jpg'
	]

	/* fullScreen 翻转 */
	var trunShow = function (model) {
		$body.removeClass().addClass(model);
		$fullScreen.show();
		setTimeout(function() {$fullScreen.addClass('current');},100)
	}
	var trunHide = function () {
		$fullScreen.removeClass('current');
		setTimeout(function() {$fullScreen.hide();},1370)
	}
	
	/* 按钮点击 */
	$(document)
	.on('click','[click-target="change-btn"]',function () {
		var data = $.extend({},{level:'1'},$(this).data());
		setPageState(data);
	})
	.on('click','[click-target="page-btn"]',function () {
		var data = $.extend({},{level:'2'},$(this).data());
		setPageState(data);
	})
	.on('click','.modal-area',function (e) {
		$.closeModal();
	})
	.on('click','.modal-box',function(e){
		e.stopPropagation();
	});
	
	/* 设置页面 */ 
	var setPageState = function (data,flag) {
		if(!(data && data.level && data.model)) data = DEFAULT_STATE;
		var url = $.setUrlWidthVars(data,PATH);
		
		if(flag) {history.replaceState(data,'',url); return;}
		history.pushState(data,'',url);
		buildPage(data);
	}
	/* 绑定popstate 事件 */
	window.addEventListener("popstate", function(e) {
		if(!e.state) return; 
        buildPage(e.state);
    }); 
	
	/* 路径错误引导机制 */  
	var errorManage = function () {
	 
	}
	
	/* 来一发略复杂的建立页面的大事件！！！！ */
	var buildPage = function (data) {
		var l_state = $body.data(), n_state = data;
		if(!(l_state && l_state.level  && l_state.model)) l_state = DEFAULT_STATE;
		if(!(n_state && n_state.level  && n_state.model)) n_state = DEFAULT_STATE;
		var l_level = l_state.level,n_level = n_state.level;
		//show animate 
		if(l_level == n_level && l_state.model == n_state.model) return;
		var flag = 'hide';
		l_state['type'] = n_state['type'] = 'bottom';
		if(l_level > n_level) { 
			flag = 'down';
			l_state['type'] = 'page';
		}else if(l_level < n_level) {
			flag = 'up';
			n_state['type'] = 'page';
		}
		var le = $.Event(flag+'.'  + l_state.model ,{l_state: l_state, n_state : n_state});
		console.debug(flag+'.'  + l_state.model );
		$body.trigger(le);
	} 
	
	/* 各种动画效果 */ 
	var showLevel_1 = function (l_state,n_state,delay) {
		var type = n_state.type,model = n_state.model,delay = delay + 100;
		if($('#'+type).length == 0) $body.append('<div id='+ type +'></div>');
		$('#'+ type).show().load(model + '.html .'+ model +'-area',function (response,status,xhr) {
			if(status == 'error') {errorManage(); return;} 
			var $this = $(this);
			if(type=='bottom') {
				delay += 1500;
				trunHide();  
			}
			setTimeout(function() {
				$this.find('.'+ model +'-area').addClass('current'); 
				var le = $.Event('done.'+ model);
				$body.data(n_state).trigger(le);
			},delay);
		});  
	}
	
	var hideLevel_1 = function (l_state,n_state,delay) {
		var type = l_state.type,model = l_state.model, delay = delay;
		if(!$fullScreen.hasClass('current')){
			trunShow(n_state.model);
			delay += 1500;  
		};
		$body.find('.'+ model +'-area').removeClass('current');
		setTimeout(function () {
			var le = $.Event('show.' + n_state.model ,{l_state: l_state,n_state : n_state});
			console.debug('show.' + n_state.model);
			$('#'+ type).hide();
			$body.trigger(le);  
		},delay);   
	}
	
	var upLevel_1 = function (l_state, n_state, delay) {
		var model = l_state.model,delay = delay, n_model = n_state.model,n_type = n_state.type,n_url = n_state.url;
		$('.' + model + '-area').addClass('page-current');
		if($('#'+n_type).length == 0) $body.append('<div id='+ n_type +' style="display:block;"></div>');
		
		setTimeout(function () {
			$('#' + n_type).show().addClass('page-' + n_model).load($.setUrlWidthVars(n_state, PATH) + ' .'+ n_model +'-area', function (response,status,xhr) {
				if(status == 'error') {errorManage(); return;} 
				var $this = $(this);
				setTimeout(function () {
					$this.find('.' + n_model + '-area').addClass('current');
				}, 100);
				var le = $.Event('done.'+ n_model);
				$body.data(n_state).trigger(le);
			});
		},delay);
	}
	
	var downLevel_2 = function (l_state, n_state, delay) {
		var model = l_state.model,type = l_state.type,delay = delay, n_model = n_state.model,n_type = n_state.type,n_url = n_state.url;
		
		$('#'+ type).find('.'+ model + '-area').removeClass('current').end().delay(1000).hide(0);
		
		if($('#'+n_type).length == 0) $body.append('<div id='+ n_type +' style="display:block;"></div>');
		
		setTimeout(function () {
			if($('#' + n_type).find(' .'+ n_model +'-area').length > 0) { 
				$('#' + n_type).find(' .'+ n_model +'-area').removeClass('page-current');
			}else{
				$('#' + n_type).addClass(n_model).load($.setUrlWidthVars(n_state, PATH) + ' .'+ n_model +'-area', function (response,status,xhr) {
					if(status == 'error') {errorManage(); return;} 
					
					var $this = $(this);
					$this.find('.'+ n_model +'-area').addClass('current'); 
					var le = $.Event('done.'+ n_model);
					$body.data(n_state).trigger(le);
				});
			}
			$body.data(n_state); 
		},delay);
		
	} 
	
	/* list构建 */
	var getList = function (model,start,length) {
		var list = _.slice(_.filter(post_map,function (n) {
			if(n.catgory){
				return n.catgory.match(model);
			}
			return false;
		}) ,start, start + length );
		return list;
	}
	var buildList = {};
	buildList['essay'] = function (catgory,start,length) {
		if(!start || !length) { start = 0; length = 20;}
		if(!catgory) catgory = 'essay';
		var list = getList(catgory, start, length),html = [];
		if(list.length === 0) return false;
		for(var length = list.length,i = 0; i < length; i ++) {
			var node = list[i],date = node.time.split('-');
			html.push('<div class="article-box"><hgroup><h3 class="article-title">');
			html.push(node.title);
			html.push('</h3><aside><span class="article-time"><i class="year">');
			html.push(date[0]);
			html.push('</i><i class="month">');
			html.push(date[1]);
			html.push('</i><i class="day">');
			html.push(date[2]);
			html.push('</i></span><span class="article-author">');
			html.push(node.author);
			html.push('</span></aside></hgroup><div class="article-intro">');
			html.push(node.intro);
			html.push('</div><div class="article-more" click-target="page-btn" data-model="essay-page"  data-url="'+ node.dest +'">read more</div></div>');
		}
		var data = {
			start: start,
			length: length,
			catgory: catgory
		}
		if(start === 0)
			$('.essay-list').data(data).html(html.join(''));
		else
			$('.essay-list').data(data).append(html.join(''));
		$('.essay-area.scroll-pane').jScrollPane({verticalGutter: -10});
		return true;
	};
	buildList['phrase'] = function (catgory,start,length) {
		if(!start || !length) { start = 0; length = 20;}
		if(!catgory) catgory = 'prose';
		var list = getList(catgory, start, length),html = [];
		if(list.length === 0 && start !== 0) return false;
		for(var length = list.length,i = 0; i < length; i ++) {
			var node = list[i],date = node.time.split('-');
			var imgurl = node.dest.split('\\');
			imgurl[imgurl.length -1 ] = 'images\\' + imgurl[imgurl.length -1 ] + '.jpg';
			imgurl = imgurl.join('\\');
			html.push('<div class="article-box" click-target="page-btn" data-model="phrase-page"  data-url="'+ node.dest +'" ><img src="'+ imgurl +'"><hgroup><h3 class="article-title">');
			html.push(node.title);
			html.push('</h3><aside class="article-time">');
			html.push(date[0]);
			html.push('年');
			html.push(date[1]);
			html.push('月');
			html.push(date[2]);
			html.push('日</aside><aside class="article-author">by ');
			html.push(node.author);
			html.push('</aside></hgroup></div>');
		}
		
		var data = {
			start: start,
			length: length,
			catgory: catgory
		}
		if(start === 0)
			$('.phrase-list').data(data).html(html.join(''));
		else
			$('.phrase-list').data(data).append(html.join(''));
		$('.phrase-area.scroll-pane').jScrollPane({verticalGutter: -10});
		return true;
	}
	buildList['css'] = function (catgory,start,length) {
		if(!start || !length) { start = 0; length = 20;}
		if(!catgory) catgory = 'css';
		var list = getList(catgory, start, length),html = [];
		if(list.length === 0 && start !== 0) return false;
		for(var length = list.length,i = 0; i < length; i ++) {
			var node = list[i],date = node.time.split('-');
			html.push('<div class="article-box">');
			html.push('<span class="article-time"><i class="day">');
			html.push(date[2]);
			html.push('</i><i class="month">');
			html.push(MONTHS[date[1] - 1]);
			html.push('</i><i class="year">');
			html.push(date[0]);
			html.push('</i></span><h3 class="article-title">');
			html.push(node.title);
			html.push('</h3><span class="article-author">');
			html.push(node.author);
			html.push('</span><div class="article-more"  click-target="page-btn" data-model="css-page"  data-url="'+ node.dest +'" ><span></span></div></div>');
		}
		
		var data = {
			start: start,
			length: length,
			catgory: catgory
		}
		if(start === 0)
			$('.css-list').data(data).html(html.join(''));
		else
			$('.css-list').data(data).append(html.join(''));
		$('.css-main-box.scroll-pane').jScrollPane({verticalGutter: -10});
		return true;
	}
	/* 滚轮事件 */
	$(document).on('jsp-scroll-y','.essay-area,.phrase-area,.css-main-box',function (e,delta,istop,isbottom) {
		if(!isbottom) return;
		$(this).find('.more-btn').click();
	})
	/* 查看更多按钮 */
	.on('click', '.more-btn', function (e) {
		var $this = $(this),model = $this.data('model'), $model = $('.'+ model + '-list'), 
			start = $model.data('start')? $model.data('start'): 0, length = $this.data('length')? $this.data('length'): 20,
			catgory = $model.data('catgory')? $model.data('catgory'): model;
		$this.html('查看更多').addClass('current');
		var flag = buildList[model](catgory, start + length, length);
		$this.removeClass('current');
		if(!flag) $this.html('没有更多了');
	})
	/* 点击分类按钮 */
	.on('click','[click-target="catgory-btn"]', function (e) {
		var $this = $(this),model = $this.data('model'), catgory = $this.data('catgory');
		$this.siblings().removeClass('current').end().addClass('current');
		buildList[model] (catgory);
	})
	
	/* 动画事件 */
	$body
	//index
	 .on('show.index',function (e) {
		var delay = 0;
		showLevel_1(e.l_state,e.n_state,delay);
	 })
	 .on('hide.index',function (e) {
		var delay = 0;
		hideLevel_1(e.l_state,e.n_state,delay);
	 })
	 .on('up.index',function (e) {
		var delay = 0;
		upLevel_1(e.l_state,e.n_state,delay);
	 })
	 .on('down.index-page', function (e) {
		var delay = 0;
		downLevel_2(e.l_state,e.n_state,delay);
	 })
	 .on('done.index-page',function (e) {
		REACT_COMMENT['theComment'] =React.render(
			React.createElement(LeaveWordComment, {}),
			$('.index-page-container')[0]
		);
	 })
	// essay    
	.on('show.essay',function (e) {
		var delay = 0, n_state = e.n_state;
		n_state['type'] = 'top';
		showLevel_1(e.l_state,n_state,delay);
	})
	.on('hide.essay',function (e) {
		var delay = 500, l_state = e.l_state;
		l_state['type'] = 'top';
		hideLevel_1(l_state,e.n_state,delay);
	})
	.on('up.essay', function (e) {
		var delay = 0;
		upLevel_1(e.l_state,e.n_state,delay);
	})
	 .on('down.essay-page', function (e) {
		var delay = 0,n_state = e.n_state;
		n_state['type'] = 'top';
		downLevel_2(e.l_state,n_state,delay);
	 })
	.on('done.essay', function (e) {
		buildList['essay']();
		$('.essay-area').jScrollPane({verticalGutter: -10});
	})
	.on('done.essay-page',function (e) {
		var url = $body.data('url');
		trunShow('essay');
		REACT_COMMENT['theComment'] = React.render(
			React.createElement(Comment,{source_id: url}),
			$('.essay-page-area .mainbody-comment')[0]
		);
	})
	// css
	.on('show.css',function (e) {
		var delay = 0;
		showLevel_1(e.l_state,e.n_state,delay);
	})
	.on('hide.css',function (e) {
		var delay = 0; 
		hideLevel_1(e.l_state,e.n_state,delay);
	})
	.on('done.css', function (e) {
		buildList['css']();
		$('.css-main-box').jScrollPane({verticalGutter: -10});
	})
	.on('up.css', function (e) {
		var delay = 0;
		upLevel_1(e.l_state,e.n_state,delay);
	})
	 .on('down.css-page', function (e) {
		var delay = 0,n_state = e.n_state;
		downLevel_2(e.l_state,n_state,delay);
	 })
	 .on('done.css-page',function (e) {
		var url = $body.data('url');
		REACT_COMMENT['theComment'] = React.render(
			React.createElement(Comment,{source_id: url}),
			$('.css-page-area .mainbody-comment')[0]
		);
	})
	//phrase
	.on('show.phrase',function (e) {
		var delay = 0;
		showLevel_1(e.l_state,e.n_state,delay);
	})
	.on('hide.phrase',function (e) {
		var delay = 0;
		hideLevel_1(e.l_state,e.n_state,delay);
	})
	.on('done.phrase', function (e) {
		buildList['phrase']();
		$('.phrase-area').jScrollPane({verticalGutter: -10});
	})
	.on('up.phrase', function (e) {
		var delay = 0;
		upLevel_1(e.l_state,e.n_state,delay);
	})
	.on('down.phrase-page', function (e) {
		var delay = 0,n_state = e.n_state;
		downLevel_2(e.l_state,n_state,delay);
	 })
	 .on('done.phrase-page',function (e) {
		var url = $body.data('url');
		REACT_COMMENT['theComment'] = React.render(
			React.createElement(Comment,{source_id: url}),
			$('.phrase-page-area .mainbody-comment')[0]
		);
	})
	//about
	.on('show.about',function (e) {
		var delay = 0;
		showLevel_1(e.l_state,e.n_state,delay);
	})
	.on('hide.about',function (e) {
		var delay = 0;
		hideLevel_1(e.l_state,e.n_state,delay); 
	})
	.on('done.about', function (e) { 
		$('.about-area').jScrollPane({verticalGutter: -10});
	})
	
	/* 刷新时触发一次 */ 
	//buildPage($.getUrlVars());
	//调整模块
	var bodyData = $body.data();
	$('.' + bodyData.model + '-area').addClass('current');
	var le = $.Event('done.'+ bodyData.model);
	$body.trigger(le);
	if(bodyData.type == 'top') trunShow(bodyData.model);
	//setPageState(bodyData,true);    //先屏蔽一下
	
	//背景图片预加载 
	$.loadImg(URLPATHS,$.noop,function (count) {
	},$.noop);
	window.onload = function () {
		$loadArea.addClass('current');
		setTimeout(function() {
			$loadArea.hide();
		}, 1000)
	}
});


