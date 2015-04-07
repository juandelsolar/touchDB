var touchDB = function (docSchema) {
	this.docName = docSchema;
	this.docSchema = null;
	this.dbSchema = null;
	this.fields = null;
	this.fieldsOrder = [];
	this.require('../js/config.js');
	this.require('../js/libs/pouchdb-3.2.1.min.js');
	this.createPouchDB();
};
touchDB.prototype.getSchema = function () {
	var _this = this;
	this.dbSchema.get(this.docName).then(function(doc) {
		_this.setSchema(doc, doc.fields);
	}).catch(function (err) {
		console.log(err);
	});
};
touchDB.prototype.setSchema = function (schema, fields) {
	this.docSchema = schema;
	this.fields = fields;
	for(var field in fields) {
		this.fieldsOrder[fields[field].order]=field;
	}
};
touchDB.prototype.require = function (url) {
    var ajax = new XMLHttpRequest();
    ajax.open( 'GET', url, false );
    ajax.onreadystatechange = function () {
        var script = ajax.response || ajax.responseText;
        if (ajax.readyState === 4) {
            switch( ajax.status) {
                case 200:
                    eval.apply( window, [script] );
                    break;
                default:
                    console.log("ERROR: script not loaded: ", url);
            }
        }
    };
    ajax.send(null);
};
touchDB.prototype.remoteCouchDB = function () {
	var opts = { live: true };									//no funciona en sync :/
	for (var i = 0; i < couchDB_servers.length; i++) {
		var server = couchDB_servers[i]+'/'+schema_database;
		this.dbSchema.sync(server)
			.on('complete', function (info) {
				console.log(server, "Synced!");
			}).on('error', function (err) {
		    	console.log(server, "Error!", err);
		});
	};
};
touchDB.prototype.createPouchDB = function () {
	this.dbSchema = new PouchDB(schema_database);
	if(couchDB_servers.length>0) {
		this.remoteCouchDB();
	}
	this.getSchema();
};
touchDB.prototype.makeForm = function (domId, callback) {
	if(this.fields) {
		var form = document.createElement('form');
		form.name = 'form';
		form.action = '';
		form.onsubmit = function () {
			return false
		};
		var fields = this.fields;
		for(var i=0; i<this.fieldsOrder.length; i++) {
			div = document.createElement('div');
			if(fields[this.fieldsOrder[i]].type) {
				div.appendChild(this.makeDom(this.fieldsOrder[i], 'label', fields[this.fieldsOrder[i]]));
				div.appendChild(this.makeInput(this.fieldsOrder[i], fields[this.fieldsOrder[i]]));
			}
			form.appendChild(div);
		}
		button = form.appendChild(this.makeDom('Enviar', 'button'));
		button.onclick = function () {
			console.log('button pressed!');
		}
		if(domId) {
			document.getElementById(domId).appendChild(form);
		} else {
			return form;
		}
		if(callback) {
			callback();
		}
	} else {
		_this = this;
		setTimeout(function () {
			_this.makeForm(domId, callback);
		}, 10);
	}
};
touchDB.prototype.makeDom = function (field, type, attrs) {
	var dom = document.createElement(type);
	if(attrs) {
		if(attrs.hasOwnProperty('lang')) {
			var lang = attrs.lang;
			dom.innerHTML = lang[language][type];
		} else {
			dom.innerHTML = field;
		}
	} else {
		dom.innerHTML = field;
	}

	dom.name = field;
	dom.id = field;
	if(dom) {
		return dom;
	}
};
touchDB.prototype.makeInput = function (field, attrs) {
	var dom = null;
	var type = attrs.type;
	if(type==='text' || type==='range' || type==='date') {
		dom = document.createElement('input');
		dom.name = field;
		dom.id = field;
		dom.type = type;
		if(attrs.hasOwnProperty('lang')) {
			var lang = attrs.lang;
			if(lang[language]["placeholder"]) {
				dom.placeholder = lang[language]["placeholder"];
			}
		}
	}
	if(dom) {
		return dom;
	}
};