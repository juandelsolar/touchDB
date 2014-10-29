var touchDB = function (doc_schema) {
	this.doc_schema = doc_schema;
	this.db = null;
	this.require('../js/config.js');
	this.require('../js/libs/pouchdb-3.0.6.min.js');
	this.createPouchDB();
};
touchDB.prototype.getSchema = function () {
	return this.doc_schema;	
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
                    console.log("script loaded: ", url);
                    break;
                default:
                    console.log("ERROR: script not loaded: ", url);
            }
        }
    };
    ajax.send(null);
}
touchDB.prototype.loadConfig = function () {
	console.log('config loaded!');
};
touchDB.prototype.remoteCouchDB = function () {
	console.log('remote conecting...');
};
touchDB.prototype.createPouchDB = function () {
	this.db = new PouchDB(schema_database);
	if(couchDB_servers.length>0) {
		this.remoteCouchDB();
	}
};