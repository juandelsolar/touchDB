var touchDB = function (docSchema) {
	this.docName = docSchema;
	this.docSchema = null;
	this.dbSchema = null;
	this.dbDocs = null;
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
		var serverSchema = couchDB_servers[i]+'/'+schema_database;
		this.dbSchema.sync(serverSchema, opts)
			.on('complete', function (info) {
				console.log(serverSchema, "Synced!");
			}).on('error', function (err) {
		    	console.log(serverSchema, "Error!", err);
		});
		var serverDocument = couchDB_servers[i]+'/'+document_database;
		this.dbDocs.sync(serverDocument, opts)
			.on('complete', function (info) {
				console.log(serverDocument, "Synced!");
			}).on('error', function (err) {
		    	console.log(serverDocument, "Error!", err);
		});
	};
};
touchDB.prototype.createPouchDB = function () {
	this.dbSchema = new PouchDB(schema_database);
	this.dbDocs = new PouchDB(document_database);
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
		var _this = this;
		button.onclick = function () {
			_this.saveData();
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

	dom.name = field+'_'+type;
	dom.id = field+'_'+type;
	if(dom) {
		return dom;
	}
};
touchDB.prototype.makeInput = function (field, attrs) {
	var dom = null;
	var type = attrs.type;
	if(type==='text' || type==='number' || type==='date') {
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
touchDB.prototype.saveData = function () {
	var values={};
	values['_id'] = new Date().toISOString();
	values['schema'] = this.docName;
	for(var i=0; i<this.fieldsOrder.length; i++) {
		value = document.getElementById(this.fieldsOrder[i]).value;
		values[this.fieldsOrder[i]]=value;
	}
	var json = JSON.parse(JSON.stringify(values));
	this.dbDocs.put(json).then(function (response) {
	  console.log('data saved!');
	}).catch(function (err) {
	  console.log(err);
	});
};