window.onload = function() {
	var socket = io.connect('http://localhost:3700');
	socket.on('message', presentation);
}

function collapseall() {
	$('#messagestable td:first-child').each(function() {
		var id = $(this).attr('id');
		if (typeof id != 'undefined') {
			console.log(id);
			$(this).hide();
		}
	});
}

function show_data_entry(name, value) {
	return '<h1>' + name + '</h1> <p>'+ value + '</p>'
}

function formattime(time){
	hh = time.getHours();
	mm = time.getMinutes();
	ss = time.getSeconds();

	time = hh + ':' + mm + ':' + ss;
	return time; 
}

var create_header_row = function (headermessage) {
	var line = "";
	var d = new Date();
	var n = formattime(d);
	line += "<td>" + headermessage['id'] + "</td>";
	line += "<td> " + n + "</td>";
	line += "<td>" + headermessage['ipsrc'] + "</td>";
	line += "<td>" + headermessage['sender'] + "</td>";
	line += "<td>" + headermessage['receiver'] + "</td>";
	line += "<td>" + headermessage['message_name'] + "</td>";
	line += "<td>" + headermessage['type'] + "</td>";
	return line;
}

var get_div_content = function(message) {
	var p = $(document.createElement('div'));
	p.addClass("col-md-12");
	var block2;

	$(p).append(block2);

	return p;
}

var presentation = function (data) {
	$(document).ready(function() {
		var content = get_div_content(data.message);

		var newRow = '<tr id=' + data.id + '>' + create_header_row(data) + '</tr>';
		var hidden_td = '<td style="display: none;" id=h'+ data.id + ' colspan="7"> </td>';
		var hidden_row = '<tr>'+ hidden_td +'</tr>';

		newRow += hidden_row;

		$(newRow).hide().prependTo('#messagestable tbody:first').fadeIn("slow");

		console.log(newRow);

		var row = $('#'+data.id);
		var hidden_row = $('#h'+data.id);
		$(hidden_row).append(content);

		$(row).click( function () {
			$(hidden_row).animate( {
				height: "toggle"
			}, "fast", function () { });
		});

	});
}
