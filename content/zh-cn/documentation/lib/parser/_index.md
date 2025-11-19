---
title: ALPS/Parser Library
description: "ALPS Parser Library"
weight: 5
---


# Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`namespace `[`alps`](#d8/d3d/namespacealps) | 
`namespace `[`alps::detail`](#d6/d75/namespacealps_1_1detail) | 
`namespace `[`alps::xml`](#da/d4c/namespacealps_1_1xml) | 
`namespace `[`std`](#d8/dcc/namespacestd) | 

# namespace `alps` 


## Members

#### `public std::string `[`parse_identifier`](#d3/df5/parser_8_c_1ad7acfc3d0df11198ff8b26d5c50d5efa)`(std::istream & in)` 

reads an XML tag or attribute name from a `std::istream`

#### `public std::string `[`parse_parameter_name`](#d3/df5/parser_8_c_1a7c2085959fd8e42215655c4525ed3d45)`(std::istream & in)` 

reads an ALPS parameter name from a `std::istream`

valid characters, in addition to those in an XML identifier are `'`, and additionally any arbitrary sequence of characters (including whitespace) surrounded by ``[ ... \ ] characters, such as in `MEASURE`[Staggered `Magnetization^2`] .

#### `public std::string `[`read_until`](#d3/df5/parser_8_c_1a9c6396ca9b36dae30b589d285b4da6d9)`(std::istream & in,char end)` 

reads until the next occurence of the character *end* or until the end of the stream is reached.

#### Parameters
* `in` the stream to be read 

* `end` the character until which should be read 

#### Returns
string containing the characters read, excluding leading and trailing whitespace and excluding the terminating character *end*.

#### `public ALPS_DECL void `[`check_character`](#d3/df5/parser_8_c_1ad96bab53fefb97af96672beaa64adef4)`(std::istream & in,char c,const std::string & err)` 

checks that the next character read from the stream.

#### Parameters
* `in` the stream to be read 

* `c` the character that should be read 

* `err` the error message to be used if the next character is not *c*. 

#### Exceptions
* 

c std::runtime_error( *err*``) if the next character is not *c* reads the next character (slipping white space) and checks if it is the same as the character passed as argument *c* and throws a `std::runtime_error` otherwise.

#### `public `[`XMLTag`](#df/df1/structalps_1_1_x_m_l_tag)` `[`parse_tag`](#d3/df5/parser_8_c_1aa43b01ce479e1ba387fea96e98ba9eff)`(std::istream & in,bool skip_comments)` 

parses an XML tag

#### Parameters
* `in` the stream to be read 

* `skip_comments` if true, the function skips any comments or processing instructions while parsing 

#### Returns
an `[XMLTag](#df/df1/structalps_1_1_x_m_l_tag)` structure containing information about the tag

#### `public std::string `[`parse_content`](#d3/df5/parser_8_c_1a3704a802259862e15a2d2cffc3ae5a66)`(std::istream & in)` 

reads the contents of an element, until the first < character found

#### `public void `[`skip_element`](#d3/df5/parser_8_c_1a03d0b98d8ecc50bbcacf03fb0e156d85)`(std::istream & in,const `[`XMLTag`](#df/df1/structalps_1_1_x_m_l_tag)` & tag)` 

skips an XML element

#### Parameters
* `in` the stream to be read 

* `tag` the opening tag of the element to be skipped the function reads until it finds the closing tag correesponding to the *tag* passed as argument.

#### `public void `[`check_tag`](#d3/df5/parser_8_c_1acbaa7b898feeade68469f8f461e0bcb9)`(std::istream & in,const std::string & name)` 

checks whether the next tag in the XML file has the given name

#### Parameters
* `in` the stream to be read 

* `name` the name of the expected tag 

#### Exceptions
* 

c std::runtime_error if the next tag read from the stream *in* does not have the name given by the argument *name*.

#### `public std::string `[`convert`](#d8/d2e/xmlstream_8_c_1ac9dca637c456e874f76c82543c845e9e)`(const std::string & str)` 

#### `public inline `[`detail::header_t`](#d7/d67/structalps_1_1detail_1_1header__t)` `[`header`](#d9/dd2/xmlstream_8h_1a17db3566a1714cf2717909899462929d)`(const std::string & enc)` 

#### `public inline `[`detail::stylesheet_t`](#d3/d67/structalps_1_1detail_1_1stylesheet__t)` `[`stylesheet`](#d9/dd2/xmlstream_8h_1a664cdc5808c6c095a056c7bf25a6721e)`(const std::string & url)` 

#### `public inline `[`detail::pi_t`](#dd/d44/structalps_1_1detail_1_1pi__t)` `[`processing_instruction`](#d9/dd2/xmlstream_8h_1a4be44a1f80e4c20601b91d17eba6d0a8)`(const std::string & name)` 

#### `public inline `[`detail::start_tag_t`](#d7/d3a/structalps_1_1detail_1_1start__tag__t)` `[`start_tag`](#d9/dd2/xmlstream_8h_1ad1f93da47ed0f66c892368730350513f)`(const std::string & name)` 

#### `public inline `[`detail::end_tag_t`](#d6/d42/structalps_1_1detail_1_1end__tag__t)` `[`end_tag`](#d9/dd2/xmlstream_8h_1a32236c97f81cd29c36c14dacf324d3f2)`(const std::string & name)` 

#### `public template<>`  <br/>`inline `[`detail::attribute_t`](#d5/d0a/structalps_1_1detail_1_1attribute__t)` `[`attribute`](#d9/dd2/xmlstream_8h_1af590053f622870f4ff0e5d157a82a676)`(const std::string & name,const T & value)` 

#### `public inline `[`detail::attribute_t`](#d5/d0a/structalps_1_1detail_1_1attribute__t)` `[`xml_namespace`](#d9/dd2/xmlstream_8h_1a6ae0f77428e99a5234d981b971da4324)`(const std::string & name,const std::string & url)` 

#### `public inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`start_comment`](#d9/dd2/xmlstream_8h_1ac390500b46d3e6d6ec678c6d02f392af)`(`[`oxstream`](#df/daf/classalps_1_1oxstream)` & oxs)` 

#### `public inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`end_comment`](#d9/dd2/xmlstream_8h_1a72fbb73b8285cc4a21dd21b79ecd56ba)`(`[`oxstream`](#df/daf/classalps_1_1oxstream)` & oxs)` 

#### `public inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`start_cdata`](#d9/dd2/xmlstream_8h_1a37e5b7f0df5e949d77611fae5f45fe1f)`(`[`oxstream`](#df/daf/classalps_1_1oxstream)` & oxs)` 

#### `public inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`end_cdata`](#d9/dd2/xmlstream_8h_1ad5e44d46257bdc6c773a58d651bfbb41)`(`[`oxstream`](#df/daf/classalps_1_1oxstream)` & oxs)` 

#### `public inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`no_linebreak`](#d9/dd2/xmlstream_8h_1a4f020b7f5368b24176f7bc64a3289e47)`(`[`oxstream`](#df/daf/classalps_1_1oxstream)` & oxs)` 

#### `public template<>`  <br/>`inline std::string `[`precision`](#d9/dd2/xmlstream_8h_1a72f7a4168e1230f596a37ae746f331e1)`(const T & d,int n)` 

#### `public ALPS_DECL std::string `[`xslt_path`](#d8/d57/xslt__path_8h_1a65bd4ab73e4f7403f61bce7141eeb5d5)`(const std::string & stylefile)` 

given the name of an XSLT file, return the full path

The default behavior is to just return the file name

If the environment variable ALPS_XSLT_PATH is set, the contents of ALPS_XSLT_PATH are used instead of the default path.

#### `public ALPS_DECL std::string `[`search_xml_library_path`](#d8/d57/xslt__path_8h_1af488068133d67a3b7c2b12c9423aa7bb)`(const std::string & file)` 

returns the full path to the specified XML file and checks whether the file exists.

The function prepends the path to the ALPS XML/XSLT library directory to the specified filename. 
#### Exceptions
* 

c std::runtime_error if the file does not exist in the ALPS XML/XSLT library directory.

#### `public ALPS_DECL void `[`copy_stylesheet`](#d8/d57/xslt__path_8h_1ae6c723347c5ed8b885617410f3a1b043)`(boost::filesystem::path const & dir)` 

copies the ALPS.xsl stylesheet to the specifeid directory

This function copies the ALPS.xsl stylesheet to the specified directory. The function does not overwrite an already existing file with the name ALPS.xsl

# class `alps::CompositeXMLHandler` 

```
class alps::CompositeXMLHandler
  : public alps::XMLHandlerBase
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`CompositeXMLHandler`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a7853a5728dbef8f553753cde145363d9)`(const std::string & basename)` | 
`public inline virtual  `[`~CompositeXMLHandler`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1ad0361c25911f431e7182f391271a94b7)`()` | 
`public inline void `[`clear_handler`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a22329c9250888e1918ee216c0f91f402)`()` | 
`public void `[`add_handler`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a3b887a13726e67947f837eeece52622d)`(`[`XMLHandlerBase`](#dd/dd6/classalps_1_1_x_m_l_handler_base)` & handler)` | 
`public bool `[`has_handler`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1ac5719a4615b8a3a39a93be51e6297ee9)`(const `[`XMLHandlerBase`](#dd/dd6/classalps_1_1_x_m_l_handler_base)` & handler) const` | 
`public bool `[`has_handler`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a0de3fc077eef38bf21b5b3c49b9cc340)`(const std::string & name) const` | 
`public virtual void `[`start_element`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1aecb810ae7697a5369eb54423d6cb8281)`(const std::string & name,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & attributes,xml::tag_type type)` | 
`public virtual void `[`end_element`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1ac0aaaa123a36ea664aa454d9fc42caeb)`(const std::string & name,xml::tag_type type)` | 
`public virtual void `[`text`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a605bcc2e0e83198ca1ee6e523e07d098)`(const std::string & text)` | 
`protected inline virtual void `[`start_top`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a35b0f86c3ffd656262f0a21a97703b73)`(const std::string &,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` &,xml::tag_type)` | 
`protected inline virtual void `[`end_top`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a31bcb6d07e7361a0371f5e884ea76e62)`(const std::string &,xml::tag_type)` | 
`protected inline virtual void `[`start_child`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1ace4bbeffb013242e2ed192ac86a2ee37)`(const std::string &,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` &,xml::tag_type)` | 
`protected inline virtual void `[`end_child`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a12a1450fc524f71b666a64e41b6069af)`(const std::string &,xml::tag_type)` | 
`protected inline virtual bool `[`start_element_impl`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1acf4dbd7d13d83e7be57066c3ddba8e2e)`(const std::string &,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` &,xml::tag_type)` | 
`protected inline virtual bool `[`end_element_impl`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1aff2df4d4fd7706d3eb98f2347a3f4f2e)`(const std::string &,xml::tag_type)` | 
`protected inline virtual bool `[`text_impl`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a1b893fbe5749b6ee3cc3368225771adc)`(const std::string &)` | 

## Members

#### `public inline  `[`CompositeXMLHandler`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a7853a5728dbef8f553753cde145363d9)`(const std::string & basename)` 

#### `public inline virtual  `[`~CompositeXMLHandler`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1ad0361c25911f431e7182f391271a94b7)`()` 

#### `public inline void `[`clear_handler`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a22329c9250888e1918ee216c0f91f402)`()` 

#### `public void `[`add_handler`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a3b887a13726e67947f837eeece52622d)`(`[`XMLHandlerBase`](#dd/dd6/classalps_1_1_x_m_l_handler_base)` & handler)` 

#### `public bool `[`has_handler`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1ac5719a4615b8a3a39a93be51e6297ee9)`(const `[`XMLHandlerBase`](#dd/dd6/classalps_1_1_x_m_l_handler_base)` & handler) const` 

#### `public bool `[`has_handler`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a0de3fc077eef38bf21b5b3c49b9cc340)`(const std::string & name) const` 

#### `public virtual void `[`start_element`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1aecb810ae7697a5369eb54423d6cb8281)`(const std::string & name,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & attributes,xml::tag_type type)` 

#### `public virtual void `[`end_element`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1ac0aaaa123a36ea664aa454d9fc42caeb)`(const std::string & name,xml::tag_type type)` 

#### `public virtual void `[`text`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a605bcc2e0e83198ca1ee6e523e07d098)`(const std::string & text)` 

#### `protected inline virtual void `[`start_top`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a35b0f86c3ffd656262f0a21a97703b73)`(const std::string &,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` &,xml::tag_type)` 

#### `protected inline virtual void `[`end_top`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a31bcb6d07e7361a0371f5e884ea76e62)`(const std::string &,xml::tag_type)` 

#### `protected inline virtual void `[`start_child`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1ace4bbeffb013242e2ed192ac86a2ee37)`(const std::string &,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` &,xml::tag_type)` 

#### `protected inline virtual void `[`end_child`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a12a1450fc524f71b666a64e41b6069af)`(const std::string &,xml::tag_type)` 

#### `protected inline virtual bool `[`start_element_impl`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1acf4dbd7d13d83e7be57066c3ddba8e2e)`(const std::string &,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` &,xml::tag_type)` 

#### `protected inline virtual bool `[`end_element_impl`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1aff2df4d4fd7706d3eb98f2347a3f4f2e)`(const std::string &,xml::tag_type)` 

#### `protected inline virtual bool `[`text_impl`](#dc/d81/classalps_1_1_composite_x_m_l_handler_1a1b893fbe5749b6ee3cc3368225771adc)`(const std::string &)` 

# class `alps::DummyXMLHandler` 

```
class alps::DummyXMLHandler
  : public alps::XMLHandlerBase
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`DummyXMLHandler`](#d1/d39/classalps_1_1_dummy_x_m_l_handler_1a29d794009e295ae2b96d366b45577a91)`(const std::string & basename)` | 
`public inline virtual void `[`start_element`](#d1/d39/classalps_1_1_dummy_x_m_l_handler_1ae8757991f374c33808dcc73dccdd009b)`(const std::string &,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` &,xml::tag_type)` | 
`public inline virtual void `[`end_element`](#d1/d39/classalps_1_1_dummy_x_m_l_handler_1acaf82ec046952bcf6205300eae1376cd)`(const std::string &,xml::tag_type)` | 
`public inline virtual void `[`text`](#d1/d39/classalps_1_1_dummy_x_m_l_handler_1a314c4bdc2df9f6276f605f9392661a10)`(const std::string &)` | 

## Members

#### `public inline  `[`DummyXMLHandler`](#d1/d39/classalps_1_1_dummy_x_m_l_handler_1a29d794009e295ae2b96d366b45577a91)`(const std::string & basename)` 

#### `public inline virtual void `[`start_element`](#d1/d39/classalps_1_1_dummy_x_m_l_handler_1ae8757991f374c33808dcc73dccdd009b)`(const std::string &,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` &,xml::tag_type)` 

#### `public inline virtual void `[`end_element`](#d1/d39/classalps_1_1_dummy_x_m_l_handler_1acaf82ec046952bcf6205300eae1376cd)`(const std::string &,xml::tag_type)` 

#### `public inline virtual void `[`text`](#d1/d39/classalps_1_1_dummy_x_m_l_handler_1a314c4bdc2df9f6276f605f9392661a10)`(const std::string &)` 

# class `alps::oxstream` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`oxstream`](#df/daf/classalps_1_1oxstream_1ab9dad1fb043545564980f17cd0106e1e)`()` | 
`public  `[`oxstream`](#df/daf/classalps_1_1oxstream_1ae15e54084220eedf1932cd4da657af15)`(std::ostream & os,uint32_t incr)` | 
`public  `[`oxstream`](#df/daf/classalps_1_1oxstream_1aabfa77f424a0e8295aba165d495df042)`(const boost::filesystem::path & file,uint32_t incr)` | 
`public  `[`~oxstream`](#df/daf/classalps_1_1oxstream_1a58d7323856ff41c4f3f099946e60c328)`()` | 
`public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1a6010b768305926945ce5b6f68d738abe)`(const `[`detail::header_t`](#d7/d67/structalps_1_1detail_1_1header__t)` & c)` | 
`public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1a2ca7f632269abd29b317f74588b851d2)`(const `[`detail::start_tag_t`](#d7/d3a/structalps_1_1detail_1_1start__tag__t)` & c)` | 
`public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1af893a84ddf29f53b25b8f4e4ec0a41ee)`(const `[`detail::end_tag_t`](#d6/d42/structalps_1_1detail_1_1end__tag__t)` & c)` | 
`public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1afbef3d65506e823fab4021bb4ce1f66e)`(const `[`detail::stylesheet_t`](#d3/d67/structalps_1_1detail_1_1stylesheet__t)` & c)` | 
`public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1a610b3db27f18901c7c92091062cf90bf)`(const `[`detail::attribute_t`](#d5/d0a/structalps_1_1detail_1_1attribute__t)` & c)` | 
`public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1ae6efb4362e526e9a5678e1ae1cb093ff)`(const `[`detail::pi_t`](#dd/d44/structalps_1_1detail_1_1pi__t)` & c)` | 
`public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`start_comment`](#df/daf/classalps_1_1oxstream_1aaabf2ef571189d259622824b285c5c58)`()` | 
`public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`end_comment`](#df/daf/classalps_1_1oxstream_1a0ad2b48e8b0623db82657f0356845195)`()` | 
`public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`start_cdata`](#df/daf/classalps_1_1oxstream_1a3cfea240a2da399a4479f2c7f6bd902b)`()` | 
`public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`end_cdata`](#df/daf/classalps_1_1oxstream_1a2c968e6e79dbc36fa38ef640904b1932)`()` | 
`public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`no_linebreak`](#df/daf/classalps_1_1oxstream_1a9fb15fe55e0c332f78c6c394f05535a1)`()` | 
`public inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`endl`](#df/daf/classalps_1_1oxstream_1a89630927328aedb21ac808f19a5a839b)`()` | 
`public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1a19e819e05a1f9d29b05b6b68ce01b40a)`(const `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute)` & c)` | 
`public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1a79ff08e8e8b34a2c3fa157cbc37ec2c7)`(const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & c)` | 
`public inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1ae31aae8de2e171907c5d94f843e962ab)`(const std::string & t)` | 
`public inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1a08ca288a2d50a1f082dff1c42e152326)`(const char t)` | 
`public inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1af04b6935ed88467215b6b173f355c5ec)`(const char * t)` | 
`public template<>`  <br/>`inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1aec830a2192d157332aac12d87e2f7a22)`(const std::complex< T > & t)` | 
`public template<>`  <br/>`inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1aa2da3aa072953b584c6918e5cea614bb)`(T(*)(const std::string &) fn)` | 
`public inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1adfa65bcebdfb8234db5f854561273862)`(`[`oxstream](#df/daf/classalps_1_1oxstream) &(*)([oxstream`](#df/daf/classalps_1_1oxstream) &oxs)` fn)` | 
`public inline std::ostream & `[`stream`](#df/daf/classalps_1_1oxstream_1a931eff32f3a706cf7a6de0b426589f8d)`()` | 
`protected `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`text_str`](#df/daf/classalps_1_1oxstream_1a946752db5335bcf44c787579d8e7f5d2)`(const std::string & text)` | 
`protected void `[`output`](#df/daf/classalps_1_1oxstream_1ab723e76e419ab78a6e2bd3f0a395e6b4)`(bool close)` | 
`protected void `[`output_offset`](#df/daf/classalps_1_1oxstream_1a7c0a1bcbeb6d8e86d40557dae773a861)`()` | 

## Members

#### `public  `[`oxstream`](#df/daf/classalps_1_1oxstream_1ab9dad1fb043545564980f17cd0106e1e)`()` 

#### `public  `[`oxstream`](#df/daf/classalps_1_1oxstream_1ae15e54084220eedf1932cd4da657af15)`(std::ostream & os,uint32_t incr)` 

#### `public  `[`oxstream`](#df/daf/classalps_1_1oxstream_1aabfa77f424a0e8295aba165d495df042)`(const boost::filesystem::path & file,uint32_t incr)` 

#### `public  `[`~oxstream`](#df/daf/classalps_1_1oxstream_1a58d7323856ff41c4f3f099946e60c328)`()` 

#### `public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1a6010b768305926945ce5b6f68d738abe)`(const `[`detail::header_t`](#d7/d67/structalps_1_1detail_1_1header__t)` & c)` 

#### `public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1a2ca7f632269abd29b317f74588b851d2)`(const `[`detail::start_tag_t`](#d7/d3a/structalps_1_1detail_1_1start__tag__t)` & c)` 

#### `public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1af893a84ddf29f53b25b8f4e4ec0a41ee)`(const `[`detail::end_tag_t`](#d6/d42/structalps_1_1detail_1_1end__tag__t)` & c)` 

#### `public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1afbef3d65506e823fab4021bb4ce1f66e)`(const `[`detail::stylesheet_t`](#d3/d67/structalps_1_1detail_1_1stylesheet__t)` & c)` 

#### `public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1a610b3db27f18901c7c92091062cf90bf)`(const `[`detail::attribute_t`](#d5/d0a/structalps_1_1detail_1_1attribute__t)` & c)` 

#### `public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1ae6efb4362e526e9a5678e1ae1cb093ff)`(const `[`detail::pi_t`](#dd/d44/structalps_1_1detail_1_1pi__t)` & c)` 

#### `public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`start_comment`](#df/daf/classalps_1_1oxstream_1aaabf2ef571189d259622824b285c5c58)`()` 

#### `public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`end_comment`](#df/daf/classalps_1_1oxstream_1a0ad2b48e8b0623db82657f0356845195)`()` 

#### `public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`start_cdata`](#df/daf/classalps_1_1oxstream_1a3cfea240a2da399a4479f2c7f6bd902b)`()` 

#### `public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`end_cdata`](#df/daf/classalps_1_1oxstream_1a2c968e6e79dbc36fa38ef640904b1932)`()` 

#### `public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`no_linebreak`](#df/daf/classalps_1_1oxstream_1a9fb15fe55e0c332f78c6c394f05535a1)`()` 

#### `public inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`endl`](#df/daf/classalps_1_1oxstream_1a89630927328aedb21ac808f19a5a839b)`()` 

#### `public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1a19e819e05a1f9d29b05b6b68ce01b40a)`(const `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute)` & c)` 

#### `public `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1a79ff08e8e8b34a2c3fa157cbc37ec2c7)`(const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & c)` 

#### `public inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1ae31aae8de2e171907c5d94f843e962ab)`(const std::string & t)` 

#### `public inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1a08ca288a2d50a1f082dff1c42e152326)`(const char t)` 

#### `public inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1af04b6935ed88467215b6b173f355c5ec)`(const char * t)` 

#### `public template<>`  <br/>`inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1aec830a2192d157332aac12d87e2f7a22)`(const std::complex< T > & t)` 

#### `public template<>`  <br/>`inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1aa2da3aa072953b584c6918e5cea614bb)`(T(*)(const std::string &) fn)` 

#### `public inline `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`operator<<`](#df/daf/classalps_1_1oxstream_1adfa65bcebdfb8234db5f854561273862)`(`[`oxstream](#df/daf/classalps_1_1oxstream) &(*)([oxstream`](#df/daf/classalps_1_1oxstream) &oxs)` fn)` 

#### `public inline std::ostream & `[`stream`](#df/daf/classalps_1_1oxstream_1a931eff32f3a706cf7a6de0b426589f8d)`()` 

#### `protected `[`oxstream`](#df/daf/classalps_1_1oxstream)` & `[`text_str`](#df/daf/classalps_1_1oxstream_1a946752db5335bcf44c787579d8e7f5d2)`(const std::string & text)` 

#### `protected void `[`output`](#df/daf/classalps_1_1oxstream_1ab723e76e419ab78a6e2bd3f0a395e6b4)`(bool close)` 

#### `protected void `[`output_offset`](#df/daf/classalps_1_1oxstream_1a7c0a1bcbeb6d8e86d40557dae773a861)`()` 

# class `alps::PrintXMLHandler` 

```
class alps::PrintXMLHandler
  : public alps::XMLHandlerBase
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`PrintXMLHandler`](#da/d90/classalps_1_1_print_x_m_l_handler_1a257c77a4e7c56375b4b91f3b542c32e0)`(std::ostream & os)` | 
`public inline virtual void `[`start_element`](#da/d90/classalps_1_1_print_x_m_l_handler_1aab24b7198491d12c2cb9002a89d82113)`(const std::string & name,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & attributes,xml::tag_type type)` | 
`public inline virtual void `[`end_element`](#da/d90/classalps_1_1_print_x_m_l_handler_1a79b0587982a20f7d2d01cbd64350ffee)`(const std::string & name,xml::tag_type type)` | 
`public inline virtual void `[`text`](#da/d90/classalps_1_1_print_x_m_l_handler_1aae2d7e820831b07577c636508792d2a2)`(const std::string & text)` | 

## Members

#### `public inline  `[`PrintXMLHandler`](#da/d90/classalps_1_1_print_x_m_l_handler_1a257c77a4e7c56375b4b91f3b542c32e0)`(std::ostream & os)` 

#### `public inline virtual void `[`start_element`](#da/d90/classalps_1_1_print_x_m_l_handler_1aab24b7198491d12c2cb9002a89d82113)`(const std::string & name,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & attributes,xml::tag_type type)` 

#### `public inline virtual void `[`end_element`](#da/d90/classalps_1_1_print_x_m_l_handler_1a79b0587982a20f7d2d01cbd64350ffee)`(const std::string & name,xml::tag_type type)` 

#### `public inline virtual void `[`text`](#da/d90/classalps_1_1_print_x_m_l_handler_1aae2d7e820831b07577c636508792d2a2)`(const std::string & text)` 

# class `alps::SimpleXMLHandler` 

```
class alps::SimpleXMLHandler
  : public alps::XMLHandlerBase
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`SimpleXMLHandler`](#df/de0/classalps_1_1_simple_x_m_l_handler_1a56ef687f0e7d5e8fd9c4471c0953ce2d)`(const std::string & basename,T & val,const std::string & attr)` | 
`public inline virtual  `[`~SimpleXMLHandler`](#df/de0/classalps_1_1_simple_x_m_l_handler_1af76215efd1331a83cc806b28e2ff9f99)`()` | 
`public inline virtual void `[`start_element`](#df/de0/classalps_1_1_simple_x_m_l_handler_1a7c6c8d5018f82001ec11b4d2cfe732c4)`(const std::string & name,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & attributes,xml::tag_type type)` | 
`public inline virtual void `[`end_element`](#df/de0/classalps_1_1_simple_x_m_l_handler_1aed6fe771b9255a64d76ebcdeddf8336a)`(const std::string & name,xml::tag_type type)` | 
`public inline virtual void `[`text`](#df/de0/classalps_1_1_simple_x_m_l_handler_1a012f48d25821e782dee1dbaff7726a48)`(const std::string & text)` | 
`typedef `[`value_type`](#df/de0/classalps_1_1_simple_x_m_l_handler_1ad8e0bb0394cc4243563f275807abe8e9) | 

## Members

#### `public inline  `[`SimpleXMLHandler`](#df/de0/classalps_1_1_simple_x_m_l_handler_1a56ef687f0e7d5e8fd9c4471c0953ce2d)`(const std::string & basename,T & val,const std::string & attr)` 

#### `public inline virtual  `[`~SimpleXMLHandler`](#df/de0/classalps_1_1_simple_x_m_l_handler_1af76215efd1331a83cc806b28e2ff9f99)`()` 

#### `public inline virtual void `[`start_element`](#df/de0/classalps_1_1_simple_x_m_l_handler_1a7c6c8d5018f82001ec11b4d2cfe732c4)`(const std::string & name,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & attributes,xml::tag_type type)` 

#### `public inline virtual void `[`end_element`](#df/de0/classalps_1_1_simple_x_m_l_handler_1aed6fe771b9255a64d76ebcdeddf8336a)`(const std::string & name,xml::tag_type type)` 

#### `public inline virtual void `[`text`](#df/de0/classalps_1_1_simple_x_m_l_handler_1a012f48d25821e782dee1dbaff7726a48)`(const std::string & text)` 

#### `typedef `[`value_type`](#df/de0/classalps_1_1_simple_x_m_l_handler_1ad8e0bb0394cc4243563f275807abe8e9) 

# class `alps::StylesheetXMLHandler` 

```
class alps::StylesheetXMLHandler
  : public alps::XMLHandlerBase
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`StylesheetXMLHandler`](#dd/d5c/classalps_1_1_stylesheet_x_m_l_handler_1a217b09836d0c0712b8862abac5bbca11)`(std::string & style)` | 
`public inline virtual void `[`start_element`](#dd/d5c/classalps_1_1_stylesheet_x_m_l_handler_1ae49b97cd3513747be336c8ff74282f00)`(const std::string &,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & attributes,xml::tag_type type)` | 
`public inline virtual void `[`end_element`](#dd/d5c/classalps_1_1_stylesheet_x_m_l_handler_1a408fee77319b067c1803d1fadb83ee61)`(const std::string &,xml::tag_type)` | 
`public inline virtual void `[`text`](#dd/d5c/classalps_1_1_stylesheet_x_m_l_handler_1af4588becd81591645a884b0eabd99163)`(const std::string &)` | 

## Members

#### `public inline  `[`StylesheetXMLHandler`](#dd/d5c/classalps_1_1_stylesheet_x_m_l_handler_1a217b09836d0c0712b8862abac5bbca11)`(std::string & style)` 

#### `public inline virtual void `[`start_element`](#dd/d5c/classalps_1_1_stylesheet_x_m_l_handler_1ae49b97cd3513747be336c8ff74282f00)`(const std::string &,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & attributes,xml::tag_type type)` 

#### `public inline virtual void `[`end_element`](#dd/d5c/classalps_1_1_stylesheet_x_m_l_handler_1a408fee77319b067c1803d1fadb83ee61)`(const std::string &,xml::tag_type)` 

#### `public inline virtual void `[`text`](#dd/d5c/classalps_1_1_stylesheet_x_m_l_handler_1af4588becd81591645a884b0eabd99163)`(const std::string &)` 

# class `alps::VectorXMLHandler` 

```
class alps::VectorXMLHandler
  : public alps::CompositeXMLHandler
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`VectorXMLHandler`](#d2/d62/classalps_1_1_vector_x_m_l_handler_1a2af51825fae63e69fb7be813041acad6)`(const std::string & basename,C & cont,T & val,H & handler)` | 
`public inline virtual  `[`~VectorXMLHandler`](#d2/d62/classalps_1_1_vector_x_m_l_handler_1a90c9de5bc103a62f30393a02b4ce9c32)`()` | 
`protected inline virtual void `[`end_child`](#d2/d62/classalps_1_1_vector_x_m_l_handler_1a563b7b03928b00988d4b1e14290857cf)`(const std::string & name,xml::tag_type type)` | 

## Members

#### `public inline  `[`VectorXMLHandler`](#d2/d62/classalps_1_1_vector_x_m_l_handler_1a2af51825fae63e69fb7be813041acad6)`(const std::string & basename,C & cont,T & val,H & handler)` 

#### `public inline virtual  `[`~VectorXMLHandler`](#d2/d62/classalps_1_1_vector_x_m_l_handler_1a90c9de5bc103a62f30393a02b4ce9c32)`()` 

#### `protected inline virtual void `[`end_child`](#d2/d62/classalps_1_1_vector_x_m_l_handler_1a563b7b03928b00988d4b1e14290857cf)`(const std::string & name,xml::tag_type type)` 

# class `alps::XMLAttribute` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute_1a78ccb80d0467a4d0369e9de007154b15)`(const `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute)` & attr)` | 
`public inline  `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute_1a5debcc599c7e49e9dab7c7a5df0b20cb)`(const key_type & k)` | 
`public inline  `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute_1a6e917e34eee502f8db74244686c2e44c)`(const key_type & k,const value_type & v)` | 
`public inline  `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute_1aa26178bfbf316bfa55f4090852098099)`(const key_type & k,const char * v)` | 
`public template<>`  <br/>`inline  `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute_1a49ad72018b618bb7da7c3ed7738e8a70)`(const key_type & k,const T & v)` | 
`public inline key_type & `[`key`](#df/d0f/classalps_1_1_x_m_l_attribute_1acd23ec806732dd7ff6ea5812d8945ee3)`()` | 
`public inline const key_type & `[`key`](#df/d0f/classalps_1_1_x_m_l_attribute_1a9563d7ea67f6035e660d7a9d77c4be71)`() const` | 
`public inline value_type & `[`value`](#df/d0f/classalps_1_1_x_m_l_attribute_1affd8eff9c7ec51f9d17538eb8b8b0e09)`()` | 
`public inline const value_type & `[`value`](#df/d0f/classalps_1_1_x_m_l_attribute_1afd897f418bddf3c834aa5d5470290719)`() const` | 
`typedef `[`key_type`](#df/d0f/classalps_1_1_x_m_l_attribute_1a86883c9275afb1418074def7d8675361) | 
`typedef `[`value_type`](#df/d0f/classalps_1_1_x_m_l_attribute_1a6c785f9e8bbf96f9da4bbbf4c1914226) | 

## Members

#### `public inline  `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute_1a78ccb80d0467a4d0369e9de007154b15)`(const `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute)` & attr)` 

#### `public inline  `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute_1a5debcc599c7e49e9dab7c7a5df0b20cb)`(const key_type & k)` 

#### `public inline  `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute_1a6e917e34eee502f8db74244686c2e44c)`(const key_type & k,const value_type & v)` 

#### `public inline  `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute_1aa26178bfbf316bfa55f4090852098099)`(const key_type & k,const char * v)` 

#### `public template<>`  <br/>`inline  `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute_1a49ad72018b618bb7da7c3ed7738e8a70)`(const key_type & k,const T & v)` 

#### `public inline key_type & `[`key`](#df/d0f/classalps_1_1_x_m_l_attribute_1acd23ec806732dd7ff6ea5812d8945ee3)`()` 

#### `public inline const key_type & `[`key`](#df/d0f/classalps_1_1_x_m_l_attribute_1a9563d7ea67f6035e660d7a9d77c4be71)`() const` 

#### `public inline value_type & `[`value`](#df/d0f/classalps_1_1_x_m_l_attribute_1affd8eff9c7ec51f9d17538eb8b8b0e09)`()` 

#### `public inline const value_type & `[`value`](#df/d0f/classalps_1_1_x_m_l_attribute_1afd897f418bddf3c834aa5d5470290719)`() const` 

#### `typedef `[`key_type`](#df/d0f/classalps_1_1_x_m_l_attribute_1a86883c9275afb1418074def7d8675361) 

#### `typedef `[`value_type`](#df/d0f/classalps_1_1_x_m_l_attribute_1a6c785f9e8bbf96f9da4bbbf4c1914226) 

# class `alps::XMLAttributes` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes_1a7a85a124e75c5ececb3dc0cf40c879af)`()` | 
`public  `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes_1a9e5454a1a4ee95695c762fe8c6166a9c)`(const std::string & str)` | 
`public inline void `[`clear`](#db/d77/classalps_1_1_x_m_l_attributes_1a4fee593fa649f256b375fde5a682edb3)`()` | 
`public inline size_type `[`size`](#db/d77/classalps_1_1_x_m_l_attributes_1a02a9d4bf2a15532fc25ae8dc79d28c06)`() const` | 
`public inline bool `[`defined`](#db/d77/classalps_1_1_x_m_l_attributes_1a456c1b11884f5af004fcece9a2690853)`(const key_type & k) const` | 
`public inline value_type & `[`operator[]`](#db/d77/classalps_1_1_x_m_l_attributes_1a4a53c27a1fd47fe929a00371401dead9)`(const key_type & k)` | 
`public inline const value_type & `[`operator[]`](#db/d77/classalps_1_1_x_m_l_attributes_1ab2d448de860e63e27a9cc79ed32558ab)`(const key_type & k) const` | 
`public inline value_type `[`value_or_default`](#db/d77/classalps_1_1_x_m_l_attributes_1aaea57af015930c26ab0554078065a576)`(const key_type & k,const value_type & v) const` | 
`public inline iterator `[`begin`](#db/d77/classalps_1_1_x_m_l_attributes_1aa02c094f7073e2f1ec8326573e5e5f0e)`()` | 
`public inline const_iterator `[`begin`](#db/d77/classalps_1_1_x_m_l_attributes_1a8bd6b8ae01a9f49c340e81d468c007d0)`() const` | 
`public inline iterator `[`end`](#db/d77/classalps_1_1_x_m_l_attributes_1afd1313a4dd995195a4a63a2ed940ff3c)`()` | 
`public inline const_iterator `[`end`](#db/d77/classalps_1_1_x_m_l_attributes_1af5084ecdda3f7362b4ce722f4da6444b)`() const` | 
`public void `[`push_back`](#db/d77/classalps_1_1_x_m_l_attributes_1a3208bfd7530fa07abfedefb99f1b73dc)`(const `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute)` & attr)` | 
`public inline void `[`push_back`](#db/d77/classalps_1_1_x_m_l_attributes_1a154d3b2a6cc1d5fc8c5d6290e1092810)`(const key_type & k,const value_type & v)` | 
`public inline `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & `[`operator<<`](#db/d77/classalps_1_1_x_m_l_attributes_1a31cd0606daba8cbffdd4776eec17b4d6)`(const `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute)` & a)` | 
`public inline `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & `[`operator<<`](#db/d77/classalps_1_1_x_m_l_attributes_1a96e88827c9c4ac93f0f25b4d2ca5cc05)`(const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & attr)` | 
`typedef `[`key_type`](#db/d77/classalps_1_1_x_m_l_attributes_1ada8b8ec0c860ed78217ee8bf1625860e) | 
`typedef `[`value_type`](#db/d77/classalps_1_1_x_m_l_attributes_1ab1b262211acbeff8e3d60308dd9721c4) | 
`typedef `[`list_type`](#db/d77/classalps_1_1_x_m_l_attributes_1abe89b8af3e787f63169e992298f4c322) | 
`typedef `[`size_type`](#db/d77/classalps_1_1_x_m_l_attributes_1addfae7ac3501c9294e71e2b40771582f) | 
`typedef `[`iterator`](#db/d77/classalps_1_1_x_m_l_attributes_1a35291875261330e1ba9e24aeb7d5607e) | 
`typedef `[`const_iterator`](#db/d77/classalps_1_1_x_m_l_attributes_1a18f21d03abeac1db1dcbc13649429510) | 

## Members

#### `public inline  `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes_1a7a85a124e75c5ececb3dc0cf40c879af)`()` 

#### `public  `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes_1a9e5454a1a4ee95695c762fe8c6166a9c)`(const std::string & str)` 

#### `public inline void `[`clear`](#db/d77/classalps_1_1_x_m_l_attributes_1a4fee593fa649f256b375fde5a682edb3)`()` 

#### `public inline size_type `[`size`](#db/d77/classalps_1_1_x_m_l_attributes_1a02a9d4bf2a15532fc25ae8dc79d28c06)`() const` 

#### `public inline bool `[`defined`](#db/d77/classalps_1_1_x_m_l_attributes_1a456c1b11884f5af004fcece9a2690853)`(const key_type & k) const` 

#### `public inline value_type & `[`operator[]`](#db/d77/classalps_1_1_x_m_l_attributes_1a4a53c27a1fd47fe929a00371401dead9)`(const key_type & k)` 

#### `public inline const value_type & `[`operator[]`](#db/d77/classalps_1_1_x_m_l_attributes_1ab2d448de860e63e27a9cc79ed32558ab)`(const key_type & k) const` 

#### `public inline value_type `[`value_or_default`](#db/d77/classalps_1_1_x_m_l_attributes_1aaea57af015930c26ab0554078065a576)`(const key_type & k,const value_type & v) const` 

#### `public inline iterator `[`begin`](#db/d77/classalps_1_1_x_m_l_attributes_1aa02c094f7073e2f1ec8326573e5e5f0e)`()` 

#### `public inline const_iterator `[`begin`](#db/d77/classalps_1_1_x_m_l_attributes_1a8bd6b8ae01a9f49c340e81d468c007d0)`() const` 

#### `public inline iterator `[`end`](#db/d77/classalps_1_1_x_m_l_attributes_1afd1313a4dd995195a4a63a2ed940ff3c)`()` 

#### `public inline const_iterator `[`end`](#db/d77/classalps_1_1_x_m_l_attributes_1af5084ecdda3f7362b4ce722f4da6444b)`() const` 

#### `public void `[`push_back`](#db/d77/classalps_1_1_x_m_l_attributes_1a3208bfd7530fa07abfedefb99f1b73dc)`(const `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute)` & attr)` 

#### `public inline void `[`push_back`](#db/d77/classalps_1_1_x_m_l_attributes_1a154d3b2a6cc1d5fc8c5d6290e1092810)`(const key_type & k,const value_type & v)` 

#### `public inline `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & `[`operator<<`](#db/d77/classalps_1_1_x_m_l_attributes_1a31cd0606daba8cbffdd4776eec17b4d6)`(const `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute)` & a)` 

#### `public inline `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & `[`operator<<`](#db/d77/classalps_1_1_x_m_l_attributes_1a96e88827c9c4ac93f0f25b4d2ca5cc05)`(const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & attr)` 

#### `typedef `[`key_type`](#db/d77/classalps_1_1_x_m_l_attributes_1ada8b8ec0c860ed78217ee8bf1625860e) 

#### `typedef `[`value_type`](#db/d77/classalps_1_1_x_m_l_attributes_1ab1b262211acbeff8e3d60308dd9721c4) 

#### `typedef `[`list_type`](#db/d77/classalps_1_1_x_m_l_attributes_1abe89b8af3e787f63169e992298f4c322) 

#### `typedef `[`size_type`](#db/d77/classalps_1_1_x_m_l_attributes_1addfae7ac3501c9294e71e2b40771582f) 

#### `typedef `[`iterator`](#db/d77/classalps_1_1_x_m_l_attributes_1a35291875261330e1ba9e24aeb7d5607e) 

#### `typedef `[`const_iterator`](#db/d77/classalps_1_1_x_m_l_attributes_1a18f21d03abeac1db1dcbc13649429510) 

# class `alps::XMLHandlerBase` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`XMLHandlerBase`](#dd/dd6/classalps_1_1_x_m_l_handler_base_1aa2bd4ecb131782e82c1287d7ca261889)`(const std::string & basename)` | 
`public inline virtual  `[`~XMLHandlerBase`](#dd/dd6/classalps_1_1_x_m_l_handler_base_1aaae4bc9d458b32697d9b82489ea21122)`()` | 
`public inline void `[`set_basename`](#dd/dd6/classalps_1_1_x_m_l_handler_base_1a0be07800160e12f7ae2e901dc2e72404)`(const std::string &)` | 
`public inline std::string `[`basename`](#dd/dd6/classalps_1_1_x_m_l_handler_base_1aa2fdeb1d4b0448d89712b9e8e9511a98)`() const` | 
`public void `[`start_element`](#dd/dd6/classalps_1_1_x_m_l_handler_base_1aa325da90eb66be0f3a4e82bc6b89ec79)`(const std::string & name,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & attributes,xml::tag_type type)` | 
`public void `[`end_element`](#dd/dd6/classalps_1_1_x_m_l_handler_base_1a23ce2a76df4c46fdd0b8490679bc3db4)`(const std::string & name,xml::tag_type type)` | 
`public void `[`text`](#dd/dd6/classalps_1_1_x_m_l_handler_base_1aca960e703f2737af92a9cbf5a551cfb9)`(const std::string & text)` | 

## Members

#### `public inline  `[`XMLHandlerBase`](#dd/dd6/classalps_1_1_x_m_l_handler_base_1aa2bd4ecb131782e82c1287d7ca261889)`(const std::string & basename)` 

#### `public inline virtual  `[`~XMLHandlerBase`](#dd/dd6/classalps_1_1_x_m_l_handler_base_1aaae4bc9d458b32697d9b82489ea21122)`()` 

#### `public inline void `[`set_basename`](#dd/dd6/classalps_1_1_x_m_l_handler_base_1a0be07800160e12f7ae2e901dc2e72404)`(const std::string &)` 

#### `public inline std::string `[`basename`](#dd/dd6/classalps_1_1_x_m_l_handler_base_1aa2fdeb1d4b0448d89712b9e8e9511a98)`() const` 

#### `public void `[`start_element`](#dd/dd6/classalps_1_1_x_m_l_handler_base_1aa325da90eb66be0f3a4e82bc6b89ec79)`(const std::string & name,const `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` & attributes,xml::tag_type type)` 

#### `public void `[`end_element`](#dd/dd6/classalps_1_1_x_m_l_handler_base_1a23ce2a76df4c46fdd0b8490679bc3db4)`(const std::string & name,xml::tag_type type)` 

#### `public void `[`text`](#dd/dd6/classalps_1_1_x_m_l_handler_base_1aca960e703f2737af92a9cbf5a551cfb9)`(const std::string & text)` 

# class `alps::XMLParser` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`XMLParser`](#dc/d9b/classalps_1_1_x_m_l_parser_1ab9e33ddcecad6d8eceed0fefc0552528)`(`[`XMLHandlerBase`](#dd/dd6/classalps_1_1_x_m_l_handler_base)` &)` | 
`public  `[`~XMLParser`](#dc/d9b/classalps_1_1_x_m_l_parser_1af9ae59d86697cf273d12123b47f3c299)`()` | 
`public void `[`parse`](#dc/d9b/classalps_1_1_x_m_l_parser_1a31fdccbe33a9ec3a90017b672ea25acc)`(std::istream & is)` | 
`public void `[`parse`](#dc/d9b/classalps_1_1_x_m_l_parser_1a77c6062d2406293833dccc3bfbe807ef)`(const std::string & file)` | 
`public void `[`parse`](#dc/d9b/classalps_1_1_x_m_l_parser_1ab0e11659f0afb5f0872ce85adb3d973b)`(const boost::filesystem::path & file)` | 

## Members

#### `public  `[`XMLParser`](#dc/d9b/classalps_1_1_x_m_l_parser_1ab9e33ddcecad6d8eceed0fefc0552528)`(`[`XMLHandlerBase`](#dd/dd6/classalps_1_1_x_m_l_handler_base)` &)` 

#### `public  `[`~XMLParser`](#dc/d9b/classalps_1_1_x_m_l_parser_1af9ae59d86697cf273d12123b47f3c299)`()` 

#### `public void `[`parse`](#dc/d9b/classalps_1_1_x_m_l_parser_1a31fdccbe33a9ec3a90017b672ea25acc)`(std::istream & is)` 

#### `public void `[`parse`](#dc/d9b/classalps_1_1_x_m_l_parser_1a77c6062d2406293833dccc3bfbe807ef)`(const std::string & file)` 

#### `public void `[`parse`](#dc/d9b/classalps_1_1_x_m_l_parser_1ab0e11659f0afb5f0872ce85adb3d973b)`(const boost::filesystem::path & file)` 

# struct `alps::XMLTag` 

a struct to store the contents of an XML tag

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public std::string `[`name`](#df/df1/structalps_1_1_x_m_l_tag_1a169079bc35d40c7bdb3cf8c53dda3ad3) | the name of the tag
`public `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` `[`attributes`](#df/df1/structalps_1_1_x_m_l_tag_1aff8ed559f5246cbed1dd5394e2a8894d) | the attributes
`public enum `[`alps::XMLTag`](#df/df1/structalps_1_1_x_m_l_tag)` `[`type`](#df/df1/structalps_1_1_x_m_l_tag_1a8d6d7ea580e4a756dbffd7b6608daa27) | 
`public inline bool `[`is_comment`](#df/df1/structalps_1_1_x_m_l_tag_1a7643c7cb52671972ad3030d3dd1131bc)`()` | returns true if the tag is a comment
`public inline bool `[`is_processing`](#df/df1/structalps_1_1_x_m_l_tag_1a06b3d21bb5fd20916aaff872f6b9720b)`()` | returns true if the tag is a processing instruction
`public inline bool `[`is_element`](#df/df1/structalps_1_1_x_m_l_tag_1a89b77b175de112861bc5becc7a62ae11)`()` | returns true if the tag is an opening or closing tag of an XML element
`enum `[``](#df/df1/structalps_1_1_x_m_l_tag_1af9fff988fc41bb032657924b4165e369) | 

## Members

#### `public std::string `[`name`](#df/df1/structalps_1_1_x_m_l_tag_1a169079bc35d40c7bdb3cf8c53dda3ad3) 

the name of the tag

#### `public `[`XMLAttributes`](#db/d77/classalps_1_1_x_m_l_attributes)` `[`attributes`](#df/df1/structalps_1_1_x_m_l_tag_1aff8ed559f5246cbed1dd5394e2a8894d) 

the attributes

#### `public enum `[`alps::XMLTag`](#df/df1/structalps_1_1_x_m_l_tag)` `[`type`](#df/df1/structalps_1_1_x_m_l_tag_1a8d6d7ea580e4a756dbffd7b6608daa27) 

#### `public inline bool `[`is_comment`](#df/df1/structalps_1_1_x_m_l_tag_1a7643c7cb52671972ad3030d3dd1131bc)`()` 

returns true if the tag is a comment

#### `public inline bool `[`is_processing`](#df/df1/structalps_1_1_x_m_l_tag_1a06b3d21bb5fd20916aaff872f6b9720b)`()` 

returns true if the tag is a processing instruction

#### `public inline bool `[`is_element`](#df/df1/structalps_1_1_x_m_l_tag_1a89b77b175de112861bc5becc7a62ae11)`()` 

returns true if the tag is an opening or closing tag of an XML element

#### `enum `[``](#df/df1/structalps_1_1_x_m_l_tag_1af9fff988fc41bb032657924b4165e369) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
OPENING            | 
CLOSING            | 
SINGLE            | 
COMMENT            | 
PROCESSING            | 

# namespace `alps::detail` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public std::string `[`parse_string`](#d3/df5/parser_8_c_1a105e995b91c122797b5c89a9b79fe783)`(std::istream & in)`            | reads a string, enclosed in double quotes "
`public std::string `[`xml_parse_name`](#d3/df5/parser_8_c_1a0f5b4b2996ae026cfb1b88c1677b1765)`(std::istream & in)`            | reads any legal XML tag or atrribute name
`public void `[`xml_read_attribute`](#d3/df5/parser_8_c_1ae6bf0cb8e50637f5cd70c9b7fd670d56)`(std::istream & in,std::string & name,std::string & value)`            | parses an XML attribute
`public std::string `[`xml_read_tag`](#d3/df5/parser_8_c_1a98d374051a313ce1cc88bb872199f2c1)`(std::istream & in)`            | parses the opening < and the name of a tag
`public void `[`xml_close_tag`](#d3/df5/parser_8_c_1a010b8e93c5629a33ecf6a507abd79333)`(std::istream & in)`            | checks for a closing > of a tag
`public void `[`xml_close_single_tag`](#d3/df5/parser_8_c_1a310d3c43e0d76e6e67e9e45b926fddb2)`(std::istream & in)`            | checks for a closing /> of a tag
`public void `[`skip_comment`](#d3/df5/parser_8_c_1add18575e1a12aa44db7d05079474ac70)`(std::istream & in,bool processing)`            | skips over an XML comment or processing instruction
`public inline bool `[`is_identifier_char`](#d5/d36/parser_8h_1a78c3680460ed77bdc0d64ccbaeffa6bb)`(char c)`            | 
`struct `[`alps::detail::attribute_t`](#d5/d0a/structalps_1_1detail_1_1attribute__t) | 
`struct `[`alps::detail::end_tag_t`](#d6/d42/structalps_1_1detail_1_1end__tag__t) | 
`struct `[`alps::detail::header_t`](#d7/d67/structalps_1_1detail_1_1header__t) | 
`struct `[`alps::detail::pi_t`](#dd/d44/structalps_1_1detail_1_1pi__t) | 
`struct `[`alps::detail::start_tag_t`](#d7/d3a/structalps_1_1detail_1_1start__tag__t) | 
`struct `[`alps::detail::stylesheet_t`](#d3/d67/structalps_1_1detail_1_1stylesheet__t) | 

## Members

#### `public std::string `[`parse_string`](#d3/df5/parser_8_c_1a105e995b91c122797b5c89a9b79fe783)`(std::istream & in)` 

reads a string, enclosed in double quotes "

#### `public std::string `[`xml_parse_name`](#d3/df5/parser_8_c_1a0f5b4b2996ae026cfb1b88c1677b1765)`(std::istream & in)` 

reads any legal XML tag or atrribute name

#### `public void `[`xml_read_attribute`](#d3/df5/parser_8_c_1ae6bf0cb8e50637f5cd70c9b7fd670d56)`(std::istream & in,std::string & name,std::string & value)` 

parses an XML attribute

#### `public std::string `[`xml_read_tag`](#d3/df5/parser_8_c_1a98d374051a313ce1cc88bb872199f2c1)`(std::istream & in)` 

parses the opening < and the name of a tag

#### `public void `[`xml_close_tag`](#d3/df5/parser_8_c_1a010b8e93c5629a33ecf6a507abd79333)`(std::istream & in)` 

checks for a closing > of a tag

#### `public void `[`xml_close_single_tag`](#d3/df5/parser_8_c_1a310d3c43e0d76e6e67e9e45b926fddb2)`(std::istream & in)` 

checks for a closing /> of a tag

#### `public void `[`skip_comment`](#d3/df5/parser_8_c_1add18575e1a12aa44db7d05079474ac70)`(std::istream & in,bool processing)` 

skips over an XML comment or processing instruction

#### `public inline bool `[`is_identifier_char`](#d5/d36/parser_8h_1a78c3680460ed77bdc0d64ccbaeffa6bb)`(char c)` 

# struct `alps::detail::attribute_t` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute)` `[`attr`](#d5/d0a/structalps_1_1detail_1_1attribute__t_1a4aef81a943a56e6b7a57bba541d473ea) | 
`public template<>`  <br/>`inline  `[`attribute_t`](#d5/d0a/structalps_1_1detail_1_1attribute__t_1a20a59e982da9a385a0a59ad98525ae2a)`(const std::string & n,const T & v)` | 

## Members

#### `public `[`XMLAttribute`](#df/d0f/classalps_1_1_x_m_l_attribute)` `[`attr`](#d5/d0a/structalps_1_1detail_1_1attribute__t_1a4aef81a943a56e6b7a57bba541d473ea) 

#### `public template<>`  <br/>`inline  `[`attribute_t`](#d5/d0a/structalps_1_1detail_1_1attribute__t_1a20a59e982da9a385a0a59ad98525ae2a)`(const std::string & n,const T & v)` 

# struct `alps::detail::end_tag_t` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public std::string `[`name`](#d6/d42/structalps_1_1detail_1_1end__tag__t_1a3c96d8887e298b8568fbf876e4e7b8e7) | 
`public inline  `[`end_tag_t`](#d6/d42/structalps_1_1detail_1_1end__tag__t_1ad3f727578013bcdfe15c44bcaee7b72b)`(const std::string & n)` | 

## Members

#### `public std::string `[`name`](#d6/d42/structalps_1_1detail_1_1end__tag__t_1a3c96d8887e298b8568fbf876e4e7b8e7) 

#### `public inline  `[`end_tag_t`](#d6/d42/structalps_1_1detail_1_1end__tag__t_1ad3f727578013bcdfe15c44bcaee7b72b)`(const std::string & n)` 

# struct `alps::detail::header_t` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public std::string `[`version`](#d7/d67/structalps_1_1detail_1_1header__t_1a2ccb3c3ff92528fd6ee16ccf9e2ccc48) | 
`public std::string `[`encoding`](#d7/d67/structalps_1_1detail_1_1header__t_1a0029928e2e61b1fbdc863ed3429a4922) | 
`public inline  `[`header_t`](#d7/d67/structalps_1_1detail_1_1header__t_1a667e4988bd778536a37ad9b80428603e)`(const std::string & enc)` | 

## Members

#### `public std::string `[`version`](#d7/d67/structalps_1_1detail_1_1header__t_1a2ccb3c3ff92528fd6ee16ccf9e2ccc48) 

#### `public std::string `[`encoding`](#d7/d67/structalps_1_1detail_1_1header__t_1a0029928e2e61b1fbdc863ed3429a4922) 

#### `public inline  `[`header_t`](#d7/d67/structalps_1_1detail_1_1header__t_1a667e4988bd778536a37ad9b80428603e)`(const std::string & enc)` 

# struct `alps::detail::pi_t` 

```
struct alps::detail::pi_t
  : public alps::detail::start_tag_t
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`pi_t`](#dd/d44/structalps_1_1detail_1_1pi__t_1a7ab769db07506dee8750f143c81bdf07)`(const std::string & n)` | 

## Members

#### `public inline  `[`pi_t`](#dd/d44/structalps_1_1detail_1_1pi__t_1a7ab769db07506dee8750f143c81bdf07)`(const std::string & n)` 

# struct `alps::detail::start_tag_t` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public std::string `[`name`](#d7/d3a/structalps_1_1detail_1_1start__tag__t_1a45c660ed9712a38403012e965b52a0f7) | 
`public inline  `[`start_tag_t`](#d7/d3a/structalps_1_1detail_1_1start__tag__t_1a403bc83d43081c407039d35386f89c7c)`(const std::string & n)` | 

## Members

#### `public std::string `[`name`](#d7/d3a/structalps_1_1detail_1_1start__tag__t_1a45c660ed9712a38403012e965b52a0f7) 

#### `public inline  `[`start_tag_t`](#d7/d3a/structalps_1_1detail_1_1start__tag__t_1a403bc83d43081c407039d35386f89c7c)`(const std::string & n)` 

# struct `alps::detail::stylesheet_t` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public std::string `[`url`](#d3/d67/structalps_1_1detail_1_1stylesheet__t_1af65225cf574fae011cf5dc711bb14a52) | 
`public inline  `[`stylesheet_t`](#d3/d67/structalps_1_1detail_1_1stylesheet__t_1ab663ac4c569a3786ddd370336f4db79d)`(const std::string & n)` | 

## Members

#### `public std::string `[`url`](#d3/d67/structalps_1_1detail_1_1stylesheet__t_1af65225cf574fae011cf5dc711bb14a52) 

#### `public inline  `[`stylesheet_t`](#d3/d67/structalps_1_1detail_1_1stylesheet__t_1ab663ac4c569a3786ddd370336f4db79d)`(const std::string & n)` 

# namespace `alps::xml` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`enum `[`tag_type`](#d2/da6/xmlhandler_8h_1a59837d0a381627fa34279b89d50c7a5c)            | 

## Members

#### `enum `[`tag_type`](#d2/da6/xmlhandler_8h_1a59837d0a381627fa34279b89d50c7a5c) 

 Values                         | Descriptions                                
--------------------------------|---------------------------------------------
element            | 
processing_instruction            | 
stylesheet            | 

# namespace `std` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline `[`alps::oxstream`](#df/daf/classalps_1_1oxstream)` & `[`endl`](#d9/dd2/xmlstream_8h_1a009ce2ea14019054ddecce721ff8b7fc)`(`[`alps::oxstream`](#df/daf/classalps_1_1oxstream)` & oxs)`            | 

## Members

#### `public inline `[`alps::oxstream`](#df/daf/classalps_1_1oxstream)` & `[`endl`](#d9/dd2/xmlstream_8h_1a009ce2ea14019054ddecce721ff8b7fc)`(`[`alps::oxstream`](#df/daf/classalps_1_1oxstream)` & oxs)` 

Generated by [Moxygen](https://sourcey.com/moxygen)
