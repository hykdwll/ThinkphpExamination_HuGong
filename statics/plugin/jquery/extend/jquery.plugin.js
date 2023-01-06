//jquery函数
(function($){
	//滚动顶部
	$.fn.backToTop = function(options) {
		var $this = $(this);
		$this.hide().click(function() {
			$("body, html").animate({
				scrollTop:"0px"
			});
		});
		var $window = $(window);
		$window.scroll(function() {
			if ($window.scrollTop() > 0) {
				$this.fadeIn();
			}else{
				$this.fadeOut();
			}
		});
		return this;
	}
	//数值输入
	$.fn.inputOnlyNum=function(t){
		function rv(obj,v){
			var ov=obj.value;
			if(document.selection){
				obj.focus();
				var sel=document.selection.createRange(),s=sel.text.length;
				sel.moveStart("character",-ov.length);
				v=ov.substring(0,sel.text.length-s)+v+ov.substring(sel.text.length)
			}else{
				v=ov.substring(0,obj.selectionStart)+v+ov.substring(obj.selectionEnd)
			}
			ov='/^';
			if(t==1||t==3){
				ov+='-?';
				if(v=='-')return true
			}
			ov+='\\d+';
			if(t==2||t==3)ov+='\\.?\\d{0,2}';
			obj.focus();
			return eval(ov+'$/').test(v)
		}this.bind('paste',function(e){
			return rv(e.target,clipboardData.getData('text'))
		}).keypress(function(e){
			if(e.which==8||e.keyCode==9)return true;
			return rv(e.target,String.fromCharCode(e.which))
		}).bind('dragenter',function(){
			return false
		}).css('ime-mode','disabled');
		return this
	}
	//表单事件
	$.fn.inputDefault=function(v,c,d,f){
		if(d==undefined)d=[''];
		if(!$.isArray(d))d=[String(d)];
		if($.inArray('',d)==-1)d.push('');
		if(v==undefined)v='';
		if(c==undefined)c='';
		this.blur(function(){
			if($.inArray($(this).val(),d)!=-1)$(this).val(v);
			if(c!='')$(this).addClass(c);
			if($.isFunction(f))f(this)
		}).bind('focus',function(){
			if($(this).val()==v)$(this).val('');
			if(c!='')$(this).removeClass(c)
		});
		return this
	};
	//选择html对象
	$.fn.selectedElement = function (t) {
		if (!$.isPlainObject(t)) t = { css: !t ? '' : t };
		var obj = $(this);
		obj.bind('selectstart', function () {
			return false
		});
		this.unbind('click').bind('click', function (e) {
			if ('INPUT' == e.target.tagName) return;
			var o = $(this);
			if (e.shiftKey) {
				var s, s1 = obj.filter('[selectedElement]:first'), s2 = obj.index(this);
				s1 = s1.length == 0 ? 0 : obj.index(s1);
				if (s1 > s2) {
					s = s1 + 1; s1 = s2
				} else {
					s = s2 + 1
				}
				o = obj.slice(s1, s)
			} else if (e.ctrlKey) {
				o = obj.filter('[selectedElement]');
				if (o.is(this)) {
					o = o.not(this)
				} else {
					o = o.add(this)
				}
			}
			obj.removeAttr('selectedElement');
			o.attr('selectedElement', 1);
			if (!!t.css) {
				obj.removeClass(t.css); o.addClass(t.css)
			}
			if ($.isFunction(t.fn)) t.fn(obj, o)
		});
		return obj
	};
	//插入内容
	$.fn.insertContent = function(myValue,t){
		var $t=$(this)[0];
		if (document.selection) {//ie
			this.focus();
			var sel = document.selection.createRange();
			sel.text = myValue;
			this.focus();
			sel.moveStart ('character', -l);
			var wee = sel.text.length;
			if(arguments.length == 2){
				var l = $t.value.length;
				sel.moveEnd("character", wee+t );
				t<=0?sel.moveStart("character",wee-2*t-myValue.length):sel.moveStart("character",wee-t-myValue.length);
				sel.select();
			}
		}else if ($t.selectionStart || $t.selectionStart == '0') {
			var startPos = $t.selectionStart;
			var endPos = $t.selectionEnd;
			var scrollTop = $t.scrollTop;
			$t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
			this.focus();
			$t.selectionStart = startPos + myValue.length;
			$t.selectionEnd = startPos + myValue.length;
			$t.scrollTop = scrollTop;
			if(arguments.length == 2){
				$t.setSelectionRange(startPos-t,$t.selectionEnd+t);
				this.focus();
			}
		}else{
			 this.value += myValue;
			 this.focus();
		}
	}
	//select下拉
	$.fn.divselect = function(inputselectid){
		$(this).children("cite").click(function(){
			var ul = $(this).siblings("ul");
			if(ul.css("display")=="none"){
				ul.slideDown("fast");
			}else{
				ul.slideUp("fast");
			}
		});
		$(this).find("a").click(function(){
			$(this).parents("ul").siblings("cite").html($(this).text());
			$(inputselectid).val($(this).attr("selectid"));
			$(this).parents("ul").hide();
		});
	};

})(jQuery);

//jquery 自定义插件
/****
$('#timeCountDown').timeCountDown("2019/07/08 18:45:13");
<span id="timeCountDown">
	<span class="year">00</span>年
	<span class="month">00</span>月
	<span class="day">00</span>天
	<span class="hour">00</span>时
	<span class="mini">00</span>分
	<span class="sec">00</span>秒
	<span class="hm">000</span>
</span>
***/

$.extend($.fn,{
	//倒计时插件
	timeCountDown: function(d){
		this.each(function(){
		    var $this = $(this);
		    var o = {
		        hm: $this.find(".hm"),
		        sec: $this.find(".sec"),
		        mini: $this.find(".mini"),
		        hour: $this.find(".hour"),
		        day: $this.find(".day"),
		        month:$this.find(".month"),
		        year: $this.find(".year")
		    };
		    var f = {
		        haomiao: function(n){
					if(n < 10){return "00" + n.toString();}
					if(n < 100){return "0" + n.toString();}
					return n.toString();
				},
		        zero: function(n){
					var _n = parseInt(n, 10);
					if(_n > 0){
						if(_n <= 9){ _n = "0" + _n;}
						return String(_n);
					}else{
						return "00";
					}
		        },
		        dv: function(){
					var _d = $this.data("end") || d;
					var now = new Date(),
				    endDate = new Date(_d);
					var dur = (endDate - now.getTime()) / 1000 , mss = endDate - now.getTime() ,pms = {
						hm:"000",
						sec: "00",
						mini: "00",
						hour: "00",
						day: "00",
						month: "00",
						year: "0"
					};
					if(mss > 0){
						pms.hm = f.haomiao(mss % 1000);
						pms.sec = f.zero(dur % 60);
						pms.mini = Math.floor((dur / 60)) > 0? f.zero(Math.floor((dur / 60)) % 60) : "00";
						pms.hour = Math.floor((dur / 3600)) > 0? f.zero(Math.floor((dur / 3600)) % 24) : "00";
						pms.day = Math.floor((dur / 86400)) > 0? f.zero(Math.floor((dur / 86400)) % 30) : "00";
						pms.month = Math.floor((dur / 2629744)) > 0? f.zero(Math.floor((dur / 2629744)) % 12) : "00";
						pms.year = Math.floor((dur / 31556926)) > 0? Math.floor((dur / 31556926)) : "0";
					}else{
						pms.year=pms.month=pms.day=pms.hour=pms.mini=pms.sec="00";
						pms.hm = "000";
						return;
					}
					return pms;
		        },
		        ui: function(){
					if(o.hm){o.hm.html(f.dv().hm);}
					if(o.sec){o.sec.html(f.dv().sec);}
					if(o.mini){o.mini.html(f.dv().mini);}
					if(o.hour){o.hour.html(f.dv().hour);}
					if(o.day){o.day.html(f.dv().day);}
					if(o.month){o.month.html(f.dv().month);}
					if(o.year){o.year.html(f.dv().year);}
					setTimeout(f.ui, 1);
		        }
		    };
			f.ui();
		});
	},

	//实时时间显示
	clockTime: function(){
		this.each(function(){
		    var $this = $(this);
			var f = {
				tm: function(){
					var now = new Date();
					var year = now.getFullYear();
					var month = now.getMonth()+1;
					var date = now.getDate();
					var day = now.getDay();
					var hour = now.getHours();
					var minu = now.getMinutes();
					var sec = now.getSeconds();

					if(month<10){month="0"+month;}
					if(date<10){date="0"+date;}
					if(hour<10){hour="0"+hour;}
					if(minu<10){minu="0"+minu;}
					if(sec<10){sec="0"+sec;}

					var arr_week = new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
					var period;

					if (hour == 0) {
						period = "午夜";
					} else if (hour > 0 && hour < 6) {
						period = "零晨";
					} else if (hour > 6 && hour < 12) {
						period = "上午";
					} else if (hour == 12) {
						period = "正午";
					} else if (hour > 12 && hour < 18) {
						period = "下午";
					}else{
						period = "晚上";
					}

					var week = arr_week[day];
					var times = year + "年" + month + "月" + date + "日 " + period + " "+hour + ":" + minu + ":" + sec+"  " + week;
					return times;
				},

				ui: function(){
					setInterval(function(){
						$this.html(f.tm());
					},200);
				}
			};
			f.ui();
		});
	},

});
