var touchDB = function (docSchema) {
	this.docName = docSchema;
	this.docSchema = null;
	this.dbSchema = null;
	this.require('../js/config.js');
	this.require('../js/libs/pouchdb-3.0.6.min.js');
	this.createPouchDB();
};
touchDB.prototype.getSchema = function () {
	_this = this;
	this.dbSchema.get(this.docName).then(function(doc) { 
		_this.docSchema = doc;
	}).catch(function (err) {
		console.log(err);
	});
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
}
touchDB.prototype.remoteCouchDB = function () {
	var opts = { live: true };
	for (var i = 0; i < couchDB_servers.length; i++) {
		this.dbSchema.sync(couchDB_servers[i]+'/'+schema_database, opts);
	};
};
touchDB.prototype.createPouchDB = function () {
	this.dbSchema = new PouchDB(schema_database);
	if(couchDB_servers.length>0) {
		this.remoteCouchDB();
	}
	this.getSchema();
};