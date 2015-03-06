var touchDB = function (docSchema) {
	this.docName = docSchema;
	this.docSchema = null;
	this.dbSchema = null;
	this.fields = null;
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
touchDB.prototype.makeForm = function (domId) {
	if(this.fields) {
		var form = document.createElement('form');
		var fields = this.fields;
		for(var field in fields) {
			div = document.createElement('div');
			if(fields[field].type) {
				div.appendChild(this.makeDom(field, 'label', fields[field]));
				div.appendChild(this.makeInput(field, fields[field]));
			}
			form.appendChild(div);
		}
		form.appendChild(this.makeDom('Enviar', 'button'));
		if(domId) {
			document.getElementById(domId).appendChild(form);
		} else {
			return form;
		}
	} else {
		_this = this;
		setTimeout(function () {
			_this.makeForm(domId);
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
	if(type==='text' || type==='range') {
		dom = document.createElement('input');
		dom.name = field;
		dom.id = field;
		dom.type = type;
	}
	if(dom) {
		return dom;
	}
};