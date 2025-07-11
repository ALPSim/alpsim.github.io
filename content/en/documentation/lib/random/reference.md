---
title: Reference
description: "ALPS Random Library"
weight: 2
---

# Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`namespace `[`alps`](#d8/d3d/namespacealps) | 
`namespace `[`alps::detail`](#d6/d75/namespacealps_1_1detail) | 

# namespace `alps` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline std::ostream & `[`operator<<`](#dc/de7/buffered__rng_8h_1a1440caae461063043b20ed0877e1c45c)`(std::ostream & os,const `[`buffered_rng_base`](#dc/dc8/classalps_1_1buffered__rng__base)` & r)`            | writes the state of the generator to a std::ostream 
`public inline std::istream & `[`operator>>`](#dc/de7/buffered__rng_8h_1abe6492e3acf4e8802625ec3d47113049)`(std::istream & is,`[`buffered_rng_base`](#dc/dc8/classalps_1_1buffered__rng__base)` & r)`            | reads the state of the generator from a std::istream 
`public template<>`  <br/>`void `[`seed_with_sequence`](#d6/d16/seed_8h_1a0e8c64eb7ed333606a5afad16a7afc46)`(RNG & rng,uint32_t seed)`            | a generic seeding function for random number generators
`public template<>`  <br/>`void `[`seed_with_generator`](#d6/d16/seed_8h_1aa71b0a7d6549199f1e52a040a0e888ea)`(RNG & rng,INIGEN & inigen)`            | 
`class `[`alps::basic_buffered_generator`](#d2/dea/classalps_1_1basic__buffered__generator) | a concrete implementation of a buffered generator
`class `[`alps::basic_buffered_uniform_01`](#da/d82/classalps_1_1basic__buffered__uniform__01) | a runtime-polymorphic buffered random number generator generating double values in the interval [0,1[
`class `[`alps::buffered_generator`](#d2/dad/classalps_1_1buffered__generator) | abstract base class of a runtime-polymorphic [buffered_generator](#d2/dad/classalps_1_1buffered__generator)
`class `[`alps::buffered_rng`](#d5/da5/classalps_1_1buffered__rng) | a concrete implementation of a buffered random number generator 
`class `[`alps::buffered_rng_base`](#dc/dc8/classalps_1_1buffered__rng__base) | abstract base class of a runtime-polymorphic random number generator
`class `[`alps::buffered_uniform_01`](#d0/dda/classalps_1_1buffered__uniform__01) | the abstract base class of a runtime-polymorphic buffered random number generator generating double values in the interval [0,1[
`class `[`alps::multivariate_normal_distribution`](#d8/d52/classalps_1_1multivariate__normal__distribution) | a distribution creating correlated multi-variate normally distributed numbers
`class `[`alps::pseudo_des`](#d6/dba/classalps_1_1pseudo__des) | A random number generator using the pseudo-DES algorithm.
`class `[`alps::random_choice`](#de/d8a/classalps_1_1random__choice) | 
`class `[`alps::random_choice< double >`](#dd/d16/classalps_1_1random__choice_3_01double_01_4) | 
`class `[`alps::random_choice< unsigned int >`](#d3/d3a/classalps_1_1random__choice_3_01unsigned_01int_01_4) | 
`class `[`alps::RNGFactory`](#dc/db5/classalps_1_1_r_n_g_factory) | a factory to create random number generators from their name
`class `[`alps::uniform_on_sphere_n`](#de/d44/classalps_1_1uniform__on__sphere__n) | 
`class `[`alps::uniform_on_sphere_n< 1, RealType, Cont >`](#de/d59/classalps_1_1uniform__on__sphere__n_3_011_00_01_real_type_00_01_cont_01_4) | 
`class `[`alps::uniform_on_sphere_n< 2, RealType, Cont >`](#d1/df9/classalps_1_1uniform__on__sphere__n_3_012_00_01_real_type_00_01_cont_01_4) | 
`class `[`alps::uniform_on_sphere_n< 3, RealType, Cont >`](#dd/dee/classalps_1_1uniform__on__sphere__n_3_013_00_01_real_type_00_01_cont_01_4) | 

## Members

#### `public inline std::ostream & `[`operator<<`](#dc/de7/buffered__rng_8h_1a1440caae461063043b20ed0877e1c45c)`(std::ostream & os,const `[`buffered_rng_base`](#dc/dc8/classalps_1_1buffered__rng__base)` & r)` 

writes the state of the generator to a std::ostream 
**See also**: [buffered_rng_base](#dc/dc8/classalps_1_1buffered__rng__base)

#### `public inline std::istream & `[`operator>>`](#dc/de7/buffered__rng_8h_1abe6492e3acf4e8802625ec3d47113049)`(std::istream & is,`[`buffered_rng_base`](#dc/dc8/classalps_1_1buffered__rng__base)` & r)` 

reads the state of the generator from a std::istream 
**See also**: [buffered_rng_base](#dc/dc8/classalps_1_1buffered__rng__base)

#### `public template<>`  <br/>`void `[`seed_with_sequence`](#d6/d16/seed_8h_1a0e8c64eb7ed333606a5afad16a7afc46)`(RNG & rng,uint32_t seed)` 

a generic seeding function for random number generators

#### Parameters
* `rng` the random number generator to be seeded 

* `seed` the seed block number

seeds a random number generator following the Boost specifications for such generators with a unique sequence of random numbers obtained from the specified seed with the [pseudo_des](#d6/dba/classalps_1_1pseudo__des) generator. This function is useful to prepare seed blocks for Monte Carlo simulations or similar applications.

#### `public template<>`  <br/>`void `[`seed_with_generator`](#d6/d16/seed_8h_1aa71b0a7d6549199f1e52a040a0e888ea)`(RNG & rng,INIGEN & inigen)` 

# class `alps::basic_buffered_generator` 

```
class alps::basic_buffered_generator
  : public alps::buffered_generator< ResultType >
```  

a concrete implementation of a buffered generator

#### Parameters
* `Generator` the type of the generator used to fill the buffer 

* `ResultType` the type of values generated

This class template is a concrete derived class template for runtime-polymorphic generators. It uses the generator provided as template argument to fill the buffer of the [buffered_generator](#d2/dad/classalps_1_1buffered__generator) base class. If the `Generator` is a reference type, a reference to the generator passed to the constructor is used. Otherwise a copy of the generator is used.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`basic_buffered_generator`](#d2/dea/classalps_1_1basic__buffered__generator_1aa77b7f14d967116ff30c9dd4ca2a936d)`(std::size_t buffer_size)` | constructs a buffer of the size given as argument, and a default-generated Generator. 
`public inline  `[`basic_buffered_generator`](#d2/dea/classalps_1_1basic__buffered__generator_1a6202415d017983cd2e9276753c266302)`(`[`generator_type`](#d2/dea/classalps_1_1basic__buffered__generator_1a6a18c3f5e0752f2032fca58ed77f7985)` gen,std::size_t buffer_size)` | constructs a buffered generator from the given argument 
`typedef `[`generator_type`](#d2/dea/classalps_1_1basic__buffered__generator_1a6a18c3f5e0752f2032fca58ed77f7985) | the date type of the generator used to fill the buffer
`typedef `[`result_type`](#d2/dea/classalps_1_1basic__buffered__generator_1ae5b1c957243ed2fa25e9b172b06796a7) | the type of values generated

## Members

#### `public inline  `[`basic_buffered_generator`](#d2/dea/classalps_1_1basic__buffered__generator_1aa77b7f14d967116ff30c9dd4ca2a936d)`(std::size_t buffer_size)` 

constructs a buffer of the size given as argument, and a default-generated Generator. 
#### Parameters
* `buffer_size` the size of the buffer

#### `public inline  `[`basic_buffered_generator`](#d2/dea/classalps_1_1basic__buffered__generator_1a6202415d017983cd2e9276753c266302)`(`[`generator_type`](#d2/dea/classalps_1_1basic__buffered__generator_1a6a18c3f5e0752f2032fca58ed77f7985)` gen,std::size_t buffer_size)` 

constructs a buffered generator from the given argument 
#### Parameters
* `gen` the generator used to generate values 

* `buffer_size` the size of the buffer

If a reference type is specifed as `Generator` type, a reference to the generator `gen` is stored and used, otherweise the generator is copied.

#### `typedef `[`generator_type`](#d2/dea/classalps_1_1basic__buffered__generator_1a6a18c3f5e0752f2032fca58ed77f7985) 

the date type of the generator used to fill the buffer

#### `typedef `[`result_type`](#d2/dea/classalps_1_1basic__buffered__generator_1ae5b1c957243ed2fa25e9b172b06796a7) 

the type of values generated

# class `alps::basic_buffered_uniform_01` 

```
class alps::basic_buffered_uniform_01
  : public alps::buffered_uniform_01< double >
```  

a runtime-polymorphic buffered random number generator generating double values in the interval [0,1[

#### Parameters
* `Engine` the type of random number generator engine 

* `RealType` the floating point type of the random numbers, defaults to double

This class template is a concrete derived class template for runtime-polymorphic generators. It uses a variate_generator producing uniform random numbers in the interval[0,1) to fill the buffer of the [alps::buffered_generator](#d2/dad/classalps_1_1buffered__generator) base class. If the `Engine` is a reference type,

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`basic_buffered_uniform_01`](#da/d82/classalps_1_1basic__buffered__uniform__01_1a35325449f43a1d2e9576d1c1ec970a08)`(std::size_t buffer_size)` | constructs a default-seeded generator with a buffer of the size given as argument, and uses a default-generated random number generator. 
`public inline  `[`basic_buffered_uniform_01`](#da/d82/classalps_1_1basic__buffered__uniform__01_1a71a5e5e994a14e4aa866e22ad08ac814)`(`[`engine_type`](#da/d82/classalps_1_1basic__buffered__uniform__01_1a6100db1f40a0ee54777d43af11d5c749)` engine,std::size_t buffer_size)` | constructs a generator from the given engine 
`typedef `[`result_type`](#da/d82/classalps_1_1basic__buffered__uniform__01_1ab30c2c5da0212d21e66b3206d42c8ef7) | the type of random numbers
`typedef `[`engine_type`](#da/d82/classalps_1_1basic__buffered__uniform__01_1a6100db1f40a0ee54777d43af11d5c749) | the type of random number generator engine
`typedef `[`distribution_type`](#da/d82/classalps_1_1basic__buffered__uniform__01_1abb71da6a57069159ca65a18da8e003f3) | 
`typedef `[`generator_type`](#da/d82/classalps_1_1basic__buffered__uniform__01_1abfc9eff0491f7acf1f324275ac9e7cd0) | 

## Members

#### `public inline  `[`basic_buffered_uniform_01`](#da/d82/classalps_1_1basic__buffered__uniform__01_1a35325449f43a1d2e9576d1c1ec970a08)`(std::size_t buffer_size)` 

constructs a default-seeded generator with a buffer of the size given as argument, and uses a default-generated random number generator. 
#### Parameters
* `buffer_size` the size of the buffer

#### `public inline  `[`basic_buffered_uniform_01`](#da/d82/classalps_1_1basic__buffered__uniform__01_1a71a5e5e994a14e4aa866e22ad08ac814)`(`[`engine_type`](#da/d82/classalps_1_1basic__buffered__uniform__01_1a6100db1f40a0ee54777d43af11d5c749)` engine,std::size_t buffer_size)` 

constructs a generator from the given engine 
#### Parameters
* `engine` the engine used to generate values 

* `buffer_size` the size of the buffer

If a reference type is specifed as `Engine` type, a reference to the `engine` is stored and used, otherweise the engine is copied.

#### `typedef `[`result_type`](#da/d82/classalps_1_1basic__buffered__uniform__01_1ab30c2c5da0212d21e66b3206d42c8ef7) 

the type of random numbers

#### `typedef `[`engine_type`](#da/d82/classalps_1_1basic__buffered__uniform__01_1a6100db1f40a0ee54777d43af11d5c749) 

the type of random number generator engine

#### `typedef `[`distribution_type`](#da/d82/classalps_1_1basic__buffered__uniform__01_1abb71da6a57069159ca65a18da8e003f3) 

#### `typedef `[`generator_type`](#da/d82/classalps_1_1basic__buffered__uniform__01_1abfc9eff0491f7acf1f324275ac9e7cd0) 

# class `alps::buffered_generator` 

abstract base class of a runtime-polymorphic [buffered_generator](#d2/dad/classalps_1_1buffered__generator)

#### Parameters
* `ResultType` the type of values generated

This class template is an abstract base class for runtime-polymorphic generators. 
 In order to mask the abstraction penalty of a virtual `operator()`, the [buffered_generator](#d2/dad/classalps_1_1buffered__generator) does not produce single numbers at each call, but instead a large buffer is filled in a virtual function call, and then numbers from this buffer used when `operator()` is called.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`buffered_generator`](#d2/dad/classalps_1_1buffered__generator_1aea9e7bfe968df3446c60363f0c320f44)`(std::size_t buffer_size)` | the constructor of the buffered generator
`public inline  `[`buffered_generator`](#d2/dad/classalps_1_1buffered__generator_1ada562f349c9df2620eb2ac8e99328a14)`(const `[`buffered_generator`](#d2/dad/classalps_1_1buffered__generator)` & gen)` | the copy constructor copies the buffer
`public inline virtual  `[`~buffered_generator`](#d2/dad/classalps_1_1buffered__generator_1a813fa1fab5b1637ce7b5a8347a981108)`()` | trivial virtual destructor
`public inline `[`buffered_generator`](#d2/dad/classalps_1_1buffered__generator)` & `[`operator=`](#d2/dad/classalps_1_1buffered__generator_1a9c7a76800903ea1fc0beddbcbc491890)`(const `[`buffered_generator`](#d2/dad/classalps_1_1buffered__generator)` & gen)` | non-trivial the assignment
`public inline result_type `[`operator()`](#d2/dad/classalps_1_1buffered__generator_1aa9bd0b5fdbd5a67fd36f1e3175c13cf9)`()` | returns the next generated value
`public inline void `[`reset`](#d2/dad/classalps_1_1buffered__generator_1a95e4a632ef786daca00450e019f7a044)`()` | discards all elements in the buffers and forces a new call to fill_buffer when the next value is requested
`typedef `[`result_type`](#d2/dad/classalps_1_1buffered__generator_1a72f584b0f3b04f7015c61b0bc1ccd6f8) | 
`typedef `[`buffer_type`](#d2/dad/classalps_1_1buffered__generator_1ab39c82c7dc3b7712b7496f75008f6fd0) | the data type of the buffer used

## Members

#### `public inline  `[`buffered_generator`](#d2/dad/classalps_1_1buffered__generator_1aea9e7bfe968df3446c60363f0c320f44)`(std::size_t buffer_size)` 

the constructor of the buffered generator

#### Parameters
* `buffer_size` the size of the buffer

Constructs a `[buffered_generator](#d2/dad/classalps_1_1buffered__generator)` with a buffer of the size given as argument.

#### `public inline  `[`buffered_generator`](#d2/dad/classalps_1_1buffered__generator_1ada562f349c9df2620eb2ac8e99328a14)`(const `[`buffered_generator`](#d2/dad/classalps_1_1buffered__generator)` & gen)` 

the copy constructor copies the buffer

#### `public inline virtual  `[`~buffered_generator`](#d2/dad/classalps_1_1buffered__generator_1a813fa1fab5b1637ce7b5a8347a981108)`()` 

trivial virtual destructor

#### `public inline `[`buffered_generator`](#d2/dad/classalps_1_1buffered__generator)` & `[`operator=`](#d2/dad/classalps_1_1buffered__generator_1a9c7a76800903ea1fc0beddbcbc491890)`(const `[`buffered_generator`](#d2/dad/classalps_1_1buffered__generator)` & gen)` 

non-trivial the assignment

#### `public inline result_type `[`operator()`](#d2/dad/classalps_1_1buffered__generator_1aa9bd0b5fdbd5a67fd36f1e3175c13cf9)`()` 

returns the next generated value

values are taken from the buffer, which is refilled by a call to fill_buffer when all values have been used up

#### `public inline void `[`reset`](#d2/dad/classalps_1_1buffered__generator_1a95e4a632ef786daca00450e019f7a044)`()` 

discards all elements in the buffers and forces a new call to fill_buffer when the next value is requested

#### `typedef `[`result_type`](#d2/dad/classalps_1_1buffered__generator_1a72f584b0f3b04f7015c61b0bc1ccd6f8) 

#### `typedef `[`buffer_type`](#d2/dad/classalps_1_1buffered__generator_1ab39c82c7dc3b7712b7496f75008f6fd0) 

the data type of the buffer used

# class `alps::buffered_rng` 

```
class alps::buffered_rng
  : public alps::buffered_rng_base
```  

a concrete implementation of a buffered random number generator 
#### Parameters
* `RNG` the type of random number generator

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`buffered_rng`](#d5/da5/classalps_1_1buffered__rng_1a27009417cf085ac35694a4043fb9e1bd)`()` | constructs a default-seeded generator
`public inline  `[`buffered_rng`](#d5/da5/classalps_1_1buffered__rng_1a1b83069458aadb08602568b6f91c6a32)`(RNG rng)` | constructs a generator by copying the argument 
`public template<>`  <br/>`inline void `[`seed`](#d5/da5/classalps_1_1buffered__rng_1ab590392a71741792804da1d49d323ad0)`(IT start,IT end)` | 
`public inline virtual void `[`seed`](#d5/da5/classalps_1_1buffered__rng_1ae0adb2258bdb7f80e0092c367b99271e)`(uint32_t s)` | seed from an integer using seed_with_sequence 
`public virtual void `[`seed`](#d5/da5/classalps_1_1buffered__rng_1abc483f0c101df077b8ef84b9627340c3)`()` | seed with the default value
`public inline virtual void `[`seed`](#d5/da5/classalps_1_1buffered__rng_1a43afad5eac395b9318cc42aec50c8b83)`(`[`pseudo_des`](#d6/dba/classalps_1_1pseudo__des)` & inigen)` | seed with the [pseudo_des](#d6/dba/classalps_1_1pseudo__des) generator
`public inline virtual `[`result_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a896aed67ba59d0625b040560b85b39bf)` min `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#d5/da5/classalps_1_1buffered__rng_1aeffdfe232fecae118b3854cc05136ab7)`() const` | 
`public inline virtual `[`result_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a896aed67ba59d0625b040560b85b39bf)` max `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#d5/da5/classalps_1_1buffered__rng_1a9a52490d36faf97e512df8a5f53e1605)`() const` | 
`public virtual void `[`write`](#d5/da5/classalps_1_1buffered__rng_1afb116e357292f2d162ac2973bccd90cd)`(std::ostream &) const` | write the state to a std::ostream
`public virtual void `[`read`](#d5/da5/classalps_1_1buffered__rng_1a0cda6c618be0006a42bbd93cfcffb10b)`(std::istream &)` | read the state from a std::istream
`public virtual void `[`write_all`](#d5/da5/classalps_1_1buffered__rng_1a98fc17466aca5d31f98fb11ebb0ce99d)`(std::ostream & os) const` | write the full state (including buffer) to a std::ostream
`public virtual void `[`read_all`](#d5/da5/classalps_1_1buffered__rng_1afe8b360191337abf293e9ea38295f273)`(std::istream &)` | read the full state (including buffer) from a std::istream
`protected RNG `[`rng_`](#d5/da5/classalps_1_1buffered__rng_1af970044eebae361f69ab8c5d063294b3) | 
`protected virtual void `[`fill_buffer`](#d5/da5/classalps_1_1buffered__rng_1ae367172ed52e7a6bfdae2c81a2113355)`()` | refills the buffer

## Members

#### `public inline  `[`buffered_rng`](#d5/da5/classalps_1_1buffered__rng_1a27009417cf085ac35694a4043fb9e1bd)`()` 

constructs a default-seeded generator

#### `public inline  `[`buffered_rng`](#d5/da5/classalps_1_1buffered__rng_1a1b83069458aadb08602568b6f91c6a32)`(RNG rng)` 

constructs a generator by copying the argument 
#### Parameters
* `rng` generator to be copied

#### `public template<>`  <br/>`inline void `[`seed`](#d5/da5/classalps_1_1buffered__rng_1ab590392a71741792804da1d49d323ad0)`(IT start,IT end)` 

#### `public inline virtual void `[`seed`](#d5/da5/classalps_1_1buffered__rng_1ae0adb2258bdb7f80e0092c367b99271e)`(uint32_t s)` 

seed from an integer using seed_with_sequence 
**See also**: [seed_with_sequence()](#d6/d16/seed_8h_1a0e8c64eb7ed333606a5afad16a7afc46)

#### `public virtual void `[`seed`](#d5/da5/classalps_1_1buffered__rng_1abc483f0c101df077b8ef84b9627340c3)`()` 

seed with the default value

#### `public inline virtual void `[`seed`](#d5/da5/classalps_1_1buffered__rng_1a43afad5eac395b9318cc42aec50c8b83)`(`[`pseudo_des`](#d6/dba/classalps_1_1pseudo__des)` & inigen)` 

seed with the [pseudo_des](#d6/dba/classalps_1_1pseudo__des) generator

#### `public inline virtual `[`result_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a896aed67ba59d0625b040560b85b39bf)` min `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#d5/da5/classalps_1_1buffered__rng_1aeffdfe232fecae118b3854cc05136ab7)`() const` 

#### `public inline virtual `[`result_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a896aed67ba59d0625b040560b85b39bf)` max `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#d5/da5/classalps_1_1buffered__rng_1a9a52490d36faf97e512df8a5f53e1605)`() const` 

#### `public virtual void `[`write`](#d5/da5/classalps_1_1buffered__rng_1afb116e357292f2d162ac2973bccd90cd)`(std::ostream &) const` 

write the state to a std::ostream

#### `public virtual void `[`read`](#d5/da5/classalps_1_1buffered__rng_1a0cda6c618be0006a42bbd93cfcffb10b)`(std::istream &)` 

read the state from a std::istream

#### `public virtual void `[`write_all`](#d5/da5/classalps_1_1buffered__rng_1a98fc17466aca5d31f98fb11ebb0ce99d)`(std::ostream & os) const` 

write the full state (including buffer) to a std::ostream

#### `public virtual void `[`read_all`](#d5/da5/classalps_1_1buffered__rng_1afe8b360191337abf293e9ea38295f273)`(std::istream &)` 

read the full state (including buffer) from a std::istream

#### `protected RNG `[`rng_`](#d5/da5/classalps_1_1buffered__rng_1af970044eebae361f69ab8c5d063294b3) 

#### `protected virtual void `[`fill_buffer`](#d5/da5/classalps_1_1buffered__rng_1ae367172ed52e7a6bfdae2c81a2113355)`()` 

refills the buffer

# class `alps::buffered_rng_base` 

abstract base class of a runtime-polymorphic random number generator

In order to mask the abstraction penalty, the derived generators do not produce single random numbers at each call, but instead a large buffer is filled in a virtual function call, and then numbers from this buffer used when operator() is called.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`BOOST_STATIC_CONSTANT`](#dc/dc8/classalps_1_1buffered__rng__base_1a88ed00df757b3c190129158af91ff354)`(bool,has_fixed_range)` | 
`public inline  `[`buffered_rng_base`](#dc/dc8/classalps_1_1buffered__rng__base_1a93937bae02c9909d56b626e5efeb6246)`(std::size_t b)` | the constructor
`public inline  `[`buffered_rng_base`](#dc/dc8/classalps_1_1buffered__rng__base_1a1b4ca51935f008ba232e3d13d87018da)`(const `[`buffered_rng_base`](#dc/dc8/classalps_1_1buffered__rng__base)` & gen)` | 
`public inline virtual  `[`~buffered_rng_base`](#dc/dc8/classalps_1_1buffered__rng__base_1a20cffe0128e91a9e45ca6bb8ecd82b52)`()` | 
`public inline `[`result_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a896aed67ba59d0625b040560b85b39bf)` `[`operator()`](#dc/dc8/classalps_1_1buffered__rng__base_1a5c7c899105fcfaf998802a23dcf668ab)`()` | returns the next random number
`public template<>`  <br/>`OutputIterator `[`generate_n`](#dc/dc8/classalps_1_1buffered__rng__base_1ac080e0433336c39152017a8dec2446b5)`(std::size_t n,OutputIterator it)` | 
`public void `[`seed`](#dc/dc8/classalps_1_1buffered__rng__base_1a8f9a8203583447c879fc923e8cb10bb2)`(uint32_t)` | seed with an unsigned integer
`public void `[`seed`](#dc/dc8/classalps_1_1buffered__rng__base_1a4f894aefa54bc0fc122e4f25999c9740)`()` | seed with the default value
`public void `[`seed`](#dc/dc8/classalps_1_1buffered__rng__base_1a35ae08d4de7c1806033f1ed945960262)`(`[`pseudo_des`](#d6/dba/classalps_1_1pseudo__des)` & inigen)` | seed with the [pseudo_des](#d6/dba/classalps_1_1pseudo__des) generator
`public void `[`write`](#dc/dc8/classalps_1_1buffered__rng__base_1a7f2fde4fbd96781e656fe68b5be5417a)`(std::ostream &) const` | write the state to a std::ostream
`public void `[`read`](#dc/dc8/classalps_1_1buffered__rng__base_1a18d3d54934a3b2e34035d38dbf709b42)`(std::istream &)` | read the state from a std::istream
`public void `[`write_all`](#dc/dc8/classalps_1_1buffered__rng__base_1a6780127c755d5e63f9bb098be7e383f9)`(std::ostream & os) const` | write the full state (including buffer) to a std::ostream
`public void `[`read_all`](#dc/dc8/classalps_1_1buffered__rng__base_1a45d8ae1f34c84aa7403fc0a45eb7f35a)`(std::istream &)` | read the full state (including buffer) from a std::istream
`public `[`result_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a896aed67ba59d0625b040560b85b39bf)` min `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#dc/dc8/classalps_1_1buffered__rng__base_1a1d3f411fa82c8c6845a4c15b535d2688)`() const` | 
`public `[`result_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a896aed67ba59d0625b040560b85b39bf)` max `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#dc/dc8/classalps_1_1buffered__rng__base_1a37008304723d5556257c44ece58c2bb9)`() const` | 
`protected std::vector< `[`result_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a896aed67ba59d0625b040560b85b39bf)` > `[`buf_`](#dc/dc8/classalps_1_1buffered__rng__base_1a63312e67614c7976b78d5b552e5fbc23) | 
`protected std::vector< `[`result_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a896aed67ba59d0625b040560b85b39bf)` >::iterator `[`ptr_`](#dc/dc8/classalps_1_1buffered__rng__base_1a92383ce2458c719c2f7825721a7a4b98) | 
`typedef `[`result_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a896aed67ba59d0625b040560b85b39bf) | we create random numbers of type uint32_t
`typedef `[`buffer_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a03476aa2767b0ca3eea9e5ddf3221ff5) | 

## Members

#### `public  `[`BOOST_STATIC_CONSTANT`](#dc/dc8/classalps_1_1buffered__rng__base_1a88ed00df757b3c190129158af91ff354)`(bool,has_fixed_range)` 

#### `public inline  `[`buffered_rng_base`](#dc/dc8/classalps_1_1buffered__rng__base_1a93937bae02c9909d56b626e5efeb6246)`(std::size_t b)` 

the constructor

#### Parameters
* `b` the size of the buffer

#### `public inline  `[`buffered_rng_base`](#dc/dc8/classalps_1_1buffered__rng__base_1a1b4ca51935f008ba232e3d13d87018da)`(const `[`buffered_rng_base`](#dc/dc8/classalps_1_1buffered__rng__base)` & gen)` 

#### `public inline virtual  `[`~buffered_rng_base`](#dc/dc8/classalps_1_1buffered__rng__base_1a20cffe0128e91a9e45ca6bb8ecd82b52)`()` 

#### `public inline `[`result_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a896aed67ba59d0625b040560b85b39bf)` `[`operator()`](#dc/dc8/classalps_1_1buffered__rng__base_1a5c7c899105fcfaf998802a23dcf668ab)`()` 

returns the next random number

numbers are taken from the buffer, which is refilled by a call to fill_buffer when it gets empty

#### `public template<>`  <br/>`OutputIterator `[`generate_n`](#dc/dc8/classalps_1_1buffered__rng__base_1ac080e0433336c39152017a8dec2446b5)`(std::size_t n,OutputIterator it)` 

#### `public void `[`seed`](#dc/dc8/classalps_1_1buffered__rng__base_1a8f9a8203583447c879fc923e8cb10bb2)`(uint32_t)` 

seed with an unsigned integer

#### `public void `[`seed`](#dc/dc8/classalps_1_1buffered__rng__base_1a4f894aefa54bc0fc122e4f25999c9740)`()` 

seed with the default value

#### `public void `[`seed`](#dc/dc8/classalps_1_1buffered__rng__base_1a35ae08d4de7c1806033f1ed945960262)`(`[`pseudo_des`](#d6/dba/classalps_1_1pseudo__des)` & inigen)` 

seed with the [pseudo_des](#d6/dba/classalps_1_1pseudo__des) generator

#### `public void `[`write`](#dc/dc8/classalps_1_1buffered__rng__base_1a7f2fde4fbd96781e656fe68b5be5417a)`(std::ostream &) const` 

write the state to a std::ostream

#### `public void `[`read`](#dc/dc8/classalps_1_1buffered__rng__base_1a18d3d54934a3b2e34035d38dbf709b42)`(std::istream &)` 

read the state from a std::istream

#### `public void `[`write_all`](#dc/dc8/classalps_1_1buffered__rng__base_1a6780127c755d5e63f9bb098be7e383f9)`(std::ostream & os) const` 

write the full state (including buffer) to a std::ostream

#### `public void `[`read_all`](#dc/dc8/classalps_1_1buffered__rng__base_1a45d8ae1f34c84aa7403fc0a45eb7f35a)`(std::istream &)` 

read the full state (including buffer) from a std::istream

#### `public `[`result_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a896aed67ba59d0625b040560b85b39bf)` min `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#dc/dc8/classalps_1_1buffered__rng__base_1a1d3f411fa82c8c6845a4c15b535d2688)`() const` 

#### `public `[`result_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a896aed67ba59d0625b040560b85b39bf)` max `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#dc/dc8/classalps_1_1buffered__rng__base_1a37008304723d5556257c44ece58c2bb9)`() const` 

#### `protected std::vector< `[`result_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a896aed67ba59d0625b040560b85b39bf)` > `[`buf_`](#dc/dc8/classalps_1_1buffered__rng__base_1a63312e67614c7976b78d5b552e5fbc23) 

#### `protected std::vector< `[`result_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a896aed67ba59d0625b040560b85b39bf)` >::iterator `[`ptr_`](#dc/dc8/classalps_1_1buffered__rng__base_1a92383ce2458c719c2f7825721a7a4b98) 

#### `typedef `[`result_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a896aed67ba59d0625b040560b85b39bf) 

we create random numbers of type uint32_t

#### `typedef `[`buffer_type`](#dc/dc8/classalps_1_1buffered__rng__base_1a03476aa2767b0ca3eea9e5ddf3221ff5) 

# class `alps::buffered_uniform_01` 

```
class alps::buffered_uniform_01
  : public alps::buffered_generator< double >
```  

the abstract base class of a runtime-polymorphic buffered random number generator generating double values in the interval [0,1[

#### Parameters
* `RealType` the floating point type of the random numbers, defaults to double

This class template is an abstract base class template for runtime-polymorphic uniform random number generators producing numbers in the interval [0,1). It inherits from [alps::buffered_generator](#d2/dad/classalps_1_1buffered__generator) and provides `min()` and @max () functions returning 0. and 1. respectively,

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`buffered_uniform_01`](#d0/dda/classalps_1_1buffered__uniform__01_1a9b0c1f4642cd86d6cfdf08d18f6d638c)`(std::size_t buffer_size)` | constructs the generator 
`public inline `[`result_type`](#d0/dda/classalps_1_1buffered__uniform__01_1af33d16cc33e6d40d5870d66863f6fa54)` min `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#d0/dda/classalps_1_1buffered__uniform__01_1ad7a3796d337c1ff8a8b3cab0804da6bb)`() const` | 
`public inline `[`result_type`](#d0/dda/classalps_1_1buffered__uniform__01_1af33d16cc33e6d40d5870d66863f6fa54)` max `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#d0/dda/classalps_1_1buffered__uniform__01_1ab0f51a5d2fa90b8a40f4d827e2a57437)`() const` | 
`typedef `[`result_type`](#d0/dda/classalps_1_1buffered__uniform__01_1af33d16cc33e6d40d5870d66863f6fa54) | the type of random numbers

## Members

#### `public inline  `[`buffered_uniform_01`](#d0/dda/classalps_1_1buffered__uniform__01_1a9b0c1f4642cd86d6cfdf08d18f6d638c)`(std::size_t buffer_size)` 

constructs the generator 
#### Parameters
* `buffer_size` the size of the buffer

#### `public inline `[`result_type`](#d0/dda/classalps_1_1buffered__uniform__01_1af33d16cc33e6d40d5870d66863f6fa54)` min `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#d0/dda/classalps_1_1buffered__uniform__01_1ad7a3796d337c1ff8a8b3cab0804da6bb)`() const` 

#### `public inline `[`result_type`](#d0/dda/classalps_1_1buffered__uniform__01_1af33d16cc33e6d40d5870d66863f6fa54)` max `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#d0/dda/classalps_1_1buffered__uniform__01_1ab0f51a5d2fa90b8a40f4d827e2a57437)`() const` 

#### `typedef `[`result_type`](#d0/dda/classalps_1_1buffered__uniform__01_1af33d16cc33e6d40d5870d66863f6fa54) 

the type of random numbers

# class `alps::multivariate_normal_distribution` 

a distribution creating correlated multi-variate normally distributed numbers

the multivariate normal distribution creates correlated random numbers with a specified mean vector and covariance matrix. Instead of using a vector as the `result_type`, the `result_type` is a scalar real number, and the `operator()` should be called once for each element of the vector.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`BOOST_STATIC_ASSERT`](#d8/d52/classalps_1_1multivariate__normal__distribution_1aeaaf7138fde71cdb5f8997f32f63ad49)`(!std::numeric_limits< RealType >::is_integer)` | INTERNAL ONLY.
`public inline  `[`multivariate_normal_distribution`](#d8/d52/classalps_1_1multivariate__normal__distribution_1af97a6ee25243fa7d20d6065ae98c9354)`(const `[`matrix_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a278f2eee6644ed136f88c07a787a5282)` & cholesky,const `[`vector_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a0b8aab23e687bf0711db04d7ee5752fb)` & mean)` | the constructor of the multi-variate normal distribution
`public inline  explicit `[`multivariate_normal_distribution`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a1f45ee093f4c9daaefb5c7bf06395ede)`(const `[`matrix_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a278f2eee6644ed136f88c07a787a5282)` & cholesky)` | the constructor of the multi-variate normal distribution with zero mean
`public inline  `[`multivariate_normal_distribution`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a7342e0d6839509360f820403f24509a4)`(const `[`multivariate_normal_distribution`](#d8/d52/classalps_1_1multivariate__normal__distribution)` & other)` | INTERNAL ONLY.
`public inline `[`multivariate_normal_distribution`](#d8/d52/classalps_1_1multivariate__normal__distribution)` & `[`operator=`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a89aedadfef752a1d62ef2a422ab65956)`(const `[`multivariate_normal_distribution`](#d8/d52/classalps_1_1multivariate__normal__distribution)` & other)` | INTERNAL ONLY.
`public inline `[`vector_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a0b8aab23e687bf0711db04d7ee5752fb)` const & `[`mean`](#d8/d52/classalps_1_1multivariate__normal__distribution_1afc2c4770c83c963c946dc11dce1fc70d)`() const` | #### Returns
`public inline `[`matrix_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a278f2eee6644ed136f88c07a787a5282)` const & `[`cholesky`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a2577e5733d2bd76e323411a7b7e98493)`() const` | #### Returns
`public inline void `[`reset`](#d8/d52/classalps_1_1multivariate__normal__distribution_1ae5bc3fa83903d1fa09d5011b75626944)`()` | purges the cache.
`public template<>`  <br/>`inline `[`result_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a894463a6456b722dfaa41c828c58a7a1)` `[`operator()`](#d8/d52/classalps_1_1multivariate__normal__distribution_1af4b09df3e35e63ad910652b53ae7aa41)`(Engine & eng)` | #### Returns
`typedef `[`result_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a894463a6456b722dfaa41c828c58a7a1) | the type of random numbers produced
`typedef `[`input_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1ac62c9d71d1d939925857326ccb849ba7) | the input type
`typedef `[`vector_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a0b8aab23e687bf0711db04d7ee5752fb) | the type of the vector of mean values
`typedef `[`matrix_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a278f2eee6644ed136f88c07a787a5282) | the type of the matrix storing the Cholesky decomposition of the covariance matrix

## Members

#### `public  `[`BOOST_STATIC_ASSERT`](#d8/d52/classalps_1_1multivariate__normal__distribution_1aeaaf7138fde71cdb5f8997f32f63ad49)`(!std::numeric_limits< RealType >::is_integer)` 

INTERNAL ONLY.

#### `public inline  `[`multivariate_normal_distribution`](#d8/d52/classalps_1_1multivariate__normal__distribution_1af97a6ee25243fa7d20d6065ae98c9354)`(const `[`matrix_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a278f2eee6644ed136f88c07a787a5282)` & cholesky,const `[`vector_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a0b8aab23e687bf0711db04d7ee5752fb)` & mean)` 

the constructor of the multi-variate normal distribution

#### Parameters
* `mean` the vector of mean values 

* `cholesky` the Cholesky decomposition of the covariance matrix

The Cholesky decomposition has to be a square matrix and its dimension has to be the same as that of the mean vector. Instead of a Cholesky decomposition any other square root of the covariance matrix could be passed.

Requires: mean.size() == cholesky.size1() and cholesky.size1() == cholesky.size2()

#### `public inline  explicit `[`multivariate_normal_distribution`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a1f45ee093f4c9daaefb5c7bf06395ede)`(const `[`matrix_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a278f2eee6644ed136f88c07a787a5282)` & cholesky)` 

the constructor of the multi-variate normal distribution with zero mean

#### Parameters
* `cholesky` the Cholesky decomposition of the covariance matrix

Instead of a Cholesky decomposition any other square root of the covariance matrix could be passed.

Requires: cholesky.size1() == cholesky.size2()

#### `public inline  `[`multivariate_normal_distribution`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a7342e0d6839509360f820403f24509a4)`(const `[`multivariate_normal_distribution`](#d8/d52/classalps_1_1multivariate__normal__distribution)` & other)` 

INTERNAL ONLY.

#### `public inline `[`multivariate_normal_distribution`](#d8/d52/classalps_1_1multivariate__normal__distribution)` & `[`operator=`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a89aedadfef752a1d62ef2a422ab65956)`(const `[`multivariate_normal_distribution`](#d8/d52/classalps_1_1multivariate__normal__distribution)` & other)` 

INTERNAL ONLY.

#### `public inline `[`vector_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a0b8aab23e687bf0711db04d7ee5752fb)` const & `[`mean`](#d8/d52/classalps_1_1multivariate__normal__distribution_1afc2c4770c83c963c946dc11dce1fc70d)`() const` 

#### Returns
the vector of mean values

#### `public inline `[`matrix_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a278f2eee6644ed136f88c07a787a5282)` const & `[`cholesky`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a2577e5733d2bd76e323411a7b7e98493)`() const` 

#### Returns
the Cholesky decomposition of the covariance marix

#### `public inline void `[`reset`](#d8/d52/classalps_1_1multivariate__normal__distribution_1ae5bc3fa83903d1fa09d5011b75626944)`()` 

purges the cache.

Purges the cache. The next call to oeprator() will create a new vector.

#### `public template<>`  <br/>`inline `[`result_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a894463a6456b722dfaa41c828c58a7a1)` `[`operator()`](#d8/d52/classalps_1_1multivariate__normal__distribution_1af4b09df3e35e63ad910652b53ae7aa41)`(Engine & eng)` 

#### Returns
On the first call, it creates a vector of n multivariate normally distributed random numbers, caches it, and returns the first value. The next n-1 calls return the next elements of the vector. The n+1-st call again creates a new vector of multivariate normally distributed random numbers.

#### `typedef `[`result_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a894463a6456b722dfaa41c828c58a7a1) 

the type of random numbers produced

#### `typedef `[`input_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1ac62c9d71d1d939925857326ccb849ba7) 

the input type

#### `typedef `[`vector_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a0b8aab23e687bf0711db04d7ee5752fb) 

the type of the vector of mean values

#### `typedef `[`matrix_type`](#d8/d52/classalps_1_1multivariate__normal__distribution_1a278f2eee6644ed136f88c07a787a5282) 

the type of the matrix storing the Cholesky decomposition of the covariance matrix

# class `alps::pseudo_des` 

A random number generator using the pseudo-DES algorithm.

The random number generator follows the BOOST (standard C++) specifications

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`BOOST_STATIC_CONSTANT`](#d6/dba/classalps_1_1pseudo__des_1a4cfcf5601f0fb1f135eccb302ce25fb7)`(uint32_t,default_seed)` | the default seed is 4357
`public inline `[`result_type`](#d6/dba/classalps_1_1pseudo__des_1a8c8a6166c324106393fc6c2e64e8b146)` min `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#d6/dba/classalps_1_1pseudo__des_1adce2d4bd8e1487bc83fd1b358efc7fdd)`() const` | minim value is 0
`public inline `[`result_type`](#d6/dba/classalps_1_1pseudo__des_1a8c8a6166c324106393fc6c2e64e8b146)` max `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#d6/dba/classalps_1_1pseudo__des_1a651d9e1b436f7f85b3203c8466980d85)`() const` | maximum value is 2^32-1
`public inline  `[`pseudo_des`](#d6/dba/classalps_1_1pseudo__des_1a7777cbeb83325f003ca0051a73b085fd)`()` | the default constructor
`public inline  explicit `[`pseudo_des`](#d6/dba/classalps_1_1pseudo__des_1a4efe81892227b4eb14700909a8891162)`(uint32_t s)` | construct with specified seed
`public inline void `[`seed`](#d6/dba/classalps_1_1pseudo__des_1a22fe0939fa4f23c9a90dfc729a93a448)`(uint32_t s) = default` | seed the generator
`public inline `[`result_type`](#d6/dba/classalps_1_1pseudo__des_1a8c8a6166c324106393fc6c2e64e8b146)` `[`operator()`](#d6/dba/classalps_1_1pseudo__des_1ad4ac77fbea872f857d780423cfb4c4ec)`()` | get the next value
`public inline void `[`operator+=`](#d6/dba/classalps_1_1pseudo__des_1a4855b966e954b84511addf01a0d1461c)`(uint32_t skip)` | skip forward by *skip* numbers
`public inline std::ostream & `[`write`](#d6/dba/classalps_1_1pseudo__des_1a8b3770eb35c785cb95763971855a0ae9)`(std::ostream & os) const` | write the state to a std::ostream
`public inline std::istream & `[`read`](#d6/dba/classalps_1_1pseudo__des_1aa4ecbc764beec38d3e965e17a13a8dd2)`(std::istream & is)` | read the state from a std::istream
`public inline bool `[`operator==`](#d6/dba/classalps_1_1pseudo__des_1afb05221ac9635a39be177ab3c1840702)`(const `[`pseudo_des`](#d6/dba/classalps_1_1pseudo__des)` & rhs) const` | check whether the initial seed and current state of two generators is the same
`typedef `[`result_type`](#d6/dba/classalps_1_1pseudo__des_1a8c8a6166c324106393fc6c2e64e8b146) | type of the random numbers

## Members

#### `public  `[`BOOST_STATIC_CONSTANT`](#d6/dba/classalps_1_1pseudo__des_1a4cfcf5601f0fb1f135eccb302ce25fb7)`(uint32_t,default_seed)` 

the default seed is 4357

#### `public inline `[`result_type`](#d6/dba/classalps_1_1pseudo__des_1a8c8a6166c324106393fc6c2e64e8b146)` min `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#d6/dba/classalps_1_1pseudo__des_1adce2d4bd8e1487bc83fd1b358efc7fdd)`() const` 

minim value is 0

#### `public inline `[`result_type`](#d6/dba/classalps_1_1pseudo__des_1a8c8a6166c324106393fc6c2e64e8b146)` max `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#d6/dba/classalps_1_1pseudo__des_1a651d9e1b436f7f85b3203c8466980d85)`() const` 

maximum value is 2^32-1

#### `public inline  `[`pseudo_des`](#d6/dba/classalps_1_1pseudo__des_1a7777cbeb83325f003ca0051a73b085fd)`()` 

the default constructor

#### `public inline  explicit `[`pseudo_des`](#d6/dba/classalps_1_1pseudo__des_1a4efe81892227b4eb14700909a8891162)`(uint32_t s)` 

construct with specified seed

#### `public inline void `[`seed`](#d6/dba/classalps_1_1pseudo__des_1a22fe0939fa4f23c9a90dfc729a93a448)`(uint32_t s) = default` 

seed the generator

#### `public inline `[`result_type`](#d6/dba/classalps_1_1pseudo__des_1a8c8a6166c324106393fc6c2e64e8b146)` `[`operator()`](#d6/dba/classalps_1_1pseudo__des_1ad4ac77fbea872f857d780423cfb4c4ec)`()` 

get the next value

#### `public inline void `[`operator+=`](#d6/dba/classalps_1_1pseudo__des_1a4855b966e954b84511addf01a0d1461c)`(uint32_t skip)` 

skip forward by *skip* numbers

#### `public inline std::ostream & `[`write`](#d6/dba/classalps_1_1pseudo__des_1a8b3770eb35c785cb95763971855a0ae9)`(std::ostream & os) const` 

write the state to a std::ostream

#### `public inline std::istream & `[`read`](#d6/dba/classalps_1_1pseudo__des_1aa4ecbc764beec38d3e965e17a13a8dd2)`(std::istream & is)` 

read the state from a std::istream

#### `public inline bool `[`operator==`](#d6/dba/classalps_1_1pseudo__des_1afb05221ac9635a39be177ab3c1840702)`(const `[`pseudo_des`](#d6/dba/classalps_1_1pseudo__des)` & rhs) const` 

check whether the initial seed and current state of two generators is the same

#### `typedef `[`result_type`](#d6/dba/classalps_1_1pseudo__des_1a8c8a6166c324106393fc6c2e64e8b146) 

type of the random numbers

# class `alps::random_choice` 

```
class alps::random_choice
  : public alps::detail::random_choice_walker< RNG::result_type, unsigned int, double >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`random_choice`](#de/d8a/classalps_1_1random__choice_1a3e8c4c895146f08e2c4cea089212afd5)`()` | 
`public template<>`  <br/>`inline  `[`random_choice`](#de/d8a/classalps_1_1random__choice_1a9097d504202f1f8445fda179ccf30a54)`(const CONT & weights)` | 

## Members

#### `public inline  `[`random_choice`](#de/d8a/classalps_1_1random__choice_1a3e8c4c895146f08e2c4cea089212afd5)`()` 

#### `public template<>`  <br/>`inline  `[`random_choice`](#de/d8a/classalps_1_1random__choice_1a9097d504202f1f8445fda179ccf30a54)`(const CONT & weights)` 

# class `alps::random_choice< double >` 

```
class alps::random_choice< double >
  : public alps::detail::random_choice_walker< double, unsigned int, double >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`random_choice`](#dd/d16/classalps_1_1random__choice_3_01double_01_4_1a39af24b852a16a5e82c75781d438c82b)`()` | 
`public template<>`  <br/>`inline  `[`random_choice`](#dd/d16/classalps_1_1random__choice_3_01double_01_4_1a73fdc33ebe415bb17003925473763e27)`(const CONT & weights)` | 

## Members

#### `public inline  `[`random_choice`](#dd/d16/classalps_1_1random__choice_3_01double_01_4_1a39af24b852a16a5e82c75781d438c82b)`()` 

#### `public template<>`  <br/>`inline  `[`random_choice`](#dd/d16/classalps_1_1random__choice_3_01double_01_4_1a73fdc33ebe415bb17003925473763e27)`(const CONT & weights)` 

# class `alps::random_choice< unsigned int >` 

```
class alps::random_choice< unsigned int >
  : public alps::detail::random_choice_walker< unsigned int, unsigned int, double >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`random_choice`](#d3/d3a/classalps_1_1random__choice_3_01unsigned_01int_01_4_1a9b30a34758cc52b6e107ae706443202c)`()` | 
`public template<>`  <br/>`inline  `[`random_choice`](#d3/d3a/classalps_1_1random__choice_3_01unsigned_01int_01_4_1aa8fdeb86390f25b27ac56ccec4bca6fe)`(const CONT & weights)` | 

## Members

#### `public inline  `[`random_choice`](#d3/d3a/classalps_1_1random__choice_3_01unsigned_01int_01_4_1a9b30a34758cc52b6e107ae706443202c)`()` 

#### `public template<>`  <br/>`inline  `[`random_choice`](#d3/d3a/classalps_1_1random__choice_3_01unsigned_01int_01_4_1aa8fdeb86390f25b27ac56ccec4bca6fe)`(const CONT & weights)` 

# class `alps::RNGFactory` 

```
class alps::RNGFactory
  : public factory< std::string, buffered_rng_base >
```  

a factory to create random number generators from their name

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`RNGFactory`](#dc/db5/classalps_1_1_r_n_g_factory_1adfd32274cc1ec785126fbc40a133e85b)`()` | 
`public template<>`  <br/>`inline void `[`register_rng`](#dc/db5/classalps_1_1_r_n_g_factory_1a43eeb0931ca624ae66d1c3f1e66f00cc)`(const std::string & name)` | 

## Members

#### `public  `[`RNGFactory`](#dc/db5/classalps_1_1_r_n_g_factory_1adfd32274cc1ec785126fbc40a133e85b)`()` 

#### `public template<>`  <br/>`inline void `[`register_rng`](#dc/db5/classalps_1_1_r_n_g_factory_1a43eeb0931ca624ae66d1c3f1e66f00cc)`(const std::string & name)` 

# class `alps::uniform_on_sphere_n` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`BOOST_STATIC_CONSTANT`](#de/d44/classalps_1_1uniform__on__sphere__n_1af7a3b1bed9e7af15be8d0966feca0390)`(int,dim)` | 
`public inline  `[`uniform_on_sphere_n`](#de/d44/classalps_1_1uniform__on__sphere__n_1ab0c2cd8a191cb47c127d81b9cdf40445)`()` | 
`public inline void `[`reset`](#de/d44/classalps_1_1uniform__on__sphere__n_1ac0238793ff88600582c131535842034f)`()` | 
`public template<>`  <br/>`inline const result_type & `[`operator()`](#de/d44/classalps_1_1uniform__on__sphere__n_1ab27dca8c159945e8ccb6f4c9b1d6e6bb)`(Engine & eng)` | 
`typedef `[`input_type`](#de/d44/classalps_1_1uniform__on__sphere__n_1a7b15d7638496199229683b425e647a05) | 
`typedef `[`result_type`](#de/d44/classalps_1_1uniform__on__sphere__n_1af95246e5c7d0577cb18a453291c15307) | 

## Members

#### `public  `[`BOOST_STATIC_CONSTANT`](#de/d44/classalps_1_1uniform__on__sphere__n_1af7a3b1bed9e7af15be8d0966feca0390)`(int,dim)` 

#### `public inline  `[`uniform_on_sphere_n`](#de/d44/classalps_1_1uniform__on__sphere__n_1ab0c2cd8a191cb47c127d81b9cdf40445)`()` 

#### `public inline void `[`reset`](#de/d44/classalps_1_1uniform__on__sphere__n_1ac0238793ff88600582c131535842034f)`()` 

#### `public template<>`  <br/>`inline const result_type & `[`operator()`](#de/d44/classalps_1_1uniform__on__sphere__n_1ab27dca8c159945e8ccb6f4c9b1d6e6bb)`(Engine & eng)` 

#### `typedef `[`input_type`](#de/d44/classalps_1_1uniform__on__sphere__n_1a7b15d7638496199229683b425e647a05) 

#### `typedef `[`result_type`](#de/d44/classalps_1_1uniform__on__sphere__n_1af95246e5c7d0577cb18a453291c15307) 

# class `alps::uniform_on_sphere_n< 1, RealType, Cont >` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`BOOST_STATIC_CONSTANT`](#de/d59/classalps_1_1uniform__on__sphere__n_3_011_00_01_real_type_00_01_cont_01_4_1a01c05960312bdd99ca38a95ccaa550d9)`(int,dim)` | 
`public inline  `[`uniform_on_sphere_n`](#de/d59/classalps_1_1uniform__on__sphere__n_3_011_00_01_real_type_00_01_cont_01_4_1acdc93a0663d5936a0c87e7983b0296d6)`()` | 
`public inline void `[`reset`](#de/d59/classalps_1_1uniform__on__sphere__n_3_011_00_01_real_type_00_01_cont_01_4_1a0c0682d649bb4e8a420b93c1b4364af4)`()` | 
`public template<>`  <br/>`inline const result_type & `[`operator()`](#de/d59/classalps_1_1uniform__on__sphere__n_3_011_00_01_real_type_00_01_cont_01_4_1ace89d83de9aa5071305bda9da379bed7)`(Engine & eng)` | 
`typedef `[`input_type`](#de/d59/classalps_1_1uniform__on__sphere__n_3_011_00_01_real_type_00_01_cont_01_4_1a86a3f57fc4cf4835f8887f5ddcdc1bbd) | 
`typedef `[`result_type`](#de/d59/classalps_1_1uniform__on__sphere__n_3_011_00_01_real_type_00_01_cont_01_4_1a997061ec736176f8744a9f1e50e6b700) | 

## Members

#### `public  `[`BOOST_STATIC_CONSTANT`](#de/d59/classalps_1_1uniform__on__sphere__n_3_011_00_01_real_type_00_01_cont_01_4_1a01c05960312bdd99ca38a95ccaa550d9)`(int,dim)` 

#### `public inline  `[`uniform_on_sphere_n`](#de/d59/classalps_1_1uniform__on__sphere__n_3_011_00_01_real_type_00_01_cont_01_4_1acdc93a0663d5936a0c87e7983b0296d6)`()` 

#### `public inline void `[`reset`](#de/d59/classalps_1_1uniform__on__sphere__n_3_011_00_01_real_type_00_01_cont_01_4_1a0c0682d649bb4e8a420b93c1b4364af4)`()` 

#### `public template<>`  <br/>`inline const result_type & `[`operator()`](#de/d59/classalps_1_1uniform__on__sphere__n_3_011_00_01_real_type_00_01_cont_01_4_1ace89d83de9aa5071305bda9da379bed7)`(Engine & eng)` 

#### `typedef `[`input_type`](#de/d59/classalps_1_1uniform__on__sphere__n_3_011_00_01_real_type_00_01_cont_01_4_1a86a3f57fc4cf4835f8887f5ddcdc1bbd) 

#### `typedef `[`result_type`](#de/d59/classalps_1_1uniform__on__sphere__n_3_011_00_01_real_type_00_01_cont_01_4_1a997061ec736176f8744a9f1e50e6b700) 

# class `alps::uniform_on_sphere_n< 2, RealType, Cont >` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`BOOST_STATIC_CONSTANT`](#d1/df9/classalps_1_1uniform__on__sphere__n_3_012_00_01_real_type_00_01_cont_01_4_1addfda7d2ce3c1f89443c33c26df2fb84)`(int,dim)` | 
`public inline  `[`uniform_on_sphere_n`](#d1/df9/classalps_1_1uniform__on__sphere__n_3_012_00_01_real_type_00_01_cont_01_4_1a66f0f221a386cbb1c68bc5697be76cae)`()` | 
`public inline void `[`reset`](#d1/df9/classalps_1_1uniform__on__sphere__n_3_012_00_01_real_type_00_01_cont_01_4_1a32ee8d5c11942e865c6435fd95012d4f)`()` | 
`public template<>`  <br/>`inline const result_type & `[`operator()`](#d1/df9/classalps_1_1uniform__on__sphere__n_3_012_00_01_real_type_00_01_cont_01_4_1a6ee22df0c5ec426f67384ff9b7289f4c)`(Engine & eng)` | 
`typedef `[`input_type`](#d1/df9/classalps_1_1uniform__on__sphere__n_3_012_00_01_real_type_00_01_cont_01_4_1ab59572f844138260644d3d4f21f9c24a) | 
`typedef `[`result_type`](#d1/df9/classalps_1_1uniform__on__sphere__n_3_012_00_01_real_type_00_01_cont_01_4_1aa5dcec4f847c5a30dd8b86cf3082d253) | 

## Members

#### `public  `[`BOOST_STATIC_CONSTANT`](#d1/df9/classalps_1_1uniform__on__sphere__n_3_012_00_01_real_type_00_01_cont_01_4_1addfda7d2ce3c1f89443c33c26df2fb84)`(int,dim)` 

#### `public inline  `[`uniform_on_sphere_n`](#d1/df9/classalps_1_1uniform__on__sphere__n_3_012_00_01_real_type_00_01_cont_01_4_1a66f0f221a386cbb1c68bc5697be76cae)`()` 

#### `public inline void `[`reset`](#d1/df9/classalps_1_1uniform__on__sphere__n_3_012_00_01_real_type_00_01_cont_01_4_1a32ee8d5c11942e865c6435fd95012d4f)`()` 

#### `public template<>`  <br/>`inline const result_type & `[`operator()`](#d1/df9/classalps_1_1uniform__on__sphere__n_3_012_00_01_real_type_00_01_cont_01_4_1a6ee22df0c5ec426f67384ff9b7289f4c)`(Engine & eng)` 

#### `typedef `[`input_type`](#d1/df9/classalps_1_1uniform__on__sphere__n_3_012_00_01_real_type_00_01_cont_01_4_1ab59572f844138260644d3d4f21f9c24a) 

#### `typedef `[`result_type`](#d1/df9/classalps_1_1uniform__on__sphere__n_3_012_00_01_real_type_00_01_cont_01_4_1aa5dcec4f847c5a30dd8b86cf3082d253) 

# class `alps::uniform_on_sphere_n< 3, RealType, Cont >` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`BOOST_STATIC_CONSTANT`](#dd/dee/classalps_1_1uniform__on__sphere__n_3_013_00_01_real_type_00_01_cont_01_4_1a44a82594b6d7b46ae4794894507124fe)`(int,dim)` | 
`public inline  `[`uniform_on_sphere_n`](#dd/dee/classalps_1_1uniform__on__sphere__n_3_013_00_01_real_type_00_01_cont_01_4_1ad5cea4139e68778fcfd319acd634792e)`()` | 
`public inline void `[`reset`](#dd/dee/classalps_1_1uniform__on__sphere__n_3_013_00_01_real_type_00_01_cont_01_4_1ab537fc92474a64261b9ee1bb2287e926)`()` | 
`public template<>`  <br/>`inline const result_type & `[`operator()`](#dd/dee/classalps_1_1uniform__on__sphere__n_3_013_00_01_real_type_00_01_cont_01_4_1aa2b363ff31a01aad06ef3864f965ef81)`(Engine & eng)` | 
`typedef `[`input_type`](#dd/dee/classalps_1_1uniform__on__sphere__n_3_013_00_01_real_type_00_01_cont_01_4_1ab77b4b541064d39a52326e7ae286ff69) | 
`typedef `[`result_type`](#dd/dee/classalps_1_1uniform__on__sphere__n_3_013_00_01_real_type_00_01_cont_01_4_1a5764f1c667f16e902fc1a7d24ca8e975) | 

## Members

#### `public  `[`BOOST_STATIC_CONSTANT`](#dd/dee/classalps_1_1uniform__on__sphere__n_3_013_00_01_real_type_00_01_cont_01_4_1a44a82594b6d7b46ae4794894507124fe)`(int,dim)` 

#### `public inline  `[`uniform_on_sphere_n`](#dd/dee/classalps_1_1uniform__on__sphere__n_3_013_00_01_real_type_00_01_cont_01_4_1ad5cea4139e68778fcfd319acd634792e)`()` 

#### `public inline void `[`reset`](#dd/dee/classalps_1_1uniform__on__sphere__n_3_013_00_01_real_type_00_01_cont_01_4_1ab537fc92474a64261b9ee1bb2287e926)`()` 

#### `public template<>`  <br/>`inline const result_type & `[`operator()`](#dd/dee/classalps_1_1uniform__on__sphere__n_3_013_00_01_real_type_00_01_cont_01_4_1aa2b363ff31a01aad06ef3864f965ef81)`(Engine & eng)` 

#### `typedef `[`input_type`](#dd/dee/classalps_1_1uniform__on__sphere__n_3_013_00_01_real_type_00_01_cont_01_4_1ab77b4b541064d39a52326e7ae286ff69) 

#### `typedef `[`result_type`](#dd/dee/classalps_1_1uniform__on__sphere__n_3_013_00_01_real_type_00_01_cont_01_4_1a5764f1c667f16e902fc1a7d24ca8e975) 

# namespace `alps::detail` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public template<>`  <br/>`inline bool `[`check_table`](#de/d17/random__choice_8hpp_1a78328a6630f13bd86e261cbec7f76897)`(WVEC const & weights,std::vector< std::pair< CutoffType, IndexType > > const & table,double tol)`            | 
`public template<>`  <br/>`inline void `[`fill_ft2009`](#de/d17/random__choice_8hpp_1a6158fca7ce2561db2a30b2a95488b4cf)`(WVEC const & weights,std::vector< std::pair< CutoffType, IndexType > > & table,typename boost::enable_if< boost::is_float< CutoffType > >::type *,typename boost::enable_if< boost::is_integral< IndexType > >::type *)`            | 
`public template<>`  <br/>`inline void `[`fill_ft2009`](#de/d17/random__choice_8hpp_1a32176017c263f0c8866d2fd76fd289aa)`(WVEC const & weights,std::vector< std::pair< CutoffType, IndexType > > & table,typename boost::enable_if< boost::is_integral< CutoffType > >::type *,typename boost::enable_if< boost::is_integral< IndexType > >::type *)`            | 
`public template<>`  <br/>`inline void `[`fill_walker1977`](#de/d17/random__choice_8hpp_1a969fd3e1a1bcccd46553a8245713717b)`(WVEC const & weights,std::vector< std::pair< CutoffType, IndexType > > & table,CutoffType tol,typename boost::enable_if< boost::is_float< CutoffType > >::type *,typename boost::enable_if< boost::is_integral< IndexType > >::type *)`            | 
`class `[`alps::detail::random_choice_bsearch`](#d5/dd2/classalps_1_1detail_1_1random__choice__bsearch) | 
`class `[`alps::detail::random_choice_lsearch`](#dc/d78/classalps_1_1detail_1_1random__choice__lsearch) | 
`class `[`alps::detail::random_choice_walker`](#d9/dbf/classalps_1_1detail_1_1random__choice__walker) | 
`class `[`alps::detail::random_choice_walker< double, IntType, RealType >`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4) | 
`class `[`alps::detail::random_choice_walker< unsigned int, IntType, RealType >`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4) | 

## Members

#### `public template<>`  <br/>`inline bool `[`check_table`](#de/d17/random__choice_8hpp_1a78328a6630f13bd86e261cbec7f76897)`(WVEC const & weights,std::vector< std::pair< CutoffType, IndexType > > const & table,double tol)` 

#### `public template<>`  <br/>`inline void `[`fill_ft2009`](#de/d17/random__choice_8hpp_1a6158fca7ce2561db2a30b2a95488b4cf)`(WVEC const & weights,std::vector< std::pair< CutoffType, IndexType > > & table,typename boost::enable_if< boost::is_float< CutoffType > >::type *,typename boost::enable_if< boost::is_integral< IndexType > >::type *)` 

#### `public template<>`  <br/>`inline void `[`fill_ft2009`](#de/d17/random__choice_8hpp_1a32176017c263f0c8866d2fd76fd289aa)`(WVEC const & weights,std::vector< std::pair< CutoffType, IndexType > > & table,typename boost::enable_if< boost::is_integral< CutoffType > >::type *,typename boost::enable_if< boost::is_integral< IndexType > >::type *)` 

#### `public template<>`  <br/>`inline void `[`fill_walker1977`](#de/d17/random__choice_8hpp_1a969fd3e1a1bcccd46553a8245713717b)`(WVEC const & weights,std::vector< std::pair< CutoffType, IndexType > > & table,CutoffType tol,typename boost::enable_if< boost::is_float< CutoffType > >::type *,typename boost::enable_if< boost::is_integral< IndexType > >::type *)` 

# class `alps::detail::random_choice_bsearch` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`random_choice_bsearch`](#d5/dd2/classalps_1_1detail_1_1random__choice__bsearch_1a0df22aa849f301e7afee876e1d58c8e8)`()` | 
`public template<>`  <br/>`inline  `[`random_choice_bsearch`](#d5/dd2/classalps_1_1detail_1_1random__choice__bsearch_1a685bee11a8b6ee89399e5c5ef2755778)`(CONT const & weights)` | 
`public template<>`  <br/>`inline void `[`init`](#d5/dd2/classalps_1_1detail_1_1random__choice__bsearch_1a5f4718f742769490a34221176963678c)`(CONT const & weights)` | 
`public template<>`  <br/>`inline result_type `[`operator()`](#d5/dd2/classalps_1_1detail_1_1random__choice__bsearch_1a4f406db40db48179fbca86d87fb0b3c7)`(Engine & eng) const` | 
`typedef `[`input_type`](#d5/dd2/classalps_1_1detail_1_1random__choice__bsearch_1ad845b10aa8b85d4c7f6589b869779d88) | 
`typedef `[`result_type`](#d5/dd2/classalps_1_1detail_1_1random__choice__bsearch_1a4e93b48662d75dc6d3d6d1123072d72e) | 

## Members

#### `public inline  `[`random_choice_bsearch`](#d5/dd2/classalps_1_1detail_1_1random__choice__bsearch_1a0df22aa849f301e7afee876e1d58c8e8)`()` 

#### `public template<>`  <br/>`inline  `[`random_choice_bsearch`](#d5/dd2/classalps_1_1detail_1_1random__choice__bsearch_1a685bee11a8b6ee89399e5c5ef2755778)`(CONT const & weights)` 

#### `public template<>`  <br/>`inline void `[`init`](#d5/dd2/classalps_1_1detail_1_1random__choice__bsearch_1a5f4718f742769490a34221176963678c)`(CONT const & weights)` 

#### `public template<>`  <br/>`inline result_type `[`operator()`](#d5/dd2/classalps_1_1detail_1_1random__choice__bsearch_1a4f406db40db48179fbca86d87fb0b3c7)`(Engine & eng) const` 

#### `typedef `[`input_type`](#d5/dd2/classalps_1_1detail_1_1random__choice__bsearch_1ad845b10aa8b85d4c7f6589b869779d88) 

#### `typedef `[`result_type`](#d5/dd2/classalps_1_1detail_1_1random__choice__bsearch_1a4e93b48662d75dc6d3d6d1123072d72e) 

# class `alps::detail::random_choice_lsearch` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`random_choice_lsearch`](#dc/d78/classalps_1_1detail_1_1random__choice__lsearch_1ab06089dab959ae6ca09ed4a53d42bc26)`()` | 
`public template<>`  <br/>`inline  `[`random_choice_lsearch`](#dc/d78/classalps_1_1detail_1_1random__choice__lsearch_1a8a0a2d5095493f00b49fc20134630214)`(CONT const & weights)` | 
`public template<>`  <br/>`inline void `[`init`](#dc/d78/classalps_1_1detail_1_1random__choice__lsearch_1ac10f214454775329be83cc3073b9531e)`(CONT const & weights)` | 
`public template<>`  <br/>`inline result_type `[`operator()`](#dc/d78/classalps_1_1detail_1_1random__choice__lsearch_1ab09945bc67c82b9c7425cde44e6888b6)`(Engine & eng) const` | 
`typedef `[`input_type`](#dc/d78/classalps_1_1detail_1_1random__choice__lsearch_1af67e6df1cb0454c2f84cdc7de12df746) | 
`typedef `[`result_type`](#dc/d78/classalps_1_1detail_1_1random__choice__lsearch_1aef99f5e8222072233c98af08426072a5) | 

## Members

#### `public inline  `[`random_choice_lsearch`](#dc/d78/classalps_1_1detail_1_1random__choice__lsearch_1ab06089dab959ae6ca09ed4a53d42bc26)`()` 

#### `public template<>`  <br/>`inline  `[`random_choice_lsearch`](#dc/d78/classalps_1_1detail_1_1random__choice__lsearch_1a8a0a2d5095493f00b49fc20134630214)`(CONT const & weights)` 

#### `public template<>`  <br/>`inline void `[`init`](#dc/d78/classalps_1_1detail_1_1random__choice__lsearch_1ac10f214454775329be83cc3073b9531e)`(CONT const & weights)` 

#### `public template<>`  <br/>`inline result_type `[`operator()`](#dc/d78/classalps_1_1detail_1_1random__choice__lsearch_1ab09945bc67c82b9c7425cde44e6888b6)`(Engine & eng) const` 

#### `typedef `[`input_type`](#dc/d78/classalps_1_1detail_1_1random__choice__lsearch_1af67e6df1cb0454c2f84cdc7de12df746) 

#### `typedef `[`result_type`](#dc/d78/classalps_1_1detail_1_1random__choice__lsearch_1aef99f5e8222072233c98af08426072a5) 

# class `alps::detail::random_choice_walker` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------

## Members

# class `alps::detail::random_choice_walker< double, IntType, RealType >` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`random_choice_walker`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1ae48d9998702150c6c620e8372bc80cd2)`()` | 
`public template<>`  <br/>`inline  `[`random_choice_walker`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1a68460723f97329ec2cae091ec8a067ac)`(const CONT & weights)` | 
`public template<>`  <br/>`inline void `[`init`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1a6e7078911cad80421a46d352642af71c)`(const CONT & weights)` | 
`public template<>`  <br/>`inline result_type `[`operator()`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1a5c5a6301eaad4b1c94d9c5c1755543ff)`(Engine & eng) const` | 
`public template<>`  <br/>`inline bool `[`check`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1a9d0301f6409c4100aa54e6337a223340)`(const CONT & weights,RealType tol) const` | 
`protected inline IntType `[`size`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1a8ec719cc4f6a8ce5b0ac955dfd127e91)`() const` | 
`protected inline RealType `[`cutoff`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1af42d9bf54f07838ac730cf7ace2f05ed)`(result_type i) const` | 
`protected inline result_type `[`alias`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1ab80b1d6d40faa0553dc5b6a8e872e28c)`(result_type i) const` | 
`typedef `[`input_type`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1a78c94695bc13e1a22541b5adafd439d9) | 
`typedef `[`result_type`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1a7782a3b66b34f6c9bd230afa4b2f9fd5) | 

## Members

#### `public inline  `[`random_choice_walker`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1ae48d9998702150c6c620e8372bc80cd2)`()` 

#### `public template<>`  <br/>`inline  `[`random_choice_walker`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1a68460723f97329ec2cae091ec8a067ac)`(const CONT & weights)` 

#### `public template<>`  <br/>`inline void `[`init`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1a6e7078911cad80421a46d352642af71c)`(const CONT & weights)` 

#### `public template<>`  <br/>`inline result_type `[`operator()`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1a5c5a6301eaad4b1c94d9c5c1755543ff)`(Engine & eng) const` 

#### `public template<>`  <br/>`inline bool `[`check`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1a9d0301f6409c4100aa54e6337a223340)`(const CONT & weights,RealType tol) const` 

#### `protected inline IntType `[`size`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1a8ec719cc4f6a8ce5b0ac955dfd127e91)`() const` 

#### `protected inline RealType `[`cutoff`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1af42d9bf54f07838ac730cf7ace2f05ed)`(result_type i) const` 

#### `protected inline result_type `[`alias`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1ab80b1d6d40faa0553dc5b6a8e872e28c)`(result_type i) const` 

#### `typedef `[`input_type`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1a78c94695bc13e1a22541b5adafd439d9) 

#### `typedef `[`result_type`](#d5/d2d/classalps_1_1detail_1_1random__choice__walker_3_01double_00_01_int_type_00_01_real_type_01_4_1a7782a3b66b34f6c9bd230afa4b2f9fd5) 

# class `alps::detail::random_choice_walker< unsigned int, IntType, RealType >` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`random_choice_walker`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1ad8476de376fffd8fb14da1f0c473fe9a)`()` | 
`public template<>`  <br/>`inline  `[`random_choice_walker`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1ac2f4ef7e983a69b414a2dcb4c78eb3fe)`(const CONT & weights)` | 
`public template<>`  <br/>`inline void `[`init`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1aafc5ce51c354388e439a219a68c91d42)`(const CONT & weights)` | 
`public template<>`  <br/>`inline result_type `[`operator()`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1a6b84ca6d67fd667f5d7aafd3713fe495)`(Engine & eng) const` | 
`public template<>`  <br/>`inline bool `[`check`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1a064e6ef2b6ab38b03398826d5fe8f8e1)`(const CONT & weights,RealType tol) const` | 
`protected inline IntType `[`cutoff`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1aabd24dd58b98f01401d07049b0a23d4b)`(IntType i) const` | 
`protected inline IntType `[`alias`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1a5a6af4549db4d9bc78b725cc77bfa1c9)`(IntType i) const` | 
`typedef `[`input_type`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1a5fe7428f61fa847c66f104dafaf2ea2d) | 
`typedef `[`result_type`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1a0750bee281489eb4fa741c64d2737db8) | 

## Members

#### `public inline  `[`random_choice_walker`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1ad8476de376fffd8fb14da1f0c473fe9a)`()` 

#### `public template<>`  <br/>`inline  `[`random_choice_walker`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1ac2f4ef7e983a69b414a2dcb4c78eb3fe)`(const CONT & weights)` 

#### `public template<>`  <br/>`inline void `[`init`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1aafc5ce51c354388e439a219a68c91d42)`(const CONT & weights)` 

#### `public template<>`  <br/>`inline result_type `[`operator()`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1a6b84ca6d67fd667f5d7aafd3713fe495)`(Engine & eng) const` 

#### `public template<>`  <br/>`inline bool `[`check`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1a064e6ef2b6ab38b03398826d5fe8f8e1)`(const CONT & weights,RealType tol) const` 

#### `protected inline IntType `[`cutoff`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1aabd24dd58b98f01401d07049b0a23d4b)`(IntType i) const` 

#### `protected inline IntType `[`alias`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1a5a6af4549db4d9bc78b725cc77bfa1c9)`(IntType i) const` 

#### `typedef `[`input_type`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1a5fe7428f61fa847c66f104dafaf2ea2d) 

#### `typedef `[`result_type`](#d7/d92/classalps_1_1detail_1_1random__choice__walker_3_01unsigned_01int_00_01_int_type_00_01_real_type_01_4_1a0750bee281489eb4fa741c64d2737db8) 

Generated by [Moxygen](https://sourcey.com/moxygen)
