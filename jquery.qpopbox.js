	(function($)
	{
			
			var  defaultoptions = {
				  selector      : this.selector
			};
			var plugname="qpopbox";
			
			$.fn[plugname]=function()
			{
				var isMethodCall=arguments.length>0 && typeof arguments[0] === "string";
				if(isMethodCall)
				{
					//
					var methodname=arguments[0];
					var args = Array.prototype.slice.call(arguments,1);
					this.each(function() {
						var instance = $.data( this,plugname);
						if(instance && $.isFunction( instance[methodname] ))
						{
							var method=instance[methodname];
							method.apply(instance,args);
						}
					});
				}else{
					var inputoptions = arguments;
					$(this).each(
							function ()
							{
								var optionsnew = $.extend( {}, defaultoptions);
								if(inputoptions.length>0)
								{
										optionsnew=$.extend(optionsnew,inputoptions[0]);
								}
								var instance=$(this).data(plugname);
								if(instance)
								{
									instance.init(optionsnew);
								}else
								{
									var target=$(this);
									instance=new PluginObject(target);
									instance.init(optionsnew);
									$(this).data(plugname,instance);
								}
							}
						);
						return this;
				};
			}
			
			function PluginObject(target)
			{
					this.options;
					this.wrapdiv;
					this.shandowdiv;
					this.render=function()
					{
						this.shandowdiv=$('<div class="shandowdiv" style="background: none repeat scroll 0% 0% rgb(66, 66, 66); opacity: 0.6;">')
						this.options.messagebox.addClass("messagebox");
						$(document.body).append(this.shandowdiv);
					};
					
					this.show=function()
					{
						//47  18030418382
						/*
						 * target      left  top width height;
						 * shandowdiv  left=(target.offset.left 如果target是window则为0)  top=(target.offset.left 如果target是window则为0) width=(target.width) height=(target.height)  position=absolute;
						 * messagebox  1.如果target不是widnow left=( target.offset().left+((target.width-width)/2) )  top=(target.offset.top+(target.height-messagebox.height)/2 ) width height position=absolute;
						 *             2.如果target是widnow   left=(window.innerWidth-width)/2   top=(window.innerHeight-height)/2   width height   position=fiexd;
						 */
						
						
				        var iswin=$.isWindow(target.get(0));
				        if(iswin)
				        {
				        	var winwidth=0;
					        var winheight=0;
				        	winwidth=window.innerWidth!=null?window.innerWidth:document.documentElement&&document.documentElement.clientWidth?document.documentElement.clientWidth:document.body!=null?document.body.clientWidth:null;
				        	winheight=window.innerHeight!=null?window.innerHeight:document.documentElement&&document.documentElement.clientHeight?document.documentElement.clientHeight:document.body!=null?document.body.clientHeight:null;
				        	this.shandowdiv.css(
					        		{
										'position':'fixed',
										'width':target.width()+'px',
										'height':target.height()+'px',
										'top':"0px",
										'left':"0px"
									}
					        );
				        	this.options.messagebox.css({
				        		"position":"fixed",
				        		"left":((winwidth-this.options.messagebox.width())/2)+"px",
				        		"top":((winheight-this.options.messagebox.height())/2)+"px",
				        	});
				        }
				        else
				        {
				        	this.shandowdiv.css(
					        		{
										'position':'absolute',
										'width':target.width()+'px',
										'height':target.height()+'px',
										'top':target.offset().top+"px",
										'left':target.offset().left+"px"
									}
					        );
				        	this.options.messagebox.css(
									{
										'position':'absolute',
										'top':( target.offset().left+((target.width()-this.options.messagebox.width())/2) ) +"px",
										'left':( target.offset().top+((target.height()-this.options.messagebox.height())/2) ) +"px"
									}
							);
				        }
						this.shandowdiv.show();
						this.options.messagebox.show();
					};
					
					this.hide=function()
					{
						this.shandowdiv.hide();
						this.options.messagebox.hide();
					};
					this.save=function()
					{
						this.hide();
						if(typeof this.options.save =='function' )
						{
							this.options.save.apply(this);
						}
					};
					this.close=function()
					{
						this.hide();
						if(typeof this.options.close =='function' )
						{
							this.options.close.apply(this);
						}
					};
					this.init=function(initoptions)
					{
						this.options=initoptions;
						this.render();
						this.hide();
						this.options.messagebox.find(".dosubmit").on("click",$.proxy(this.save,this));
						this.options.messagebox.find(".doelse").on("click",$.proxy(this.close,this));//.btn.btn-default
					};
			}
	}
	)(jQuery);