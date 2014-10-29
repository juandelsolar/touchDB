var touchDB = function (doc_schema) {
	this.doc_schema = doc_schema;
	this.db = null;
	this.loadScript('../js/config.js', this.loadConfig);
	this.loadScript('../js/libs/pouchdb-3.0.6.min.js', this.createPouchDB);
};
touchDB.prototype.getSchema = function () {
	return this.doc_schema;	
};
touchDB.prototype.loadScript = function (url, callback)
{
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    head.appendChild(script);
};
touchDB.prototype.loadConfig = function () {
	console.log('config loaded!');
};
touchDB.prototype.remoteCouchDB = function () {
	console.log('remote conecting...');
};
touchDB.prototype.createPouchDB = function () {
	this.db = new PouchDB(schema_database);
	if(couchDB_servers.length>0) {
		//this.remoteCouchDB();
		console.log(this);
	}
};