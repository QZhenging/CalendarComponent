//日历构造函数
function Canlendar(JSON){
    //大盒子ID
    this.boxId = JSON["id"];
    //大盒子
    this.box =  document.getElementById(this.boxId);
    //输入框
    this.inputDOM = null;
    //小方框
    this.tds = null;
    //年份，初始值为今天的年份
    var today = new Date();
    this.year = today.getFullYear();
    //月份1、2、3、4、5、6、7、8、9、10、11、12
    this.month = today.getMonth() + 1;
    //日期
    this.date = today.getDate();
    //初始化
    this.init();
    //把绑定监听
    this.bindEvent();
    //调用显示今天的月份
    this.showDay(this.year , this.month , this.date);
}
//初始化
Canlendar.prototype.init = function(){
    //输入框
    this.inputDOM = document.createElement("input");
    this.inputDOM.type = "text";
    this.box.appendChild(this.inputDOM);
    //日历DIV
    this.canlendarDiv = document.createElement("div");
    this.canlendarDiv.className = "canlendarDiv";
    this.box.appendChild(this.canlendarDiv);
    this.canlendarDiv.style.display = "none";
    //年份的下拉选择框
    this.yearSelect = document.createElement("select");
    this.canlendarDiv.appendChild(this.yearSelect);
    //年份的选择option
    for(var i = 1995 ; i <= 2030 ; i++){
        var option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        this.yearSelect.appendChild(option);
    }
    //月份的下拉选择框
    this.monthSelect = document.createElement("select");
    this.canlendarDiv.appendChild(this.monthSelect);
    //月份的选择option
    var marr = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
    for(var i = 0 ; i < 12 ; i++){
        var option = document.createElement("option");
        option.value = i + 1;
        option.innerHTML = marr[i];
        this.monthSelect.appendChild(option);
    }
    //表格
    this.tableDOM = document.createElement("table");
    this.canlendarDiv.appendChild(this.tableDOM);
    //表头的创建
    var tr = document.createElement("tr");
    this.tableDOM.appendChild(tr);
    var arr = ["日","一","二","三","四","五","六"];
    for(var i = 0 ; i < 7 ; i++){
        var th = document.createElement("th");
        th.innerHTML = arr[i];
        tr.appendChild(th);
    }
    //行和列的创建
    for(var i = 0 ; i < 6 ; i++){
        var tr = document.createElement("tr");
        for(var j = 0 ; j < 7 ; j++){
            var td = document.createElement("td");
            tr.appendChild(td);
        }
        this.tableDOM.appendChild(tr);
    }
    //得到td
    this.tds = this.tableDOM.getElementsByTagName("td");

}

//显示月份
Canlendar.prototype.showDay = function(year,month,date){
    
    //更改信号量
    this.year = year;
    this.month = month;
    date && (this.date = date);
    //改变下拉选择框的数值
    this.yearSelect.value = year;
    this.monthSelect.value = month;

    //本月总天数
    var thisMonthDateAmount = this.thisMonthDateAmount = (function(){
        switch (month){
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
                break;
            case 4 :
            case 6 :
            case 9 :
            case 11 :
                return 30;
                break;
            case 2:
                if(year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)){
                    return 29;
                }
                return 28;
                break;
        }
    })();

    //上一个月的最后一天
    var lastMonthlastDate = this.lastMonthlastDate =  (new Date(new Date(year,month-1,1) - 1)).getDate();

    //本月1日星期几
    var thisMonthFirstDateDay = this.thisMonthFirstDateDay = (new Date(year,month-1,1)).getDay();

    //验收，如果1号恰好是星期0，此时修改为星期7 看仔细，此时改的不是this中的属性，而是局部变量！
    if(thisMonthFirstDateDay === 0) thisMonthFirstDateDay = 7;

    //改变42个小方块里面的数字。上个月剩余的：
    for(var i = 0 ; i < thisMonthFirstDateDay ; i++){
        this.tds[i].innerHTML = i + lastMonthlastDate - thisMonthFirstDateDay + 1;
        this.tds[i].className = "gray";
    }
    //本月的：
    for(var i = thisMonthFirstDateDay ; i < thisMonthDateAmount + thisMonthFirstDateDay ; i++){
        this.tds[i].innerHTML = i - thisMonthFirstDateDay + 1;
        this.tds[i].className = "";
    }
    //下个月的开头
    for(var i = thisMonthDateAmount + thisMonthFirstDateDay ; i < 42 ; i++){
        this.tds[i].innerHTML = i - thisMonthDateAmount - thisMonthFirstDateDay + 1;
        this.tds[i].className = "gray";
    }


    //如果调用函数的时候指定了日子，则让指定的日子变蓝色，同时文本框显示结果
    if(date != undefined){
        this.tds[date + thisMonthFirstDateDay - 1].className = "choose";
        this.inputDOM.value = this.year + "-" + this.month + "-" + this.date;
    }
     
}

//绑定事件监听
Canlendar.prototype.bindEvent = function(){
    var self = this;
    //当用户直接输入年月日的时候，我们用正则提炼年、月、日，实时改变日历
    this.inputDOM.oninput = function(){
        //得到值
        var v = this.value;
        //提炼
        var result = v.match(/(\d+)-(\d+)-(\d+)/);
        if(result){
            var y = parseInt(result[1]);
            var m = parseInt(result[2]);
            var d = parseInt(result[3]);
            if(y >= 1995 && y <= 2030 && m >= 1 && m <= 12 && d >= 1 && d <= 31){
                self.showDay(y,m,d);
            }
        } 
    }
    //输入框得到焦点，显示控件
    this.inputDOM.onfocus = function(){
        self.canlendarDiv.style.display = "block";
    }

    //在其他区域点击的时候，收起日历
    if(document.addEventListener){
         document.addEventListener("click", function(event){
            if(event.target != self.inputDOM && event.target.nodeName.toLowerCase() != "td" && event.target != self.yearSelect && event.target != self.monthSelect){
                self.canlendarDiv.style.display = "none";
            }
        }, false);
     }else{
        document.attachEvent("onclick", function(){
            var event = window.event;
             if(event.srcElement != self.inputDOM && event.srcElement.nodeName.toLowerCase() != "td" && event.srcElement != self.yearSelect && event.srcElement != self.monthSelect){
                self.canlendarDiv.style.display = "none";
            }
        });
     }
       

    //当更改年份下拉框的时候做的事情
    this.yearSelect.onchange = function(){
        self.inputDOM.value = "";
        self.showDay(parseInt(this.value) , parseInt(self.monthSelect.value));
    }
    //当更改月份下拉框的时候做的事情
    this.monthSelect.onchange = function(){
        self.inputDOM.value = "";
        self.showDay(parseInt(self.yearSelect.value) , parseInt(this.value));
    }
    //点击日期进行选择
    for(var i = 0 ; i < this.tds.length ; i++){
        (function(i){
            self.tds[i].onclick = function(){
                //点击的时候先判定点击的这个td是本月的还是上月的还是下月的！
                //因为如果本月第一天是周日，此时已经在showDay函数中补充了一个行，此时我们这里也要相应进行修正：
                var mfd = self.thisMonthFirstDateDay == 0 ? 7 : self.thisMonthFirstDateDay;
                if(i < mfd){
                    //点击上一个月
                    var d = self.lastMonthlastDate - (mfd - i) + 1;
                     
                    if(self.month - 1 >= 1){
                        var m = self.month - 1;
                        var y = self.year;
                    }else{
                        var m = 12;
                        var y = self.year - 1;
                    }
                    self.showDay(y,m,d);
                }else if(i < mfd + self.thisMonthDateAmount){
                    
                    //点击本月
                    self.showDay(self.year,self.month,i - mfd + 1);
                }else{
                    //点击下一个月的日子，此时月份要加1，遇见跨年年份还要加1 
                    var d = i - (mfd + self.thisMonthDateAmount) + 1;
                    if(self.month + 1 <= 12){
                        var m = self.month + 1;
                        var y = self.year;
                    }else{
                        var m = 1;
                        var y = self.year + 1;
                    }
                    self.showDay(y,m,d);
                }

                
                return false;
            }
        })(i);
    }
}