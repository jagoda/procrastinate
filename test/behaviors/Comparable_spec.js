var Comparable = require('../../lib/behaviors/Comparable');


describe("A Comparable object", function () {

  var comparable;
  
  beforeEach(function () {
    comparable = new Comparable();
    
    comparable.valueOf = function () { return 5; };
  });
  
  it("can test for equality", function () {
    expect(comparable.equalTo(comparable)).toBe(true);
    expect(comparable.equalTo({})).toBe(false);
    
    expect(comparable.equalTo(5)).toBe(true);
    expect(comparable.equalTo('five')).toBe(false);
  });
  
  it("can test for inequality", function () {
    expect(comparable.not().equalTo(comparable)).toBe(false);
    expect(comparable.not().equalTo({})).toBe(true);
    
    expect(comparable.not().equalTo(5)).toBe(false);
    expect(comparable.not().equalTo('five')).toBe(true);
  });

});
