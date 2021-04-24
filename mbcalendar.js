class MBCalendar {

	constructor(object) {
		
		if(object.labels !== undefined ){
			if(object.labels.months === undefined )
				this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			else this.months = object.labels.months;
			if(object.labels.days === undefined ) 
				this.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
			else this.days = object.labels.days;
			if(object.labels.days === undefined ) 
				this.labelToday = "Today";
			else this.labelToday = object.labels.today;
		}
		this.objToday = this.getToday(object.today);
		this.ajaxUrl = object.ajax.url;
		this.ajaxToken = object.ajax.csrToken;
		this.element = object.element;
		this.startDay = 0;
		if(object.startMonday !== undefined )
			this.startDay = object.startMonday;

		this.initialize(this.objToday.year, this.objToday.month);
	}

	initialize(year, month){
		var curmonth = this.getMonth(year, month);
		var premonth = this.getAdjacentMonth(year, month, -1);
		var nexmonth = this.getAdjacentMonth(year, month, +1);		
		this.currentMonth = curmonth;
		this.precedentMonth = premonth;
		this.nextMonth = nexmonth;

		var interval = this.getInterval(curmonth, premonth, nexmonth);
		this.getCalendar(interval);

		this.executeAjaxRequest(interval, this.addInfo);
	}

	getToday(today){
		if(today === undefined ){
			today = new Date();
			var dd = String(today.getDate()).padStart(2, '0');
			var mm = String(today.getMonth() + 1).padStart(2, '0');
			var yyyy = today.getFullYear();
			return {
				day: dd,
				month: mm,
				year: yyyy
			}
		} else return {
			day: today.split("-")[2],
			month: today.split("-")[1],
			year: today.split("-")[0]
		}
	}

	getMonth(year, month){
		return {
			year: year,
			month: month,
			lastDay: new Date(year, month, 0).getDate(),
			firstDay: new Date(year, month-1, 1).getDay()
		}
	}

	getAdjacentMonth(year, month, sum){
		var x = new Date(year, month-1, 1);
		x.setMonth(x.getMonth() + sum);
		var newmonth = String(x.getMonth() + 1).padStart(2, '0');
		var newyear = x.getFullYear();

		return this.getMonth(newyear, newmonth);
	}

	getInterval(curmonth, premonth, nexmonth){
		var from;
		var to;
		if(curmonth.firstDay > 0)
			from = premonth.lastDay - (curmonth.firstDay - 1) + this.startDay;
		else from = premonth.lastDay - 6 + this.startDay;

		to = 42 - (premonth.lastDay - from + 1 + curmonth.lastDay);			

		return {
			from: {
				day: from,
				month: premonth.month,
				year: premonth.year,
				numberDays: premonth.lastDay - from + 1
			},
			to: {
				day: to,
				month: nexmonth.month,
				year: nexmonth.year,
				numberDays: to
			}
		}
	}

	executeAjaxRequest(interval, cFunction){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				if(this.responseText !== undefined)
					cFunction(JSON.parse(this.responseText));
			}
		};
		xhttp.open("GET", this.ajaxUrl, true);
		xhttp.send();
	}

	getCalendar(interval){
		var main = document.createElement("div");
		main.classList.add("mbcalendar");
		var header = document.createElement("div");
		header.classList.add("mbheader");
		var pagination = document.createElement("div");
		pagination.classList.add("mbpagination");		
		var prev = document.createElement("button");
		prev.classList.add("mbprev-button");
		prev.classList.add("mbpag");
		prev.innerHTML = "<";
		prev.addEventListener("click", (e) => { e.preventDefault(); this.initialize(this.precedentMonth.year, this.precedentMonth.month); } );
		var next = document.createElement("button");
		next.classList.add("mbnext-button");
		next.classList.add("mbpag");
		next.innerHTML = ">";
		next.addEventListener("click", (e) => { e.preventDefault(); this.initialize(this.nextMonth.year, this.nextMonth.month); } );
		header.appendChild(pagination);
		var todaybutton = document.createElement("button");
		todaybutton.classList.add("mbtoday-button");
		if(this.objToday.year == this.currentMonth.year && this.objToday.month == this.currentMonth.month)
			todaybutton.classList.add("disabled");
		todaybutton.innerHTML = this.labelToday;
		todaybutton.addEventListener("click", (e) => { e.preventDefault(); this.initialize(this.objToday.year, this.objToday.month); } );
		pagination.appendChild(prev);
		pagination.appendChild(next);
		pagination.appendChild(todaybutton);
		var title = document.createElement("p");
		title.classList.add("mbtitle");
		title.innerHTML = this.months[parseInt(this.currentMonth.month)-1]+" "+this.currentMonth.year;
		header.appendChild(title);
		main.appendChild(header);

		var month = document.createElement("table");
		month.classList.add("mb-month");

		if(this.startDay == 0) {
			var thf = document.createElement("th");	
			thf.innerHTML = this.days[0];		
			month.appendChild(thf);			
		}
		var th = document.createElement("th");
		th.innerHTML = this.days[1];		
		month.appendChild(th);
		th = document.createElement("th");	
		th.innerHTML = this.days[2];		
		month.appendChild(th);
		th = document.createElement("th");	
		th.innerHTML = this.days[3];		
		month.appendChild(th);
		th = document.createElement("th");	
		th.innerHTML = this.days[4];		
		month.appendChild(th);
		th = document.createElement("th");	
		th.innerHTML = this.days[5];		
		month.appendChild(th);
		th = document.createElement("th");	
		th.innerHTML = this.days[6];		
		month.appendChild(th);
		if(this.startDay == 1) {
			th = document.createElement("th");	
			th.innerHTML = this.days[0];		
			month.appendChild(th);			
		}

		
		var i=1;
		var start = interval.from.day;
		while(start<interval.from.day+interval.from.numberDays){		
			if(i%7 == 1){
				var tr = document.createElement("tr");			
				month.appendChild(tr);
			}
			this.getCalendarSupport(start, tr, "mb-month-prec", interval.from.year+"-"+interval.from.month);
			start++;
			i++;
		}
		start = 1;
		while(start<=this.currentMonth.lastDay){		
			if(i%7 == 1){
				var tr = document.createElement("tr");			
				month.appendChild(tr);
			}
			this.getCalendarSupport(start, tr, "mb-month-current", this.currentMonth.year+"-"+this.currentMonth.month);
			start++;
			i++;
		}
		var start = 1;
		while(start<=interval.to.day){		
			if(i%7 == 1){
				var tr = document.createElement("tr");			
				month.appendChild(tr);
			}
			this.getCalendarSupport(start, tr, "mb-month-next", interval.to.year+"-"+interval.to.month);
			start++;
			i++;
		}

		main.appendChild(month);
		
		this.element.innerHTML = "";
		this.element.appendChild(main);
	}

	getCalendarSupport(start, tr, classname, date){
		var day = document.createElement("td");
		day.classList.add("mb-day");
		day.classList.add(classname);
		day.setAttribute("data-date", date+"-"+("0" + start).slice(-2));

		if(this.objToday.year+"-"+this.objToday.month+"-"+this.objToday.day == date+"-"+("0" + start).slice(-2))
			day.classList.add("mb-today");
	
		var numberDayDiv = document.createElement("div");
		numberDayDiv.classList.add("mb-day-top");
		var numberDayA = document.createElement("a");
		numberDayA.classList.add("mb-day-link");
		numberDayA.innerHTML = start;
		numberDayDiv.appendChild(numberDayA);
		day.appendChild(numberDayDiv);
		tr.appendChild(day);
	}

	addInfo(list){

		for(var i = 0; i<list.length;i++){
			var start = new Date(list[i].checkin);
			var dd = String(start.getDate()).padStart(2, '0');
			var mm = String(start.getMonth() + 1).padStart(2, '0');
			var yyyy = start.getFullYear();
			var x = document.querySelector(".mb-day[data-date='"+yyyy+"-"+mm+"-"+dd+"']");
			var book = document.createElement("div");
			var p = document.createElement("p");
			p.innerHTML = list[i].title;
			book.classList.add("mbbook");
			book.classList.add("mbbook-start");
			book.appendChild(p);
			x.appendChild(book);

			var current = new Date(list[i].checkin);
			current.setDate(current.getDate() + 1);
			var end = new Date(list[i].checkout);
			while(current < end){	
				book.classList.add("mbbook-isprec");		
				var dd = String(current.getDate()).padStart(2, '0');
				var mm = String(current.getMonth() + 1).padStart(2, '0');
				var yyyy = current.getFullYear();
				var x = document.querySelector(".mb-day[data-date='"+yyyy+"-"+mm+"-"+dd+"']");
				var book = document.createElement("div");
				book.classList.add("mbbook");
				x.appendChild(book);
				current.setDate(current.getDate() + 1);
			}
			book.classList.add("mbbook-end");
		}
	}


}