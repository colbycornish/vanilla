// TODO : Figure out why this is an issue: ReferenceError: MessageFormat is not defined

'use strict';

describe.skip('Service: themeSettings', function() {

	// load the service's module
	beforeEach(module('methodApp'));

	// instantiate service
	var themeSettings;
	beforeEach(inject(function(_themeSettings_) {
		themeSettings = _themeSettings_;
	}));

	it('should do something', function() {
		expect(!!themeSettings).toBe(true);
	});

});
