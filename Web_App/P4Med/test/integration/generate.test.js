describe('API and adapter generators', function () {
	
	var assert = require('assert');
	var fs = require('fs');
	var wrench = require('wrench');
	var exec = require('child_process').exec;

	// Make existsSync not crash on older versions of Node
	fs.existsSync = fs.existsSync || require('path').existsSync;

	function capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	var sailsBin = './bin/sails.js';
	var appName = 'testApp';

	this.slow(1000);
	
	before(function(done) {

		if (fs.existsSync(appName)) {
			wrench.rmdirSyncRecursive(appName);
		}

		exec(sailsBin + ' new ' + appName, function (err) {
			if (err) done(new Error(err));

			// Move into app directory and update sailsBin relative path
			process.chdir(appName);
			sailsBin = '.' + sailsBin;

			done();
		});
	});

	after(function(done) {

		// return to test directory
		process.chdir('../');

		if (fs.existsSync(appName)) {
			wrench.rmdirSyncRecursive(appName);
		}

		done();
	});

	describe('sails generate model <modelname>', function () {
		var modelName = 'user';

		it('should throw an error if no model name is specified', function(done) {

			exec(sailsBin + ' generate model', function (err) {
				assert.equal(err.code, 1);
				done();
			});
		});

		it('should create a model file in models folder', function(done) {

			exec(sailsBin + ' generate model ' + modelName , function (err) {
				if (err) done(new Error(err));

				assert.doesNotThrow(function() {
					fs.readFileSync('./api/models/' + capitalize(modelName) + '.js', 'utf8');
				});

				done();
			});
		});

		it('should throw an error if a model with the same name exists', function(done) {

			exec(sailsBin + ' generate model ' + modelName , function (err) {
				assert.equal(err.code, 1);
				done();
			});
		});
	});

	describe('sails generate controller <controllerName>', function () {
		var controllerName = 'user';

		it('should throw an error if no controller name is specified', function(done) {

			exec(sailsBin + ' generate controller', function (err) {
				assert.equal(err.code, 1);
				done();
			});
		});

		it('should create a controller file in controllers folder', function(done) {

			exec(sailsBin + ' generate controller ' + controllerName , function (err) {
				if (err) done(new Error(err));

				assert.doesNotThrow(function() {
					fs.readFileSync('./api/controllers/' + capitalize(controllerName) + 'Controller.js', 'utf8');
				});

				done();
			});
		});

		it('should throw an error if a controller with the same name exists', function(done) {

			exec(sailsBin + ' generate controller ' + controllerName , function (err) {
				assert.equal(err.code, 1);
				done();
			});
		});
	});

	describe('sails generate adapter <modelname>', function () {
		var adapterName = 'mongo';

		it('should throw an error if no adapter name is specified', function(done) {

			exec(sailsBin + ' generate adapter', function (err) {
				assert.equal(err.code, 1);
				done();
			});
		});

		it('should create a adapter file in adapters folder', function(done) {

			exec(sailsBin + ' generate adapter ' + adapterName , function (err) {
				if (err) done(new Error(err));

				assert.doesNotThrow(function() {
					fs.readFileSync('./api/adapters/' + adapterName + '/lib/adapter.js', 'utf8');
				});

				done();
			});
		});

		it('should throw an error if an adapter with the same name exists', function(done) {

			exec(sailsBin + ' generate adapter ' + adapterName , function (err) {
				assert.equal(err.code, 1);
				done();
			});
		});
	});

	describe('sails generate', function () {
		var modelName = 'post';

		it('should display usage if no generator name is specified', function(done) {

			exec(sailsBin + ' generate', function (err, dumb, response) {
				assert.notEqual(response.indexOf('Usage'), -1);
				done();
			});
		});

	});

	describe('sails generate api <apiname>', function () {	

		var apiName = 'foo';

		it('should display usage if no api name is specified', function(done) {

			exec(sailsBin + ' generate api', function (err, dumb, response) {
				assert.notEqual(response.indexOf('Usage'), -1);
				done();
			});
		});

		it('should create a controller and a model file', function(done) {

			exec(sailsBin + ' generate api ' + apiName , function (err) {
				if (err) done(new Error(err));

				assert.doesNotThrow(function() {
					fs.readFileSync('./api/models/' + capitalize(apiName) + '.js', 'utf8');
				});

				assert.doesNotThrow(function() {
					fs.readFileSync('./api/controllers/' + capitalize(apiName) + 'Controller.js', 'utf8');
				});

				done();
			});
		});

		it('should throw an error if a controller file and model file with the same name exists', function(done) {

			exec(sailsBin + ' generate api ' + apiName , function (err) {
				assert.equal(err.code, 1);
				done();
			});
		});
	});
});
