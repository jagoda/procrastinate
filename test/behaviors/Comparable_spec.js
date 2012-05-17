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
  
  it("can test if a value is defined", function () {
    expect(comparable.defined()).toBe(true);
  });
  
  it("will make comparisons to itself by default", function () {
    comparable = new Comparable();
    
    expect(comparable.equalTo(comparable)).toBe(true);
    expect(comparable.equalTo(new Comparable())).toBe(false);
  });
  
  it("can negate tests", function () {
    expect(comparable.not()).toBeInstanceOf(Comparable);
    
    expect(comparable.not().equalTo(5)).toBe(false);
    expect(comparable.not().equalTo('five')).toBe(true);
    expect(comparable.not().defined()).toBe(false);
    
    expect(comparable.not().not()).toBeInstanceOf(Comparable);
    expect(comparable.not().not().equalTo(5)).toBe(true);
    expect(comparable.not().not().equalTo('five')).toBe(false);
    expect(comparable.not().not().defined()).toBe(true);
  });

});
