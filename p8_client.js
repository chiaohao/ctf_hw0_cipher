var Netcat = require('node-netcat');
var md5 = require('js-md5');
var client = Netcat.client(10124, 'csie.ctf.tw');

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

var formReturnChar = {'a':'z', 'b':'y', 'c':'x', 'd':'w', 'e':'v', 'f':'u', 'g':'t', 'h':'s', 'i':'r', 'j':'q', 'k':'p', 'l':'o', 'm':'n', 'n':'m', 'o':'l', 'p':'k', 'q':'j', 'r':'i', 's':'h', 't':'g', 'u':'f', 'v':'e', 'w':'d', 'x':'c', 'y':'b', 'z':'a', 'A':'Z', 'B':'Y', 'C':'X', 'D':'W', 'E':'V', 'F':'U', 'G':'T', 'H':'S', 'I':'R', 'J':'Q', 'K':'P', 'L':'O', 'M':'N', 'N':'M', 'O':'L', 'P':'K', 'Q':'J', 'R':'I', 'S':'H', 'T':'G', 'U':'F', 'V':'E', 'W':'D', 'X':'C', 'Y':'B', 'Z':'A'}

function hexToASCII(inputString, callback){
	var str = '';
	for(var i = 0;i < inputString.length;i += 2)
		str += String.fromCharCode(parseInt(inputString.substr(i, 2), 16));
	callback(str);
}

function charReturn(inputString, callback){
	var str = '';
	for(var i = 0;i < inputString.length;i++){
		if(formReturnChar[inputString.substring(i, i+1)]!=undefined)
			str += formReturnChar[inputString.substring(i, i+1)];
		else
			str += inputString.substring(i, i+1);
	}
	callback(str);
}

function generateRandomChar20(){
	var text = '';
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";

    for(var i = 0;i < 20;i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var count = 0;

client.on('open', function(){
	console.log('*****start*****')
});

client.on('data', function(data){
	count+=1;
	console.log(count);
	var s = data.toString('ascii');
	console.log(s);
	//STAGE0
	if(count==4 || count==5 || count==7){
		if(count==4 || count==7)
			var s_ = s.substring(s.indexOf('Round')+9, s.length-1);
		else
			var s_ = s.substring(s.indexOf('Round')+9);
		console.log(s_);
//		console.log(hexToASCII(s_));
		hexToASCII(s_, function(str){
			console.log(str);
			client.send(str+'\n');
		});
	}
	//STAGE1
	if(count==11 || count==12 || count==14){
		if(count==11 || count==14)
			var s_ = s.substring(s.indexOf('Round')+9, s.length-1);
		else
			var s_ = s.substring(s.indexOf('Round')+9);
		console.log(s_);
		console.log(Base64.decode(s_));
		client.send(Base64.decode(s_)+'\n');
	}
	//STAGE2
	if(count==18){
		var s_ = s.substring(s.indexOf('c1')+5, s.indexOf('What is'));
		console.log(s_);
		charReturn(s_, function(str){
			console.log(str);
			client.send(str);
		});	
	}
	//STAGE3
	if(count==22){
		var m0 = s.substring(s.indexOf('m0 =')+5, s.indexOf('m0 =')+10);
		var c0 = s.substring(s.indexOf('c0 =')+5, s.indexOf('c0 =')+10);
		for(var i = 0;i < m0.length;i++){
			if(formReturnChar[m0.substring(i, i+1)]!=undefined){
				var dif = parseInt(m0.charCodeAt(0), 10)-parseInt(c0.charCodeAt(0),10);
				break;
			}
		}
		var c1 = s.substring(s.indexOf('c1 =')+5, s.indexOf('\nWhat is'));
		var str = '';
		for(var i = 0;i < c1.length;i++){
			if(formReturnChar[c1.substring(i, i+1)]!=undefined){
				var origin = c1.substring(i, i+1).charCodeAt(0);
				if(origin>=65 && origin <=90){
					if(origin + dif > 90)
						var after = origin + dif - 26;
					else if(origin + dif < 65)
						var after = origin + dif + 26;
					else
						var after = origin + dif;
				}
				if(origin>=97 && origin <=122){
					if(origin + dif > 122)
						var after = origin + dif - 26;
					else if(origin + dif < 97)
						var after = origin + dif + 26;
					else
						var after = origin + dif;
				}
				str += String.fromCharCode(parseInt(after, 10));
			}
			else
				str += c1.substring(i, i+1);
		}

		console.log(str);
		client.send(str + '\n');
	}
	//STAGE4
	if(count==26){
		var m0 = s.substring(s.indexOf('m0 =') + 5, s.indexOf('\c0 ='));
		var c0 = s.substring(s.indexOf('c0 =') + 5, s.indexOf('\n\n'));
		var c1 = s.substring(s.indexOf('c1 =') + 5, s.indexOf('\nWhat is'));
		var difarr = [];
		for(var i = 0;i < m0.length;i++){
			if(formReturnChar[m0.substring(i, i+1)]!=undefined){
				if(c0.charCodeAt(i) - m0.charCodeAt(i) < 0)
					difarr.push(c0.charCodeAt(i) - m0.charCodeAt(i) + 26);
				else
					difarr.push(c0.charCodeAt(i) - m0.charCodeAt(i));
			}
		}
		//console.log(difarr);
		var repeatedN;
		for(var i = 1;i < difarr.length;i++){
			repeatedN = i;
			var isRepeated = true;
			var subarr = difarr.slice(0, i);
			for(var j = 0;j < difarr.length;j += i){
				for(var k = 0;k < i;k++){
					if(difarr[j+k]!=subarr[k]){
						isRepeated = false;
						break;
					}
				}
				if(!isRepeated)
					break;
			}
			if(isRepeated)
				break;
		}
		//console.log(repeatedN);
		var repeatedArr = difarr.slice(0, repeatedN);
		var str = '';
		var n = 0;
		for(var i = 0;i < c1.length;i++){
			if(formReturnChar[c1.substring(i, i+1)]!=undefined){
				var origin = c1.substring(i, i+1).charCodeAt(0);
				if(origin>=65 && origin<=90){
					if(origin - repeatedArr[n] < 65)
						var after = origin - repeatedArr[n] + 26;
					else
						var after = origin - repeatedArr[n];
				}
				if(origin>=97 && origin<=122){
					if(origin - repeatedArr[n] < 97)
						var after = origin - repeatedArr[n] + 26;
					else
						var after = origin - repeatedArr[n];
				}
				str += String.fromCharCode(parseInt(after, 10));
				n = (n + 1) % repeatedArr.length;
			}
			else
				str += c1.substring(i, i+1);
		}
		console.log(str);
		client.send(str + '\n');
	}
	//STAGE5
	if(count==30){
		var m0 = s.substring(s.indexOf('m0 =') + 5, s.indexOf('\nc0 ='));
		var c0 = s.substring(s.indexOf('c0 =') + 5, s.indexOf('\nm1 ='));
		var m0CharCode = [];
		var c0CharCode = [];
		for(var i = 0;i < m0.length;i++)
			m0CharCode.push(m0.substring(i, i+1).charCodeAt(0));
//		console.log(m0CharCode);
		for(var i = 0;i < c0.length;i += 2)
				c0CharCode.push(parseInt(c0.substring(i, i+2), 16));
//		console.log(c0CharCode);
		var diff0 = [];
		for(var i = 0;i < m0CharCode.length;i++)
			diff0.push(c0CharCode[i] ^ m0CharCode[i]);
//		console.log(diff0);
/*
		var m1 = s.substring(s.indexOf('m1 =') + 5, s.indexOf('\nc1 ='));
		var c1 = s.substring(s.indexOf('c1 =') + 5, s.indexOf('\nm2 ='));
		var m1CharCode = [];
		var c1CharCode = [];
		for(var i = 0;i < m1.length;i++)
			m1CharCode.push(m1.substring(i, i+1).charCodeAt(0));
		for(var i = 0;i < c1.length;i += 2)
			c1CharCode.push(parseInt(c1.substring(i, i+2), 16));
		var diff1 = [];
		for(var i = 0;i < m1CharCode.length;i++)
			diff1.push(c1CharCode[i] ^ m1CharCode[i]);
		console.log(diff1);

		var m2 = s.substring(s.indexOf('m2 =') + 5, s.indexOf('\nc2 ='));
		var c2 = s.substring(s.indexOf('c2 =') + 5, s.indexOf('\n\n'));
		var m2CharCode = [];
		var c2CharCode = [];
		for(var i = 0;i < m2.length;i++)
			m2CharCode.push(m2.substring(i, i+1).charCodeAt(0));
		for(var i = 0;i < c2.length;i += 2)
			c2CharCode.push(parseInt(c2.substring(i, i+2), 16));
		var diff2 = [];
		for(var i = 0;i < m2CharCode.length;i++)
			diff2.push(c2CharCode[i] - m2CharCode[i]);
		console.log(diff2);
*/
		var c3 = s.substring(s.indexOf('c3 =') + 5, s.indexOf('\nWhat is'));
		var c3CharCode = [];
		var origin = [];
		for(var i = 0;i < c3.length;i += 2)
			c3CharCode.push(parseInt(c3.substring(i, i+2), 16));
		for(var i = 0;i < c3CharCode.length;i++)
			origin.push(c3CharCode[i] ^ diff0[i]);
		var str = '';
		for(var i = 0;i < origin.length;i++)
			str += String.fromCharCode(parseInt(origin[i], 10));
		console.log(str);
		client.send(str + '\n');
	}
	//STAGE6
	if(count==34){
		var m0 = s.substring(s.indexOf('m0 =') + 5, s.indexOf('\nc0 ='));
		var c0 = s.substring(s.indexOf('c0 =') + 5, s.indexOf('\n\n'));
		var c1 = s.substring(s.indexOf('c1 =') + 5, s.indexOf('\nWhat is'));
		var countOfLine;
		for(var i = 1;i < m0.length;i++){
			var m0Replace = '';
			for(var j = 0;j < i;j++){
				var index = j;
				while(index < m0.length){
					m0Replace += m0.substring(index, index+1);
					index += i;
				}
			}
			if(m0Replace == c0){
				countOfLine = i;
				break;
			}
		}
//		console.log(countOfLine);
		var str = '';
		var c = Math.floor(c1.length / countOfLine);
		var last = c1.length - c * countOfLine;
//		console.log(countOfLine + ', ' + c + ', ' + last);
		for(var i = 0;i < c;i++){
			var times = 0;
			var index = i;
			while(index < c1.length){
				str += c1.substring(index, index+1);
//				console.log(index);
				index += c;
				if(times < last)
					index++;
				times++;
			}
			if(i == c-1){
				var s = c;
				for(var j = 0;j < last;j++){
					str += c1.substring(s, s+1);
					s += (c + 1);
				}
			}
		}

		console.log(str);
		client.send(str + '\n');
	}
	//STAGE7
	if(count==38 || count==39 || count==41){
		if(count==38)
			var h = s.substring(s.indexOf('MD5(m) =') + 9, s.indexOf('\nWhat is m?'));
		else if(count==39 || count==41)
			var h = s.substring(s.indexOf('MD5(m) =') + 9);
		var isSuccess = false;
		while(!isSuccess){
			var input = generateRandomChar20();
			var test = md5(input);
//			console.log(test);
			if(test.substring(0, 4) == h.substring(0, 4))
				isSuccess = true;
		}
		console.log(input);
		client.send(input + '\n');
	}
});

client.on('error', function(err){
	console.log(err);
});

client.on('close', function(){
	console.log('*****close*****');
});

client.start();