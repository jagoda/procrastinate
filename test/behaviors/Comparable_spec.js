var Comparable = require('../../lib/behaviors/Comparable'),
    valueOf = Comparable.valueOf;


describe("A Comparable object", function () {

  var comparable;
  
  beforeEach(function () {
    comparable = new Comparable(5);
  });
  
  it("can test if a value is defined", function () {
    expect(comparable.defined).toBe(true);
    
    comparable = new Comparable(undefined);
    expect(comparable.defined).toBe(false);
  });
  
  it("can test if a value is undefined", function () {
    expect(comparable.undefined).toBe(false);
    
    comparable = new Comparable(undefined);
    expect(comparable.undefined).toBe(true);
  });
  
  it("can test for equality", function () {
    expect(comparable.equalTo(5)).toBe(true);
    expect(comparable.equalTo('five')).toBe(false);
  });
  
  it("can test if a value is truthy", function () {
    expect(comparable.truthy).toBe(true);
    
    comparable = new Comparable(0);
    expect(comparable.truthy).toBe(false);
  });
  
  it("can test if a value is falsy", function () {
    expect(comparable.falsy).toBe(false);
    
    comparable = new Comparable(0);
    expect(comparable.falsy).toBe(true);
  });
  
  it("will make comparisons to itself by default", function () {
    comparable = new Comparable();
    
    expect(comparable.equalTo(comparable)).toBe(true);
    expect(comparable.equalTo(new Comparable())).toBe(false);
  });
  
  it("can negate tests", function () {
    expect(comparable.not).toBeInstanceOf(Comparable);
    
    expect(comparable.not.equalTo(5)).toBe(false);
    expect(comparable.not.equalTo('five')).toBe(true);
    expect(comparable.not.defined).toBe(false);
    
    expect(comparable.not.not).toBeInstanceOf(Comparable);
    expect(comparable.not.not.equalTo(5)).toBe(true);
    expect(comparable.not.not.equalTo('five')).toBe(false);
    expect(comparable.not.not.defined).toBe(true);
  });
  
  describe("using natural language", function () {
  
    it("can perform comparisons", function () {
      expect(valueOf(5).is.equalTo(5)).toBe(true);
      expect(valueOf(5).is.not.equalTo(6)).toBe(true);
      expect(valueOf('five').is.defined).toBe(true);
      expect(valueOf('five').is.not.defined).toBe(false);
    });
  
  });

});
