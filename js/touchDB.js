var touchDB = function (docSchema) {
	this.docSchema = docSchema;
	this.dbSchema = null;
	this.require('../js/config.js');
	this.require('../js/libs/pouchdb-3.0.6.min.js');
	this.createPouchDB();
};
touchDB.prototype.getSchema = function () {
	return eval(this.dbSchema.get(this.docSchema, function(err, doc) { }));	
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
};