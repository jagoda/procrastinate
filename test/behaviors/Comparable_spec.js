var Comparable = require('../../lib/behaviors/Comparable');


describe("A Comparable object", function () {

  var comparable;
  
  beforeEach(function () {
    comparable = new Comparable(5);
  });
  
  it("can test for equality", function () {
    expect(comparable.equalTo(5)).toBe(true);
    expect(comparable.equalTo('five')).toBe(false);
  });
  
  it("can will make comparisons to itself by default", function () {
    comparable = new Comparable();
    
    expect(comparable.equalTo(comparable)).toBe(true);
    expect(comparable.equalTo(new Comparable())).toBe(false);
  });

});
