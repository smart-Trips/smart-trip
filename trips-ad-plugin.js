//跨浏览器获取Style样式
function getStyle(element, attr) {
	var value;
	if (typeof window.getComputedStyle != 'undefined') {//W3C
		value = window.getComputedStyle(element, null)[attr];
	} else if (typeof element.currentStyle != 'undeinfed') {//IE
		value = element.currentStyle[attr];
	}
	return value;
}

/**
 * 	主体加载，广告插件结构初始化。
 */
function init(){
	//创建第一页的组件
	var plugin_ele_str = '<div id="trips-ad-plugin">'+
							'<header>'+
							'<nav>'+
							'<ul class="nav-list">'+
							'<li><a id="login" href="http://en.trips.sanyatour.com/" target="_blank">Login</a></li>'+
							'<li>|</li>'+
							'<li><a id="register" href="http://en.trips.sanyatour.com/" target="_blank">Register</a></li>'+
							'<li><select id="form-select" class="form-con"><option id="language-en" value="en" selected>English</option><option id="language-cn" value="cn">中文</option></select></li>'+
							'<li><span id="language">Language</span></li>'+
							'</ul>'+
							'</nav>'+
							'<div class="search-div">'+
							'<input class="form-con" type="text"><button id="search-trips">search</button>'+
							'</div>'+
							'</header>'+
							'<div id="trips-ad-plugin-one">' +
							'<h2 id="trip-word">Select the scene you like!</h2>'+
							'<ul>'+
							'</ul>'+
							'<div id="trips-ad-plugin-one-buttons">'+
							'<a href="http://en.trips.sanyatour.com/" target="_blank"><img src="http://cdn21.beyondsummits.com/sanya/p/img/1200/logo.png" alt="trips-sanya" title="trips-sanya"></a>'+
							'</div></div>'+
							'<div id="trips-ad-plugin-two">'+
							'<h2 id="trip-word2">没有符合要求的内容</h2>'+
							'<ul class="content">'+
							'</ul>'+
							'<ul class="buttons"><li><a href="http://en.trips.sanyatour.com/" target="_blank"><img src="http://cdn21.beyondsummits.com/sanya/p/img/1200/logo.png" alt="trips-sanya" title="trips-sanya"></a></li><li><span>↶</span></li></ul>'+
							'</div><div id="trips-ad-plugin-button"><span>&gt;&gt;</span><br>Smart<br>Trips</div>'+
							'<div id="trips-mask"><h2>数据加载中，请稍后...</h2></div>';
	//创建父节点，广告的最高层节点。
	var plugin_ele = $(plugin_ele_str);
	//创建
	$('body').append(plugin_ele);
}

function initCSS(){
	/*reset 样式*/
	$('div#trips-ad-plugin ul').css({'margin': '0', 'padding': '0'});
	/*@插件主体样式。*/
	$('div#trips-ad-plugin').css({'display':'block', 'width':'300px', 'height':'400px', 'background':'white', 'z-index':'9999', 'position':'absolute', 'border':'1px solid #ccc', 'left':'-302px','top':'200px'});
	/*@第一个页面的样式开始。*/
	$('div#trips-ad-plugin-one h2, div#trips-ad-plugin-two h2').css({'width': '100%', 'height':'30px', 'line-height':'30px', 'background':'#eee', 'margin':'0', 'font-size': '14px', 'text-indent':'10px', 'color':'#555'});
	/*第一个页面的图片组样式*/
	$('div#trips-ad-plugin-one>ul').css({'display':'block', 'width':'100%', 'height':'340px', 'list-style':'none', 'margin':'3px 0px 0px 3px'});
	
	$('div#trips-ad-plugin-one > ul li').css({'width': '92px', 'height':'105px', 'float':'left', 'margin':'3px'});
}

/**
 * 	@start 开始 程序入口;
 */
$(function(){

	//这里定义了一组全局变量，用于在其他地方可以调用。
	//定义两个数组用于接收服务器端的数据。
	var plugin_one_datas = [];
	var plugin_two_datas = [];
	//调用初始化元素结构方法。
	init();
	//初始化AJAX数据
	$.ajax({url:"http://47.88.76.103:8899/trip/pic/random/1", type : 'get', async : false, success:function(result){
		//获取请求数据，并将其赋值给一个变量，该变量是一个数组对象。其格式如下。
		//[{id:'xxxx', url:'xdff.jpg'},{id:'xxxx', url:'xdff.jpg'}...]
		plugin_one_datas = result;
		for(var i = 0; i < result.length; i++){
			//对所有的图片赋值，并给他添加特殊的属性(自定义属性)，用于向后台传输数据的。
			if(i<12){
				$("#trips-ad-plugin-one ul").append('<li><img data-id="'+result[i].id+'" data-src="'+result[i].url+'" data-check="uncheck" src="'+result[i].url+'"/></li>')
			}else{
				$("#trips-ad-plugin-one ul").append('<li><img data-id="'+result[i].id+'" data-src="'+result[i].url+'" data-check="uncheck" src="http://www.jane-style.com/project/default.jpg"/></li>')
			}
		}
		checkImgs();
	}});



/*****************************  图片按需加载方法    *******************************************************************************************/
	/* 图片按需加载方法 开始 */
	function imgload(img){
		img.each(function(){
			var othis = $(this);//当前图片对象
			var top = ($(window).height()/2-251)+410;//计算图片距离窗口的位置(浏览器总高度/2 -（html50%）得到页面距离+图片到html距离)
			if (othis.offset().top-$(document).scrollTop() > top) {//如果该图片不可见,图片距离顶部的位置 要考虑滚动条  所以要减去窗口的滚动高度；
				return;//不管
			}else{
				othis.attr('src', othis.attr('data-src')).removeAttr('data-src');//可见的时候把占位值替换 并删除占位属性
			}
		});
	}
	//第一个页面滚动图片 按需加载
	$("#trips-ad-plugin-one ul").scroll(function(){
		imgload($("#trips-ad-plugin-one ul img"));
	});
	//第二个页面滚动图片 按需加载
	$("#trips-ad-plugin-two ul.content").scroll(function(){
		imgload($("#trips-ad-plugin-two ul.content li img"));
	});
	/* 图片按需加载方法 结束 */



/***************** 搜索模块 功能 开始  *********************************************************************************************************/
	/* 点击搜索  开始 */
	$("#trips-ad-plugin #search-trips").click(function(){
		$("#trips-ad-plugin-two ul.content").scrollTop(0);   //默认让滚动条初始化，为了兼容谷歌等浏览器问题；
		var count = 0;
		var _imgs = $('div#trips-ad-plugin-one ul li img');
		var ids = [];
		//判断图片是否被选中
		for(var i = 0; i < _imgs.length; i++){
			if($(_imgs[i]).attr('data-check') == 'check'){
				count++;
				ids.push($(_imgs[i]).attr('data-id'));
			}
		}
		$('div#trips-ad-plugin-one ul li img').attr('data-check','uncheck');
		$('div#trips-ad-plugin-one ul li img').removeClass('check');

		var datas = JSON.stringify(ids);

		if(ids.length < 1){
			//alert('请选择你喜欢的图片。');
			//return 0;
			search();
		}else{
			$.ajax({
				type: 'get',
				url: 'http://47.88.76.103:8899/trip/item/recommend/1',
				data: {pics : datas},
				async:false,
				success: function(result){
					console.log(result);
					console.log(JSON.stringify(result));
					//成功后的响应事件，用来加载数据。
					plugin_two_datas = result;
					//清除所有节点。
					$('div#trips-ad-plugin-two > ul.content').empty();
					var ele = '';
					for(var i = 0; i < plugin_two_datas.length; i++){
						if(i<2){
							ele += '<li data-id="'+plugin_two_datas[i].id+'" data-src="'+plugin_two_datas[i].url+'"><img src="'+plugin_two_datas[i].image+'"/><div><h2>'+ plugin_two_datas[i].title +'</h2><span>'+ plugin_two_datas[i].info +'</span></div></li>';
						}else{
							ele += '<li data-id="'+plugin_two_datas[i].id+'" data-src="'+plugin_two_datas[i].url+'"><img src="http://www.jane-style.com/project/default.jpg" data-src="'+plugin_two_datas[i].image+'"/><div><h2>'+ plugin_two_datas[i].title +'</h2><span>'+ plugin_two_datas[i].info +'</span></div></li>';
						}
					}
					//创建元素。
					var sele = $(ele);
					$('div#trips-ad-plugin-two > ul.content').append(sele);
					//加载点击跳转功能。
					JumpURL();
				},
				dataType: 'json'
			});
			//清除图片选中。
			$('div#trips-ad-plugin-one ul li img').attr('data-check','uncheck');
			$('div#trips-ad-plugin-one ul li img').removeClass('check');

			//隐藏当前页面，显示下一个页面
			$('div#trips-ad-plugin-one').hide();
			$('div#trips-ad-plugin-two').show();
		}
		//console.log(datas);

		//想服务器发送请求，在回调函数中初始化第二页的数据。


	});
	/* 点击搜索  结束 */
	/* 回车响应查询事件  */
	$("#trips-ad-plugin .search-div").keypress(function (e) {
		var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
		if (keyCode == 13){
			search();
		}
	});
	/*  搜索结果  ajax */
	function search(){
		var word = $("#trips-ad-plugin .search-div .form-con").val();
		var language = $("#trips-ad-plugin #form-select").val();
		//隐藏当前页面，显示下一个页面
		$('div#trips-ad-plugin-one').hide();
		$('div#trips-ad-plugin-two').show();
		$('div#trips-ad-plugin-two > ul.content').empty();   //每搜索一次数据 需要先清空原来的ul
		$.ajax({url:"http://47.88.76.103:8899/trip/item/search?webid=1&language="+language+"&words="+word,type:"get",async:false,success:function(result){
			plugin_two_datas = result;
			var ele = '';
			if(result.length<1){
				$("div#trips-ad-plugin-two #trip-word2").show();
				$('div#trips-ad-plugin-two > ul.content').css("height","324px");
			}else{
				//$('div#trips-ad-plugin-two > ul.content').css("height","354px");
				for(var i = 0; i < plugin_two_datas.length; i++){
					if(i<2){
						ele += '<li data-id="'+plugin_two_datas[i].id+'" data-src="'+plugin_two_datas[i].url+'"><img src="'+plugin_two_datas[i].image+'"/><div><h2>'+ plugin_two_datas[i].title +'</h2><span>'+ plugin_two_datas[i].info +'</span></div></li>';
					}else{
						ele += '<li data-id="'+plugin_two_datas[i].id+'" data-src="'+plugin_two_datas[i].url+'"><img src="http://www.jane-style.com/project/default.jpg" data-src="'+plugin_two_datas[i].image+'"/><div><h2>'+ plugin_two_datas[i].title +'</h2><span>'+ plugin_two_datas[i].info +'</span></div></li>';
					}
				}
				//创建元素。
				var sele = $(ele);
				$('div#trips-ad-plugin-two > ul.content').append(sele);
			}
			//加载点击跳转功能。
			JumpURL();
			//checkImgs();
		}});
	}
	/******************  搜索模块 功能 结束  ********************************************************************************************************/
	//中英文切换
	$("#form-select").change(function(){
		if($(this).val()=="en"){
			$("#trips-ad-plugin #login").html("login");
			$("#trips-ad-plugin #register").html("Register");
			$("#trips-ad-plugin #language").html("Language")
			$("#trips-ad-plugin #search-trips").html("search");
			$("#trips-ad-plugin #trip-word").html("Select the scene you like!");
			//$("#trips-ad-plugin #trip-word2").html("Travel itinerary for you");
			//$("#trips-ad-plugin #language-en").html("english");
			//$("#trips-ad-plugin #language-cn").html("chinese");
		}else{
			$("#trips-ad-plugin #login").html("登陆");
			$("#trips-ad-plugin #register").html("注册");
			$("#trips-ad-plugin #language").html("语言")
			$("#trips-ad-plugin #search-trips").html("搜索");
			$("#trips-ad-plugin #trip-word").html("选择你喜欢的风景， 智能为你推荐行程");
			//$("#trips-ad-plugin #trip-word2").html("Travel itinerary for you");
			//$("#trips-ad-plugin #language-en").html("英文");
			//$("#trips-ad-plugin #language-cn").html("中文");
		}
	});
	/* 	鼠标移动按钮显示与隐藏广告  开始 */
	$('#trips-ad-plugin-button').click(function(){
		if($('#trips-ad-plugin').css("left")=="0px"){
			$("#trips-ad-plugin-button>span").html("&gt;&gt;");
			//清除图片选中。
			$('div#trips-ad-plugin-one ul li img').attr('data-check','uncheck');
			$('div#trips-ad-plugin-one ul li img').removeClass('check');
			//防止动画多次触发，每次加载先停止上一次的动画
			$('#trips-ad-plugin').stop(true);
			$('#trips-ad-plugin').animate({
				left:-302
			},900,'swing');
		}else{
			$("#trips-ad-plugin-button>span").html("&lt;&lt;");
			//防止动画多次触发，每次加载先停止上一次的动画
			$('#trips-ad-plugin').stop(true);
			$('#trips-ad-plugin').animate({
				left:0
			},900,'swing');
		}
	});

	/**
	 *	@图片点击选择样式切换。 并防止事件叠加
	 */
	function checkImgs(){
		$('div#trips-ad-plugin-one ul li img').unbind("click").on('click', function(){
			var _img = this;
			if($(_img).attr('data-check') == 'check'){
				$(_img).attr('data-check','uncheck');
				$(_img).removeClass('check');
			}else if($(_img).attr('data-check') == 'uncheck'){
				$(_img).attr('data-check','check');
				$(_img).addClass('check');
			}
		});
	}
	
	
	/*****************************************************************************************************************************************************
	 * 	@提交按钮
	 * 	触发第一个页面的点击按钮,防止事件叠加
	 * 	获取点击图片，传输数据，跳转第二个插件版本,并隐藏本页面
	 */
	$('#trips-ad-plugin-one-buttons span').unbind("click").on('click', function(){
		//$('div#trips-ad-plugin div#trips-mask').show();

		
	});

	/*********************************************************************************************************************************************************************************************
	 * 	点击第二页的返回按钮触发事件，显示第一页。阻止事件叠加
	 */
	$('div#trips-ad-plugin-two .buttons span').unbind('click').on('click',function(){
		$('div#trips-ad-plugin-one').show();
		$('div#trips-ad-plugin-two').hide();
	});
	
	/**
	 * 	点击第二个界面的列表项，跳转所在的URL地址。并阻止事件重复
	 */
	function JumpURL(){
		$('div#trips-ad-plugin-two > ul.content > li').unbind('click').on('click', function(){
			/*  点击行程图片 传行程id给后台 */
			$.ajax({url:"http://47.88.76.103:8899/trip/item/click?itemid="+$(this).attr("data-id"),type:"get",async:false,success:function(result){

			}});
			//alert($(this).attr('data-src'));
			if(typeof($(this).attr('data-src'))=="undefined"){
			}else{
				//location.href = $(this).attr('data-src');
				window.open($(this).attr('data-src'));//新窗口打开网址
			}
		});
	}
});
