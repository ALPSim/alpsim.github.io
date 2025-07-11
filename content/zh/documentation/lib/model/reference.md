
---
title: Reference
description: "ALPS Model Library"
weight: 2
---

# Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`namespace `[`alps`](#d8/d3d/namespacealps) | 
`namespace `[`alps::detail`](#d6/d75/namespacealps_1_1detail) | 
`namespace `[`alps::numeric`](#d2/d4b/namespacealps_1_1numeric) | 
`class `[`alps::integer_state::reference`](#d1/da3/classalps_1_1integer__state_1_1reference) | 
`class `[`alps::integer_state< I, 1 >::reference`](#d4/d7a/classalps_1_1integer__state_3_01_i_00_011_01_4_1_1reference) | 
`struct `[`alps::half_integer::to_distinguish`](#d0/d47/structalps_1_1half__integer_1_1to__distinguish) | 

# namespace `alps` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public template<>`  <br/>`inline alps::oxstream & `[`operator<<`](#d4/d49/basisdescriptor_8h_1a8b68e7f10f6d678e2946d2a4ff5b7b74)`(alps::oxstream & out,const `[`alps::site_basis_match`](#d0/d20/classalps_1_1site__basis__match)`< I > & q)`            | 
`public template<>`  <br/>`inline alps::oxstream & `[`operator<<`](#d4/d49/basisdescriptor_8h_1a33e228f93e4089123b81490c1ff3bf97)`(alps::oxstream & out,const `[`alps::BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor)`< I > & q)`            | 
`public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d4/d49/basisdescriptor_8h_1aaf314ac147a467c82bb1d862eccc96bb)`(std::ostream & out,const `[`alps::site_basis_match`](#d0/d20/classalps_1_1site__basis__match)`< I > & q)`            | 
`public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d4/d49/basisdescriptor_8h_1a837b2503a7426faed4056736f3a97cff)`(std::ostream & out,const `[`alps::BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor)`< I > & q)`            | 
`public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d7/daa/basisstates_8h_1accdc552d9906e71ff83d19333c953035)`(std::ostream & out,const `[`alps::basis_states`](#dc/d98/classalps_1_1basis__states)`< I, S, SS > & q)`            | 
`public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d7/daa/basisstates_8h_1af18cca6c92daa3a286581e66ade5bc0b)`(std::ostream & out,const `[`alps::lookup_basis_states`](#d1/d99/classalps_1_1lookup__basis__states)`< I, J, S, SS > & q)`            | 
`public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d5/deb/blochbasisstates_8h_1a3ab5d5bef9f147016acda8039a9a7c44)`(std::ostream & out,const `[`alps::bloch_basis_states`](#d0/d55/classalps_1_1bloch__basis__states)`< I, S, SS > & q)`            | 
`public template<>`  <br/>`multi_array< std::pair< T, bool >, 4 > `[`get_fermionic_matrix`](#d3/dd6/bondoperator_8h_1a3d7bad27011ab218252f1af6c0f9d35b)`(T,const `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` & m,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & basis1,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & basis2,const Parameters & p)`            | 
`public template<>`  <br/>`multi_array< T, 4 > `[`get_matrix`](#d3/dd6/bondoperator_8h_1aee2a58c2a56da303ef0416cf3c854ded)`(T,const `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` & m,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & basis1,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & basis2,const Parameters & p)`            | 
`public inline alps::oxstream & `[`operator<<`](#d3/dd6/bondoperator_8h_1aab80acdcf5ab147c58e2bf22936d6a71)`(alps::oxstream & out,const `[`alps::BondOperator`](#de/df1/classalps_1_1_bond_operator)` & q)`            | 
`public inline std::ostream & `[`operator<<`](#d3/dd6/bondoperator_8h_1a913436120a5683a8b611b70b4658a54b)`(std::ostream & out,const `[`alps::BondOperator`](#de/df1/classalps_1_1_bond_operator)` & q)`            | 
`public inline alps::oxstream & `[`operator<<`](#dd/d1c/bondterm_8h_1a7e9c44ddcfbdcd64ac7a4ae36cd90d8c)`(alps::oxstream & out,const `[`alps::BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor)` & q)`            | 
`public inline std::ostream & `[`operator<<`](#dd/d1c/bondterm_8h_1a414b98511febe583ba667c89d883adc9)`(std::ostream & out,const `[`alps::BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor)` & q)`            | 
`public template<>`  <br/>`inline alps::oxstream & `[`operator<<`](#d2/d20/default__term_8h_1a1181e56831a0133a3a6b36ba4f74bc62)`(alps::oxstream & out,const `[`alps::DefaultTermDescriptor`](#de/d64/classalps_1_1_default_term_descriptor)`< TERM > & q)`            | 
`public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d2/d20/default__term_8h_1a66e0529dbcbdf49bc5cb635a64a5a46b)`(std::ostream & out,const `[`alps::DefaultTermDescriptor`](#de/d64/classalps_1_1_default_term_descriptor)`< TERM > & q)`            | 
`public inline alps::oxstream & `[`operator<<`](#da/d46/globaloperator_8h_1addf9919b3ae0914d7b00db236aa429ff)`(alps::oxstream & out,const `[`alps::GlobalOperator`](#db/ddd/classalps_1_1_global_operator)` & q)`            | 
`public inline std::ostream & `[`operator<<`](#da/d46/globaloperator_8h_1a9ba49e84da0e47a75446b3b032f75f34)`(std::ostream & out,const `[`alps::GlobalOperator`](#db/ddd/classalps_1_1_global_operator)` & q)`            | 
`public template<>`  <br/>`inline double `[`to_double`](#de/d04/half__integer_8h_1a0f9cd5c4272f9d80a87a7b5e5c5437de)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & x)`            | 
`public template<>`  <br/>`inline I `[`to_integer`](#de/d04/half__integer_8h_1a96e1479df1a4ac06b49972b374c1e25e)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & x)`            | 
`public template<>`  <br/>`inline bool `[`is_odd`](#de/d04/half__integer_8h_1a38eec636bb574e305a9993968cd576a9)`(T x)`            | 
`public template<>`  <br/>`inline bool `[`is_odd`](#de/d04/half__integer_8h_1a86db9da78316bc2254697c5a7284fb74)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & x)`            | 
`public template<>`  <br/>`inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > `[`abs`](#de/d04/half__integer_8h_1af067d0f7973067c8bb7cf9b02b8ab288)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & x)`            | 
`public template<>`  <br/>`inline bool `[`operator==`](#de/d04/half__integer_8h_1a99f9a4add7f81a9a5ad3e04b52a90c7d)`(double x,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & y)`            | 
`public template<>`  <br/>`inline bool `[`operator!=`](#de/d04/half__integer_8h_1ad81d640cca8616f5a281984d4542e9fd)`(double x,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & y)`            | 
`public template<>`  <br/>`inline bool `[`operator<`](#de/d04/half__integer_8h_1a9f8369ab5f44abca85fa2000a38624d0)`(double x,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & y)`            | 
`public template<>`  <br/>`inline bool `[`operator>`](#de/d04/half__integer_8h_1a62f1694c3fa40bd787f38d4c475ee7f9)`(double x,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & y)`            | 
`public template<>`  <br/>`inline bool `[`operator<=`](#de/d04/half__integer_8h_1ace7517021fdebd9b22f0fd4b800cb339)`(double x,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & y)`            | 
`public template<>`  <br/>`inline bool `[`operator>=`](#de/d04/half__integer_8h_1aebb364a7b746589101efa0e42cba9893)`(double x,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & y)`            | 
`public template<>`  <br/>`inline `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > `[`operator+`](#de/d04/half__integer_8h_1a4196840ca9ba1394f0b4e24fb97f6dc9)`(double x,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & y)`            | 
`public template<>`  <br/>`inline `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > `[`operator-`](#de/d04/half__integer_8h_1a8be493e88506ef9bac2bdef629872bf2)`(double x,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & y)`            | 
`public template<>`  <br/>`inline std::ostream & `[`operator<<`](#de/d04/half__integer_8h_1a60181d195fe938c914c3367bf6ceef31)`(std::ostream & os,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & x)`            | 
`public template<>`  <br/>`inline std::istream & `[`operator>>`](#de/d04/half__integer_8h_1a9ff0d5ea9c9e6ba0a4a8059be90c07bb)`(std::istream & is,`[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & x)`            | 
`public template<>`  <br/>`inline alps::oxstream & `[`operator<<`](#d1/d61/hamiltonian_8h_1a98cb763f8fc42b9900094e40eaae14a6)`(alps::oxstream & out,const `[`alps::HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< I > & q)`            | 
`public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d1/d61/hamiltonian_8h_1a6cadccb5366733bedae05c1e01e5deba)`(std::ostream & out,const `[`alps::HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< I > & q)`            | 
`public template<>`  <br/>`bool `[`operator==`](#d8/d20/integer__state_8h_1a557ce2320c28aedd926abb7cfa3cea3b)`(`[`integer_state`](#d0/d14/classalps_1_1integer__state)`< I, N > x,`[`integer_state`](#d0/d14/classalps_1_1integer__state)`< I, N > y)`            | 
`public template<>`  <br/>`bool `[`operator<`](#d8/d20/integer__state_8h_1a847e47257a5ddce9d2e08ef133a29854)`(`[`integer_state`](#d0/d14/classalps_1_1integer__state)`< I, N > x,`[`integer_state`](#d0/d14/classalps_1_1integer__state)`< I, N > y)`            | 
`public inline alps::oxstream & `[`operator<<`](#d6/dff/modellibrary_8h_1a84e1d7cabf1563778e5d9e5c4fdb704f)`(alps::oxstream & os,const `[`alps::ModelLibrary`](#d8/de2/classalps_1_1_model_library)` & l)`            | 
`public inline std::ostream & `[`operator<<`](#d6/dff/modellibrary_8h_1aeffc80fd04f92a4341ddb7a0f18ce73b)`(std::ostream & os,const `[`alps::ModelLibrary`](#d8/de2/classalps_1_1_model_library)` & l)`            | 
`public inline std::istream & `[`operator>>`](#d6/dff/modellibrary_8h_1ad17f736b53ae68dfe2a1f6871730e70c)`(std::istream & is,`[`alps::ModelLibrary`](#d8/de2/classalps_1_1_model_library)` & l)`            | 
`public template<>`  <br/>`inline alps::oxstream & `[`operator<<`](#df/d3e/operatordescriptor_8h_1a9cb192d7e97233ddcf54afef0af94eb4)`(alps::oxstream & out,const `[`alps::OperatorDescriptor`](#da/d8c/classalps_1_1_operator_descriptor)`< I > & q)`            | 
`public template<>`  <br/>`inline std::ostream & `[`operator<<`](#df/d3e/operatordescriptor_8h_1a7a3efd8f9abbba1b4c252b4c98c70a34)`(std::ostream & out,const `[`alps::OperatorDescriptor`](#da/d8c/classalps_1_1_operator_descriptor)`< I > & q)`            | 
`public template<>`  <br/>`inline bool `[`operator<`](#d5/d2a/quantumnumber_8h_1ab0b65ac38ae4f6d5fa290487094b4f03)`(const `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)`< I > & q1,const `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)`< I > & q2)`            | 
`public template<>`  <br/>[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)`< I > `[`operator+`](#d5/d2a/quantumnumber_8h_1aadd69c4572186416fd3564ecf08c81a2)`(const `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)`< I > & x,const `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)`< I > & y)`            | 
`public template<>`  <br/>`inline alps::oxstream & `[`operator<<`](#d5/d2a/quantumnumber_8h_1a86d15a368c89df709a9f0076d3687b4c)`(alps::oxstream & out,const `[`alps::QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)`< I > & q)`            | 
`public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d5/d2a/quantumnumber_8h_1ae8af3800d1a0f7d52f49c89df40e52da)`(std::ostream & out,const `[`alps::QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)`< I > & q)`            | 
`public template<>`  <br/>`bool `[`is_frustrated`](#d3/dcd/sign_8h_1af102c76131a8cb5bb0f50ccfd58b82ce)`(const G & graph,B bond_map)`            | 
`public template<>`  <br/>`bool `[`is_frustrated`](#d3/dcd/sign_8h_1a463deca7d255ceb98209a90f19714b91)`(const G & graph,B bond_map,S site_map)`            | 
`public template<>`  <br/>`bool `[`has_sign_problem`](#d3/dcd/sign_8h_1a704de078d4cfdc5acf9732f7f790714f)`(const `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< I > & ham,const graph_helper< G > & lattice,const Parameters & p)`            | 
`public template<>`  <br/>`inline alps::oxstream & `[`operator<<`](#d2/d95/sitebasisdescriptor_8h_1a605ae51bf246357a3f20428d72ddaeab)`(alps::oxstream & out,const `[`alps::SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & q)`            | 
`public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d2/d95/sitebasisdescriptor_8h_1a74c718cc5022a1424e659c105e4f22f1)`(std::ostream & out,const `[`alps::SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & q)`            | 
`public template<>`  <br/>`bool `[`is_fermionic`](#d6/d24/sitebasisstates_8h_1a99dcd4d3d7781c59110229494343ba12)`(const `[`site_basis`](#da/d7f/classalps_1_1site__basis)`< I, STATE > & b,int s)`            | 
`public template<>`  <br/>`std::ostream & `[`operator<<`](#d6/d24/sitebasisstates_8h_1aaf3dcc2fe100148f455c4a8ad324b9ea)`(std::ostream & out,const `[`alps::site_basis`](#da/d7f/classalps_1_1site__basis)`< I, STATE > & s)`            | 
`public template<>`  <br/>`inline multi_array< std::pair< T, bool >, 2 > `[`get_fermionic_matrix`](#d3/d20/siteoperator_8h_1af5f368b48c66bf4567594b325c389c92)`(T,const `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & m,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & basis1,const Parameters & p)`            | 
`public template<>`  <br/>`multi_array< T, 2 > `[`get_matrix`](#d3/d20/siteoperator_8h_1acc00a0e748e09d6d3d4ffb22b1afcd83)`(T,const `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & m,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & basis1,const Parameters & p,bool ignore_fermion)`            | 
`public inline alps::oxstream & `[`operator<<`](#d3/d20/siteoperator_8h_1ae0ed22539c6ba7057f8240a695167105)`(alps::oxstream & out,const `[`alps::SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & q)`            | 
`public inline std::ostream & `[`operator<<`](#d3/d20/siteoperator_8h_1ad4e93d5e6605704f951835a82e56a200)`(std::ostream & out,const `[`alps::SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & q)`            | 
`public template<>`  <br/>`bool `[`operator<`](#dd/dd1/sitestate_8h_1aa1d3e387e010cb8ece0965a037369272)`(const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & x,const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & y)`            | 
`public template<>`  <br/>`bool `[`operator>`](#dd/dd1/sitestate_8h_1a414b7a11811a35ad1915dd7461ffee14)`(const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & x,const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & y)`            | 
`public template<>`  <br/>`bool `[`operator==`](#dd/dd1/sitestate_8h_1ac3948ff11fc92c5fba01388c54d552b1)`(const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & x,const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & y)`            | 
`public template<>`  <br/>`bool `[`operator<=`](#dd/dd1/sitestate_8h_1a022a7127ab769059840d1fc77e61389a)`(const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & x,const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & y)`            | 
`public template<>`  <br/>`bool `[`operator>=`](#dd/dd1/sitestate_8h_1af2922846de211a75c7b71038f88df3ab)`(const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & x,const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & y)`            | 
`public template<>`  <br/>[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > `[`get_quantumnumber`](#dd/dd1/sitestate_8h_1a974d95a3a3190739a0cf988a63132bbe)`(const `[`site_state`](#d1/da3/classalps_1_1site__state)`< I > & s,typename `[`site_state`](#d1/da3/classalps_1_1site__state)`< I >::size_type i)`            | 
`public template<>`  <br/>[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > `[`get_quantumnumber`](#dd/dd1/sitestate_8h_1a6bdce58d1c65f2c5ee9db749ce07ea72)`(const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & s,std::size_t i)`            | 
`public template<>`  <br/>[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & `[`get_quantumnumber`](#dd/dd1/sitestate_8h_1aa52d4baf5da6f4f3ab019c2155c4bd8a)`(`[`site_state`](#d1/da3/classalps_1_1site__state)`< I > & s,typename `[`site_state`](#d1/da3/classalps_1_1site__state)`< I >::size_type i)`            | 
`public template<>`  <br/>[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & `[`get_quantumnumber`](#dd/dd1/sitestate_8h_1a2c26ca20cbe9e91c079908e4a131d4a7)`(`[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & s,std::size_t i)`            | 
`public template<>`  <br/>`std::size_t `[`get_quantumnumber_index`](#dd/dd1/sitestate_8h_1adb25b13520cd91f2895cba056c8c961b)`(const std::string & n,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b)`            | 
`public template<>`  <br/>`S::quantumnumber_type `[`get_quantumnumber`](#dd/dd1/sitestate_8h_1ae9336fb1363c597e6c5bb2f021c11c6d)`(const S & s,const std::string & n,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b)`            | 
`public template<>`  <br/>`bool `[`is_fermionic`](#dd/dd1/sitestate_8h_1ac2e1b51affe0b7d1b807e0e67368290a)`(const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b,const S & s)`            | 
`public template<>`  <br/>`std::ostream & `[`operator<<`](#dd/dd1/sitestate_8h_1a030ede17e0a224a4f53c4ed180b398e8)`(std::ostream & out,const `[`alps::site_state`](#d1/da3/classalps_1_1site__state)`< I > & s)`            | 
`public template<>`  <br/>`std::ostream & `[`operator<<`](#dd/dd1/sitestate_8h_1a7f827a1cd40fd00ebaba11f9c55abfcb)`(std::ostream & out,const `[`alps::single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & s)`            | 
`public inline alps::oxstream & `[`operator<<`](#d5/d11/siteterm_8h_1a3d8b1b60d37b10dda9f6c2cd968883e1)`(alps::oxstream & out,const `[`alps::SiteTermDescriptor`](#de/dbc/classalps_1_1_site_term_descriptor)` & q)`            | 
`public inline std::ostream & `[`operator<<`](#d5/d11/siteterm_8h_1afa321d636b3156fd47d1fd02b8b2ae70)`(std::ostream & out,const `[`alps::SiteTermDescriptor`](#de/dbc/classalps_1_1_site_term_descriptor)` & q)`            | 
`public inline std::string `[`substitute`](#d8/d52/substitute_8h_1a3ab5d486cf5c9f970d73b2c34bed29ba)`(std::string const & text,unsigned int type)`            | 
`public inline Parameters `[`substitute`](#d8/d52/substitute_8h_1a4d2887282dcd57d058845d7e09522833)`(Parameters const & parms,unsigned int type)`            | 
`class `[`alps::basis_states`](#dc/d98/classalps_1_1basis__states) | 
`class `[`alps::basis_states_descriptor`](#de/d04/classalps_1_1basis__states__descriptor) | 
`class `[`alps::BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor) | 
`class `[`alps::bloch_basis_states`](#d0/d55/classalps_1_1bloch__basis__states) | 
`class `[`alps::BondOperator`](#de/df1/classalps_1_1_bond_operator) | 
`class `[`alps::BondOperatorEvaluator`](#de/d24/classalps_1_1_bond_operator_evaluator) | 
`class `[`alps::BondOperatorSplitter`](#d0/df7/classalps_1_1_bond_operator_splitter) | 
`class `[`alps::BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor) | 
`class `[`alps::DefaultTermDescriptor`](#de/d64/classalps_1_1_default_term_descriptor) | 
`class `[`alps::GlobalOperator`](#db/ddd/classalps_1_1_global_operator) | 
`class `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer) | 
`class `[`alps::hamiltonian_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix) | 
`class `[`alps::HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor) | 
`class `[`alps::integer_state`](#d0/d14/classalps_1_1integer__state) | 
`class `[`alps::integer_state< I, 1 >`](#d1/dc2/classalps_1_1integer__state_3_01_i_00_011_01_4) | 
`class `[`alps::lookup_basis_states`](#d1/d99/classalps_1_1lookup__basis__states) | 
`class `[`alps::model_helper`](#df/d1b/classalps_1_1model__helper) | 
`class `[`alps::ModelLibrary`](#d8/de2/classalps_1_1_model_library) | 
`class `[`alps::OperatorDescriptor`](#da/d8c/classalps_1_1_operator_descriptor) | 
`class `[`alps::OperatorEvaluator`](#d7/dbe/classalps_1_1_operator_evaluator) | 
`class `[`alps::OperatorSubstitution`](#d2/d76/classalps_1_1_operator_substitution) | 
`class `[`alps::QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor) | 
`class `[`alps::single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state) | 
`class `[`alps::site_basis`](#da/d7f/classalps_1_1site__basis) | 
`class `[`alps::site_basis_match`](#d0/d20/classalps_1_1site__basis__match) | 
`class `[`alps::site_state`](#d1/da3/classalps_1_1site__state) | 
`class `[`alps::SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor) | 
`class `[`alps::SiteOperator`](#d7/d82/classalps_1_1_site_operator) | 
`class `[`alps::SiteOperatorEvaluator`](#d7/dd9/classalps_1_1_site_operator_evaluator) | 
`class `[`alps::SiteOperatorSplitter`](#d7/d59/classalps_1_1_site_operator_splitter) | 
`class `[`alps::SiteTermDescriptor`](#de/dbc/classalps_1_1_site_term_descriptor) | 
`struct `[`alps::nonzero_edge_weight`](#d6/d87/structalps_1_1nonzero__edge__weight) | 

## Members

#### `public template<>`  <br/>`inline alps::oxstream & `[`operator<<`](#d4/d49/basisdescriptor_8h_1a8b68e7f10f6d678e2946d2a4ff5b7b74)`(alps::oxstream & out,const `[`alps::site_basis_match`](#d0/d20/classalps_1_1site__basis__match)`< I > & q)` 

#### `public template<>`  <br/>`inline alps::oxstream & `[`operator<<`](#d4/d49/basisdescriptor_8h_1a33e228f93e4089123b81490c1ff3bf97)`(alps::oxstream & out,const `[`alps::BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor)`< I > & q)` 

#### `public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d4/d49/basisdescriptor_8h_1aaf314ac147a467c82bb1d862eccc96bb)`(std::ostream & out,const `[`alps::site_basis_match`](#d0/d20/classalps_1_1site__basis__match)`< I > & q)` 

#### `public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d4/d49/basisdescriptor_8h_1a837b2503a7426faed4056736f3a97cff)`(std::ostream & out,const `[`alps::BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor)`< I > & q)` 

#### `public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d7/daa/basisstates_8h_1accdc552d9906e71ff83d19333c953035)`(std::ostream & out,const `[`alps::basis_states`](#dc/d98/classalps_1_1basis__states)`< I, S, SS > & q)` 

#### `public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d7/daa/basisstates_8h_1af18cca6c92daa3a286581e66ade5bc0b)`(std::ostream & out,const `[`alps::lookup_basis_states`](#d1/d99/classalps_1_1lookup__basis__states)`< I, J, S, SS > & q)` 

#### `public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d5/deb/blochbasisstates_8h_1a3ab5d5bef9f147016acda8039a9a7c44)`(std::ostream & out,const `[`alps::bloch_basis_states`](#d0/d55/classalps_1_1bloch__basis__states)`< I, S, SS > & q)` 

#### `public template<>`  <br/>`multi_array< std::pair< T, bool >, 4 > `[`get_fermionic_matrix`](#d3/dd6/bondoperator_8h_1a3d7bad27011ab218252f1af6c0f9d35b)`(T,const `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` & m,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & basis1,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & basis2,const Parameters & p)` 

#### `public template<>`  <br/>`multi_array< T, 4 > `[`get_matrix`](#d3/dd6/bondoperator_8h_1aee2a58c2a56da303ef0416cf3c854ded)`(T,const `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` & m,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & basis1,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & basis2,const Parameters & p)` 

#### `public inline alps::oxstream & `[`operator<<`](#d3/dd6/bondoperator_8h_1aab80acdcf5ab147c58e2bf22936d6a71)`(alps::oxstream & out,const `[`alps::BondOperator`](#de/df1/classalps_1_1_bond_operator)` & q)` 

#### `public inline std::ostream & `[`operator<<`](#d3/dd6/bondoperator_8h_1a913436120a5683a8b611b70b4658a54b)`(std::ostream & out,const `[`alps::BondOperator`](#de/df1/classalps_1_1_bond_operator)` & q)` 

#### `public inline alps::oxstream & `[`operator<<`](#dd/d1c/bondterm_8h_1a7e9c44ddcfbdcd64ac7a4ae36cd90d8c)`(alps::oxstream & out,const `[`alps::BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor)` & q)` 

#### `public inline std::ostream & `[`operator<<`](#dd/d1c/bondterm_8h_1a414b98511febe583ba667c89d883adc9)`(std::ostream & out,const `[`alps::BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor)` & q)` 

#### `public template<>`  <br/>`inline alps::oxstream & `[`operator<<`](#d2/d20/default__term_8h_1a1181e56831a0133a3a6b36ba4f74bc62)`(alps::oxstream & out,const `[`alps::DefaultTermDescriptor`](#de/d64/classalps_1_1_default_term_descriptor)`< TERM > & q)` 

#### `public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d2/d20/default__term_8h_1a66e0529dbcbdf49bc5cb635a64a5a46b)`(std::ostream & out,const `[`alps::DefaultTermDescriptor`](#de/d64/classalps_1_1_default_term_descriptor)`< TERM > & q)` 

#### `public inline alps::oxstream & `[`operator<<`](#da/d46/globaloperator_8h_1addf9919b3ae0914d7b00db236aa429ff)`(alps::oxstream & out,const `[`alps::GlobalOperator`](#db/ddd/classalps_1_1_global_operator)` & q)` 

#### `public inline std::ostream & `[`operator<<`](#da/d46/globaloperator_8h_1a9ba49e84da0e47a75446b3b032f75f34)`(std::ostream & out,const `[`alps::GlobalOperator`](#db/ddd/classalps_1_1_global_operator)` & q)` 

#### `public template<>`  <br/>`inline double `[`to_double`](#de/d04/half__integer_8h_1a0f9cd5c4272f9d80a87a7b5e5c5437de)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & x)` 

#### `public template<>`  <br/>`inline I `[`to_integer`](#de/d04/half__integer_8h_1a96e1479df1a4ac06b49972b374c1e25e)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & x)` 

#### `public template<>`  <br/>`inline bool `[`is_odd`](#de/d04/half__integer_8h_1a38eec636bb574e305a9993968cd576a9)`(T x)` 

#### `public template<>`  <br/>`inline bool `[`is_odd`](#de/d04/half__integer_8h_1a86db9da78316bc2254697c5a7284fb74)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & x)` 

#### `public template<>`  <br/>`inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > `[`abs`](#de/d04/half__integer_8h_1af067d0f7973067c8bb7cf9b02b8ab288)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & x)` 

#### `public template<>`  <br/>`inline bool `[`operator==`](#de/d04/half__integer_8h_1a99f9a4add7f81a9a5ad3e04b52a90c7d)`(double x,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & y)` 

#### `public template<>`  <br/>`inline bool `[`operator!=`](#de/d04/half__integer_8h_1ad81d640cca8616f5a281984d4542e9fd)`(double x,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & y)` 

#### `public template<>`  <br/>`inline bool `[`operator<`](#de/d04/half__integer_8h_1a9f8369ab5f44abca85fa2000a38624d0)`(double x,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & y)` 

#### `public template<>`  <br/>`inline bool `[`operator>`](#de/d04/half__integer_8h_1a62f1694c3fa40bd787f38d4c475ee7f9)`(double x,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & y)` 

#### `public template<>`  <br/>`inline bool `[`operator<=`](#de/d04/half__integer_8h_1ace7517021fdebd9b22f0fd4b800cb339)`(double x,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & y)` 

#### `public template<>`  <br/>`inline bool `[`operator>=`](#de/d04/half__integer_8h_1aebb364a7b746589101efa0e42cba9893)`(double x,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & y)` 

#### `public template<>`  <br/>`inline `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > `[`operator+`](#de/d04/half__integer_8h_1a4196840ca9ba1394f0b4e24fb97f6dc9)`(double x,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & y)` 

#### `public template<>`  <br/>`inline `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > `[`operator-`](#de/d04/half__integer_8h_1a8be493e88506ef9bac2bdef629872bf2)`(double x,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & y)` 

#### `public template<>`  <br/>`inline std::ostream & `[`operator<<`](#de/d04/half__integer_8h_1a60181d195fe938c914c3367bf6ceef31)`(std::ostream & os,const `[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & x)` 

#### `public template<>`  <br/>`inline std::istream & `[`operator>>`](#de/d04/half__integer_8h_1a9ff0d5ea9c9e6ba0a4a8059be90c07bb)`(std::istream & is,`[`alps::half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & x)` 

#### `public template<>`  <br/>`inline alps::oxstream & `[`operator<<`](#d1/d61/hamiltonian_8h_1a98cb763f8fc42b9900094e40eaae14a6)`(alps::oxstream & out,const `[`alps::HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< I > & q)` 

#### `public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d1/d61/hamiltonian_8h_1a6cadccb5366733bedae05c1e01e5deba)`(std::ostream & out,const `[`alps::HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< I > & q)` 

#### `public template<>`  <br/>`bool `[`operator==`](#d8/d20/integer__state_8h_1a557ce2320c28aedd926abb7cfa3cea3b)`(`[`integer_state`](#d0/d14/classalps_1_1integer__state)`< I, N > x,`[`integer_state`](#d0/d14/classalps_1_1integer__state)`< I, N > y)` 

#### `public template<>`  <br/>`bool `[`operator<`](#d8/d20/integer__state_8h_1a847e47257a5ddce9d2e08ef133a29854)`(`[`integer_state`](#d0/d14/classalps_1_1integer__state)`< I, N > x,`[`integer_state`](#d0/d14/classalps_1_1integer__state)`< I, N > y)` 

#### `public inline alps::oxstream & `[`operator<<`](#d6/dff/modellibrary_8h_1a84e1d7cabf1563778e5d9e5c4fdb704f)`(alps::oxstream & os,const `[`alps::ModelLibrary`](#d8/de2/classalps_1_1_model_library)` & l)` 

#### `public inline std::ostream & `[`operator<<`](#d6/dff/modellibrary_8h_1aeffc80fd04f92a4341ddb7a0f18ce73b)`(std::ostream & os,const `[`alps::ModelLibrary`](#d8/de2/classalps_1_1_model_library)` & l)` 

#### `public inline std::istream & `[`operator>>`](#d6/dff/modellibrary_8h_1ad17f736b53ae68dfe2a1f6871730e70c)`(std::istream & is,`[`alps::ModelLibrary`](#d8/de2/classalps_1_1_model_library)` & l)` 

#### `public template<>`  <br/>`inline alps::oxstream & `[`operator<<`](#df/d3e/operatordescriptor_8h_1a9cb192d7e97233ddcf54afef0af94eb4)`(alps::oxstream & out,const `[`alps::OperatorDescriptor`](#da/d8c/classalps_1_1_operator_descriptor)`< I > & q)` 

#### `public template<>`  <br/>`inline std::ostream & `[`operator<<`](#df/d3e/operatordescriptor_8h_1a7a3efd8f9abbba1b4c252b4c98c70a34)`(std::ostream & out,const `[`alps::OperatorDescriptor`](#da/d8c/classalps_1_1_operator_descriptor)`< I > & q)` 

#### `public template<>`  <br/>`inline bool `[`operator<`](#d5/d2a/quantumnumber_8h_1ab0b65ac38ae4f6d5fa290487094b4f03)`(const `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)`< I > & q1,const `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)`< I > & q2)` 

#### `public template<>`  <br/>[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)`< I > `[`operator+`](#d5/d2a/quantumnumber_8h_1aadd69c4572186416fd3564ecf08c81a2)`(const `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)`< I > & x,const `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)`< I > & y)` 

#### `public template<>`  <br/>`inline alps::oxstream & `[`operator<<`](#d5/d2a/quantumnumber_8h_1a86d15a368c89df709a9f0076d3687b4c)`(alps::oxstream & out,const `[`alps::QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)`< I > & q)` 

#### `public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d5/d2a/quantumnumber_8h_1ae8af3800d1a0f7d52f49c89df40e52da)`(std::ostream & out,const `[`alps::QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)`< I > & q)` 

#### `public template<>`  <br/>`bool `[`is_frustrated`](#d3/dcd/sign_8h_1af102c76131a8cb5bb0f50ccfd58b82ce)`(const G & graph,B bond_map)` 

#### `public template<>`  <br/>`bool `[`is_frustrated`](#d3/dcd/sign_8h_1a463deca7d255ceb98209a90f19714b91)`(const G & graph,B bond_map,S site_map)` 

#### `public template<>`  <br/>`bool `[`has_sign_problem`](#d3/dcd/sign_8h_1a704de078d4cfdc5acf9732f7f790714f)`(const `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< I > & ham,const graph_helper< G > & lattice,const Parameters & p)` 

#### `public template<>`  <br/>`inline alps::oxstream & `[`operator<<`](#d2/d95/sitebasisdescriptor_8h_1a605ae51bf246357a3f20428d72ddaeab)`(alps::oxstream & out,const `[`alps::SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & q)` 

#### `public template<>`  <br/>`inline std::ostream & `[`operator<<`](#d2/d95/sitebasisdescriptor_8h_1a74c718cc5022a1424e659c105e4f22f1)`(std::ostream & out,const `[`alps::SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & q)` 

#### `public template<>`  <br/>`bool `[`is_fermionic`](#d6/d24/sitebasisstates_8h_1a99dcd4d3d7781c59110229494343ba12)`(const `[`site_basis`](#da/d7f/classalps_1_1site__basis)`< I, STATE > & b,int s)` 

#### `public template<>`  <br/>`std::ostream & `[`operator<<`](#d6/d24/sitebasisstates_8h_1aaf3dcc2fe100148f455c4a8ad324b9ea)`(std::ostream & out,const `[`alps::site_basis`](#da/d7f/classalps_1_1site__basis)`< I, STATE > & s)` 

#### `public template<>`  <br/>`inline multi_array< std::pair< T, bool >, 2 > `[`get_fermionic_matrix`](#d3/d20/siteoperator_8h_1af5f368b48c66bf4567594b325c389c92)`(T,const `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & m,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & basis1,const Parameters & p)` 

#### `public template<>`  <br/>`multi_array< T, 2 > `[`get_matrix`](#d3/d20/siteoperator_8h_1acc00a0e748e09d6d3d4ffb22b1afcd83)`(T,const `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & m,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & basis1,const Parameters & p,bool ignore_fermion)` 

#### `public inline alps::oxstream & `[`operator<<`](#d3/d20/siteoperator_8h_1ae0ed22539c6ba7057f8240a695167105)`(alps::oxstream & out,const `[`alps::SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & q)` 

#### `public inline std::ostream & `[`operator<<`](#d3/d20/siteoperator_8h_1ad4e93d5e6605704f951835a82e56a200)`(std::ostream & out,const `[`alps::SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & q)` 

#### `public template<>`  <br/>`bool `[`operator<`](#dd/dd1/sitestate_8h_1aa1d3e387e010cb8ece0965a037369272)`(const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & x,const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & y)` 

#### `public template<>`  <br/>`bool `[`operator>`](#dd/dd1/sitestate_8h_1a414b7a11811a35ad1915dd7461ffee14)`(const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & x,const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & y)` 

#### `public template<>`  <br/>`bool `[`operator==`](#dd/dd1/sitestate_8h_1ac3948ff11fc92c5fba01388c54d552b1)`(const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & x,const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & y)` 

#### `public template<>`  <br/>`bool `[`operator<=`](#dd/dd1/sitestate_8h_1a022a7127ab769059840d1fc77e61389a)`(const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & x,const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & y)` 

#### `public template<>`  <br/>`bool `[`operator>=`](#dd/dd1/sitestate_8h_1af2922846de211a75c7b71038f88df3ab)`(const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & x,const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & y)` 

#### `public template<>`  <br/>[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > `[`get_quantumnumber`](#dd/dd1/sitestate_8h_1a974d95a3a3190739a0cf988a63132bbe)`(const `[`site_state`](#d1/da3/classalps_1_1site__state)`< I > & s,typename `[`site_state`](#d1/da3/classalps_1_1site__state)`< I >::size_type i)` 

#### `public template<>`  <br/>[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > `[`get_quantumnumber`](#dd/dd1/sitestate_8h_1a6bdce58d1c65f2c5ee9db749ce07ea72)`(const `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & s,std::size_t i)` 

#### `public template<>`  <br/>[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & `[`get_quantumnumber`](#dd/dd1/sitestate_8h_1aa52d4baf5da6f4f3ab019c2155c4bd8a)`(`[`site_state`](#d1/da3/classalps_1_1site__state)`< I > & s,typename `[`site_state`](#d1/da3/classalps_1_1site__state)`< I >::size_type i)` 

#### `public template<>`  <br/>[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > & `[`get_quantumnumber`](#dd/dd1/sitestate_8h_1a2c26ca20cbe9e91c079908e4a131d4a7)`(`[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & s,std::size_t i)` 

#### `public template<>`  <br/>`std::size_t `[`get_quantumnumber_index`](#dd/dd1/sitestate_8h_1adb25b13520cd91f2895cba056c8c961b)`(const std::string & n,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b)` 

#### `public template<>`  <br/>`S::quantumnumber_type `[`get_quantumnumber`](#dd/dd1/sitestate_8h_1ae9336fb1363c597e6c5bb2f021c11c6d)`(const S & s,const std::string & n,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b)` 

#### `public template<>`  <br/>`bool `[`is_fermionic`](#dd/dd1/sitestate_8h_1ac2e1b51affe0b7d1b807e0e67368290a)`(const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b,const S & s)` 

#### `public template<>`  <br/>`std::ostream & `[`operator<<`](#dd/dd1/sitestate_8h_1a030ede17e0a224a4f53c4ed180b398e8)`(std::ostream & out,const `[`alps::site_state`](#d1/da3/classalps_1_1site__state)`< I > & s)` 

#### `public template<>`  <br/>`std::ostream & `[`operator<<`](#dd/dd1/sitestate_8h_1a7f827a1cd40fd00ebaba11f9c55abfcb)`(std::ostream & out,const `[`alps::single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state)`< I > & s)` 

#### `public inline alps::oxstream & `[`operator<<`](#d5/d11/siteterm_8h_1a3d8b1b60d37b10dda9f6c2cd968883e1)`(alps::oxstream & out,const `[`alps::SiteTermDescriptor`](#de/dbc/classalps_1_1_site_term_descriptor)` & q)` 

#### `public inline std::ostream & `[`operator<<`](#d5/d11/siteterm_8h_1afa321d636b3156fd47d1fd02b8b2ae70)`(std::ostream & out,const `[`alps::SiteTermDescriptor`](#de/dbc/classalps_1_1_site_term_descriptor)` & q)` 

#### `public inline std::string `[`substitute`](#d8/d52/substitute_8h_1a3ab5d486cf5c9f970d73b2c34bed29ba)`(std::string const & text,unsigned int type)` 

#### `public inline Parameters `[`substitute`](#d8/d52/substitute_8h_1a4d2887282dcd57d058845d7e09522833)`(Parameters const & parms,unsigned int type)` 

# class `alps::basis_states` 

```
class alps::basis_states
  : public std::vector< std::vector< I > >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`basis_states`](#dc/d98/classalps_1_1basis__states_1a3bf0ec652e0a6ca46bfcfce7f430c5e3)`()` | 
`public template<>`  <br/>`inline  `[`basis_states`](#dc/d98/classalps_1_1basis__states_1a276ae2970b06ef39e1a8b4cd64fc582a)`(const `[`basis_states_descriptor`](#de/d04/classalps_1_1basis__states__descriptor)`< I, SS > & b,const std::vector< std::pair< std::string, `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > > > & c)` | 
`public inline  `[`basis_states`](#dc/d98/classalps_1_1basis__states_1acdbef298ba94681a17f865ff42730cf3)`(const `[`basis_states_descriptor`](#de/d04/classalps_1_1basis__states__descriptor)`< I, SS > & b)` | 
`public inline std::size_t `[`index`](#dc/d98/classalps_1_1basis__states_1a0eae51900ce27d495095292d162928b1)`(const value_type & x) const` | 
`public inline std::pair< std::size_t, std::complex< double > > `[`index_and_phase`](#dc/d98/classalps_1_1basis__states_1ac20e1723e0b37097b32dcb62c17bd5ce)`(const value_type & x) const` | 
`public inline double `[`normalization`](#dc/d98/classalps_1_1basis__states_1a2ccc482bde0f298f45c8a044cf760a03)`(size_type) const` | 
`public inline bool `[`is_real`](#dc/d98/classalps_1_1basis__states_1adb652296ceb101198d0282d442d569e2)`() const` | 
`public bool `[`check_sort`](#dc/d98/classalps_1_1basis__states_1a4768f2b5648be1cad980cf92a5f68ed0)`() const` | 
`public inline const `[`basis_type`](#de/d04/classalps_1_1basis__states__descriptor)` & `[`basis`](#dc/d98/classalps_1_1basis__states_1a464cf900ef196238966df5a266b0ee99)`() const` | 
`typedef `[`const_iterator`](#dc/d98/classalps_1_1basis__states_1acf584021316d805e4715dc3a5be4e4e9) | 
`typedef `[`value_type`](#dc/d98/classalps_1_1basis__states_1a5d85191a21248767be8f32c90c19b85a) | 
`typedef `[`size_type`](#dc/d98/classalps_1_1basis__states_1a3aeeaca8f26208e683681c948623b984) | 
`typedef `[`basis_type`](#dc/d98/classalps_1_1basis__states_1ac3009316f7c86117ce78b3b60d5b5359) | 

## Members

#### `public inline  `[`basis_states`](#dc/d98/classalps_1_1basis__states_1a3bf0ec652e0a6ca46bfcfce7f430c5e3)`()` 

#### `public template<>`  <br/>`inline  `[`basis_states`](#dc/d98/classalps_1_1basis__states_1a276ae2970b06ef39e1a8b4cd64fc582a)`(const `[`basis_states_descriptor`](#de/d04/classalps_1_1basis__states__descriptor)`< I, SS > & b,const std::vector< std::pair< std::string, `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > > > & c)` 

#### `public inline  `[`basis_states`](#dc/d98/classalps_1_1basis__states_1acdbef298ba94681a17f865ff42730cf3)`(const `[`basis_states_descriptor`](#de/d04/classalps_1_1basis__states__descriptor)`< I, SS > & b)` 

#### `public inline std::size_t `[`index`](#dc/d98/classalps_1_1basis__states_1a0eae51900ce27d495095292d162928b1)`(const value_type & x) const` 

#### `public inline std::pair< std::size_t, std::complex< double > > `[`index_and_phase`](#dc/d98/classalps_1_1basis__states_1ac20e1723e0b37097b32dcb62c17bd5ce)`(const value_type & x) const` 

#### `public inline double `[`normalization`](#dc/d98/classalps_1_1basis__states_1a2ccc482bde0f298f45c8a044cf760a03)`(size_type) const` 

#### `public inline bool `[`is_real`](#dc/d98/classalps_1_1basis__states_1adb652296ceb101198d0282d442d569e2)`() const` 

#### `public bool `[`check_sort`](#dc/d98/classalps_1_1basis__states_1a4768f2b5648be1cad980cf92a5f68ed0)`() const` 

#### `public inline const `[`basis_type`](#de/d04/classalps_1_1basis__states__descriptor)` & `[`basis`](#dc/d98/classalps_1_1basis__states_1a464cf900ef196238966df5a266b0ee99)`() const` 

#### `typedef `[`const_iterator`](#dc/d98/classalps_1_1basis__states_1acf584021316d805e4715dc3a5be4e4e9) 

#### `typedef `[`value_type`](#dc/d98/classalps_1_1basis__states_1a5d85191a21248767be8f32c90c19b85a) 

#### `typedef `[`size_type`](#dc/d98/classalps_1_1basis__states_1a3aeeaca8f26208e683681c948623b984) 

#### `typedef `[`basis_type`](#dc/d98/classalps_1_1basis__states_1ac3009316f7c86117ce78b3b60d5b5359) 

# class `alps::basis_states_descriptor` 

```
class alps::basis_states_descriptor
  : public std::vector< site_basis< I, site_state< I > > >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`basis_states_descriptor`](#de/d04/classalps_1_1basis__states__descriptor_1ac1d2d815863a911e7bafc16f1643e392)`()` | 
`public template<>`  <br/>` `[`basis_states_descriptor`](#de/d04/classalps_1_1basis__states__descriptor_1ad02bc62e48b5d007ea40f0e64d8b310d)`(const `[`BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor)`< I > & b,const G & graph)` | 
`public inline const `[`BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor)`< I > & `[`get_basis`](#de/d04/classalps_1_1basis__states__descriptor_1a580aa920cad7fcbeb0c730242d945bec)`() const` | 
`public inline const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & `[`get_site_basis`](#de/d04/classalps_1_1basis__states__descriptor_1a57ad04c9dc259f6f96725042dfab7ae2)`(int i) const` | 
`public inline bool `[`set_parameters`](#de/d04/classalps_1_1basis__states__descriptor_1af340d58e2f932e4d8fdf04602d3caa78)`(const Parameters & p)` | 
`typedef `[`site_basis_type`](#de/d04/classalps_1_1basis__states__descriptor_1a206a62f00a24b5efadec47ee8391a86d) | 
`typedef `[`const_iterator`](#de/d04/classalps_1_1basis__states__descriptor_1ab60dce1b2ccb3757932efd7b26840791) | 

## Members

#### `public inline  `[`basis_states_descriptor`](#de/d04/classalps_1_1basis__states__descriptor_1ac1d2d815863a911e7bafc16f1643e392)`()` 

#### `public template<>`  <br/>` `[`basis_states_descriptor`](#de/d04/classalps_1_1basis__states__descriptor_1ad02bc62e48b5d007ea40f0e64d8b310d)`(const `[`BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor)`< I > & b,const G & graph)` 

#### `public inline const `[`BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor)`< I > & `[`get_basis`](#de/d04/classalps_1_1basis__states__descriptor_1a580aa920cad7fcbeb0c730242d945bec)`() const` 

#### `public inline const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & `[`get_site_basis`](#de/d04/classalps_1_1basis__states__descriptor_1a57ad04c9dc259f6f96725042dfab7ae2)`(int i) const` 

#### `public inline bool `[`set_parameters`](#de/d04/classalps_1_1basis__states__descriptor_1af340d58e2f932e4d8fdf04602d3caa78)`(const Parameters & p)` 

#### `typedef `[`site_basis_type`](#de/d04/classalps_1_1basis__states__descriptor_1a206a62f00a24b5efadec47ee8391a86d) 

#### `typedef `[`const_iterator`](#de/d04/classalps_1_1basis__states__descriptor_1ab60dce1b2ccb3757932efd7b26840791) 

# class `alps::BasisDescriptor` 

```
class alps::BasisDescriptor
  : private std::vector< site_basis_match< I > >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor_1a1b5502f299126c43bf214bbebd469000)`(const std::string & name)` | 
`public  `[`BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor_1aedf0a89c074f37635088f5550339c7fb)`(const XMLTag &,std::istream &,const sitebasis_map_type & bases_)` | 
`public void `[`write_xml`](#dc/dd6/classalps_1_1_basis_descriptor_1abbf54131bc38e1ed02263eec5b8d5dab)`(oxstream &) const` | 
`public inline const std::string & `[`name`](#dc/dd6/classalps_1_1_basis_descriptor_1ac48f4ca52789dacfc2fcedb37939466e)`() const` | 
`public bool `[`set_parameters`](#dc/dd6/classalps_1_1_basis_descriptor_1a3e478883ce9d8acfc36924bd3ff8b6e4)`(const Parameters & p)` | 
`public inline const constraints_type & `[`constraints`](#dc/dd6/classalps_1_1_basis_descriptor_1a2df3704226be3e40a7a4dacb41254682)`() const` | 
`public inline const unevaluated_constraints_type & `[`unevaluated_constraints`](#dc/dd6/classalps_1_1_basis_descriptor_1a97637a056c14ca7498fd9c311066476a)`() const` | 
`public inline const unevaluated_constraints_type & `[`all_constraints`](#dc/dd6/classalps_1_1_basis_descriptor_1ae967553c548e6ccdf58f7f8f778a9d1c)`() const` | 
`public const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & `[`site_basis`](#dc/dd6/classalps_1_1_basis_descriptor_1ad1ba83a8bc124990a0785106d13b00fa)`(int type) const` | 
`public const_iterator `[`create_site_basis`](#dc/dd6/classalps_1_1_basis_descriptor_1a1f17aef32e24bf4917afc0285a259eb5)`(int type)` | 
`public template<>`  <br/>`inline void `[`create_site_bases`](#dc/dd6/classalps_1_1_basis_descriptor_1a0a84179ceb7634fd88c6ba41d015ba8a)`(graph_helper< G > const & l)` | 
`typedef `[`iterator`](#dc/dd6/classalps_1_1_basis_descriptor_1a231fd090008c1c41f8e729fa1a602b62) | 
`typedef `[`const_iterator`](#dc/dd6/classalps_1_1_basis_descriptor_1a0a63e893430c9930bdc3dc18bd81f12d) | 
`typedef `[`sitebasis_map_type`](#dc/dd6/classalps_1_1_basis_descriptor_1a68a2cb873565b3122c4169725f3539d4) | 
`typedef `[`constraints_type`](#dc/dd6/classalps_1_1_basis_descriptor_1a8b28048ef6e07967b5ce87f647667e09) | 
`typedef `[`expression_type`](#dc/dd6/classalps_1_1_basis_descriptor_1a548c2802e803a8948b6deec830e53d44) | 
`typedef `[`unevaluated_constraints_type`](#dc/dd6/classalps_1_1_basis_descriptor_1a8a8936871e12e014e9b7ea04d9fb14c8) | 

## Members

#### `public inline  `[`BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor_1a1b5502f299126c43bf214bbebd469000)`(const std::string & name)` 

#### `public  `[`BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor_1aedf0a89c074f37635088f5550339c7fb)`(const XMLTag &,std::istream &,const sitebasis_map_type & bases_)` 

#### `public void `[`write_xml`](#dc/dd6/classalps_1_1_basis_descriptor_1abbf54131bc38e1ed02263eec5b8d5dab)`(oxstream &) const` 

#### `public inline const std::string & `[`name`](#dc/dd6/classalps_1_1_basis_descriptor_1ac48f4ca52789dacfc2fcedb37939466e)`() const` 

#### `public bool `[`set_parameters`](#dc/dd6/classalps_1_1_basis_descriptor_1a3e478883ce9d8acfc36924bd3ff8b6e4)`(const Parameters & p)` 

#### `public inline const constraints_type & `[`constraints`](#dc/dd6/classalps_1_1_basis_descriptor_1a2df3704226be3e40a7a4dacb41254682)`() const` 

#### `public inline const unevaluated_constraints_type & `[`unevaluated_constraints`](#dc/dd6/classalps_1_1_basis_descriptor_1a97637a056c14ca7498fd9c311066476a)`() const` 

#### `public inline const unevaluated_constraints_type & `[`all_constraints`](#dc/dd6/classalps_1_1_basis_descriptor_1ae967553c548e6ccdf58f7f8f778a9d1c)`() const` 

#### `public const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & `[`site_basis`](#dc/dd6/classalps_1_1_basis_descriptor_1ad1ba83a8bc124990a0785106d13b00fa)`(int type) const` 

#### `public const_iterator `[`create_site_basis`](#dc/dd6/classalps_1_1_basis_descriptor_1a1f17aef32e24bf4917afc0285a259eb5)`(int type)` 

#### `public template<>`  <br/>`inline void `[`create_site_bases`](#dc/dd6/classalps_1_1_basis_descriptor_1a0a84179ceb7634fd88c6ba41d015ba8a)`(graph_helper< G > const & l)` 

#### `typedef `[`iterator`](#dc/dd6/classalps_1_1_basis_descriptor_1a231fd090008c1c41f8e729fa1a602b62) 

#### `typedef `[`const_iterator`](#dc/dd6/classalps_1_1_basis_descriptor_1a0a63e893430c9930bdc3dc18bd81f12d) 

#### `typedef `[`sitebasis_map_type`](#dc/dd6/classalps_1_1_basis_descriptor_1a68a2cb873565b3122c4169725f3539d4) 

#### `typedef `[`constraints_type`](#dc/dd6/classalps_1_1_basis_descriptor_1a8b28048ef6e07967b5ce87f647667e09) 

#### `typedef `[`expression_type`](#dc/dd6/classalps_1_1_basis_descriptor_1a548c2802e803a8948b6deec830e53d44) 

#### `typedef `[`unevaluated_constraints_type`](#dc/dd6/classalps_1_1_basis_descriptor_1a8a8936871e12e014e9b7ea04d9fb14c8) 

# class `alps::bloch_basis_states` 

```
class alps::bloch_basis_states
  : public std::vector< std::vector< I > >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`bloch_basis_states`](#d0/d55/classalps_1_1bloch__basis__states_1a821e2557fbdf31a2b9b272b81ac072c0)`()` | 
`public template<>`  <br/>`inline  `[`bloch_basis_states`](#d0/d55/classalps_1_1bloch__basis__states_1a101fbfa14361b943cab822757f41c176)`(const `[`basis_states_descriptor`](#de/d04/classalps_1_1basis__states__descriptor)`< I, SS > & b,const translation_type & t,const std::vector< std::pair< std::string, `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > > > & c)` | 
`public inline  `[`bloch_basis_states`](#d0/d55/classalps_1_1bloch__basis__states_1a8afeda53f0b360fd351e153b95e1724d)`(const `[`basis_states_descriptor`](#de/d04/classalps_1_1basis__states__descriptor)`< I, SS > & b,const translation_type & t)` | 
`public inline std::pair< std::size_t, std::complex< double > > `[`index_and_phase`](#d0/d55/classalps_1_1bloch__basis__states_1a90ded0081deff0dad4f5d6a7963ffc5a)`(const value_type & x) const` | 
`public inline const `[`basis_type`](#de/d04/classalps_1_1basis__states__descriptor)` & `[`basis`](#d0/d55/classalps_1_1bloch__basis__states_1a7283a408a1c80995feadf632bdb01841)`() const` | 
`public inline double `[`normalization`](#d0/d55/classalps_1_1bloch__basis__states_1a400ba01622f937dff6e66651df5ccd48)`(size_type i) const` | 
`public inline bool `[`is_real`](#d0/d55/classalps_1_1bloch__basis__states_1aece5419432f72e90a47651fafce839a4)`() const` | 
`public inline std::vector< S > & `[`full_list`](#d0/d55/classalps_1_1bloch__basis__states_1ad45ebb7c7ef11aa5fb9fe3f08f237e16)`()` | 
`typedef `[`const_iterator`](#d0/d55/classalps_1_1bloch__basis__states_1a901e81e26a3d06978163f757cc7ddadc) | 
`typedef `[`value_type`](#d0/d55/classalps_1_1bloch__basis__states_1a1ec1116d6b1d10db10f622a23340fdd7) | 
`typedef `[`size_type`](#d0/d55/classalps_1_1bloch__basis__states_1a9ab665b8f7fe7f7857474f5df923d2f3) | 
`typedef `[`basis_type`](#d0/d55/classalps_1_1bloch__basis__states_1a153ecf75417926761738655014a949d7) | 
`typedef `[`translation_type`](#d0/d55/classalps_1_1bloch__basis__states_1ab3d84550f50386434c03a4e4cac7a2b3) | 

## Members

#### `public inline  `[`bloch_basis_states`](#d0/d55/classalps_1_1bloch__basis__states_1a821e2557fbdf31a2b9b272b81ac072c0)`()` 

#### `public template<>`  <br/>`inline  `[`bloch_basis_states`](#d0/d55/classalps_1_1bloch__basis__states_1a101fbfa14361b943cab822757f41c176)`(const `[`basis_states_descriptor`](#de/d04/classalps_1_1basis__states__descriptor)`< I, SS > & b,const translation_type & t,const std::vector< std::pair< std::string, `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > > > & c)` 

#### `public inline  `[`bloch_basis_states`](#d0/d55/classalps_1_1bloch__basis__states_1a8afeda53f0b360fd351e153b95e1724d)`(const `[`basis_states_descriptor`](#de/d04/classalps_1_1basis__states__descriptor)`< I, SS > & b,const translation_type & t)` 

#### `public inline std::pair< std::size_t, std::complex< double > > `[`index_and_phase`](#d0/d55/classalps_1_1bloch__basis__states_1a90ded0081deff0dad4f5d6a7963ffc5a)`(const value_type & x) const` 

#### `public inline const `[`basis_type`](#de/d04/classalps_1_1basis__states__descriptor)` & `[`basis`](#d0/d55/classalps_1_1bloch__basis__states_1a7283a408a1c80995feadf632bdb01841)`() const` 

#### `public inline double `[`normalization`](#d0/d55/classalps_1_1bloch__basis__states_1a400ba01622f937dff6e66651df5ccd48)`(size_type i) const` 

#### `public inline bool `[`is_real`](#d0/d55/classalps_1_1bloch__basis__states_1aece5419432f72e90a47651fafce839a4)`() const` 

#### `public inline std::vector< S > & `[`full_list`](#d0/d55/classalps_1_1bloch__basis__states_1ad45ebb7c7ef11aa5fb9fe3f08f237e16)`()` 

#### `typedef `[`const_iterator`](#d0/d55/classalps_1_1bloch__basis__states_1a901e81e26a3d06978163f757cc7ddadc) 

#### `typedef `[`value_type`](#d0/d55/classalps_1_1bloch__basis__states_1a1ec1116d6b1d10db10f622a23340fdd7) 

#### `typedef `[`size_type`](#d0/d55/classalps_1_1bloch__basis__states_1a9ab665b8f7fe7f7857474f5df923d2f3) 

#### `typedef `[`basis_type`](#d0/d55/classalps_1_1bloch__basis__states_1a153ecf75417926761738655014a949d7) 

#### `typedef `[`translation_type`](#d0/d55/classalps_1_1bloch__basis__states_1ab3d84550f50386434c03a4e4cac7a2b3) 

# class `alps::BondOperator` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`BondOperator`](#de/df1/classalps_1_1_bond_operator_1a4c8bfa790b61caf2721af48a44203872)`()` | 
`public inline  `[`BondOperator`](#de/df1/classalps_1_1_bond_operator_1a1a11767d9030b08299edae5da1f24a78)`(const std::string & s,const std::string & t)` | 
`public inline  `[`BondOperator`](#de/df1/classalps_1_1_bond_operator_1ae4498c241cf44f8551cd320f20b96146)`(const std::string & term,const std::string & s,const std::string & t)` | 
`public inline  `[`BondOperator`](#de/df1/classalps_1_1_bond_operator_1a5466e4b4056d0bb165f58c9fe50341d0)`(const XMLTag & tag,std::istream & in)` | 
`public inline  `[`BondOperator`](#de/df1/classalps_1_1_bond_operator_1aba193825d739f2cefcf72cfce13900ac)`(`[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` const & op,std::string const & t,Parameters const & p)` | 
`public void `[`read_xml`](#de/df1/classalps_1_1_bond_operator_1abce2fb7aff7ce009560c280b25662e2c)`(const XMLTag &,std::istream &)` | 
`public void `[`write_xml`](#de/df1/classalps_1_1_bond_operator_1a31b6d6b8fe5b292e2ba340c5e6173f30)`(oxstream &) const` | 
`public inline const std::string & `[`name`](#de/df1/classalps_1_1_bond_operator_1a53af66a6178012dfd3db91ef0f4931ee)`() const` | 
`public inline const std::string & `[`term`](#de/df1/classalps_1_1_bond_operator_1a6e12a3df2a31f43e04d9eff97b27b811)`() const` | 
`public inline std::string & `[`term`](#de/df1/classalps_1_1_bond_operator_1aab8197a345618784ceb45c137af74d22)`()` | 
`public inline const std::string & `[`source`](#de/df1/classalps_1_1_bond_operator_1a9ad4de01441f98347127abf23eb18fa4)`() const` | 
`public inline const std::string & `[`target`](#de/df1/classalps_1_1_bond_operator_1a60a0934574d9d8d0ccc33627581193bd)`() const` | 
`public void `[`substitute_operators`](#de/df1/classalps_1_1_bond_operator_1a89768790a09ad7d2b5cac228435fd86e)`(const `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library)` & m,const Parameters & p)` | 
`public template<>`  <br/>`multi_array< std::pair< T, bool >, 4 > `[`matrix`](#de/df1/classalps_1_1_bond_operator_1ab13d8dfd155738634fcd0a87045b8807)`(const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > &,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > &,const Parameters &) const` | 
`public template<>`  <br/>`std::vector< boost::tuple< expression::Term< T >, `[`SiteOperator](#d7/d82/classalps_1_1_site_operator), [SiteOperator`](#d7/d82/classalps_1_1_site_operator)` > > `[`templated_split`](#de/df1/classalps_1_1_bond_operator_1a7351b105e82df03572cd66b89e6cadce)`(`[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > const &,`[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > const &,const Parameters &) const` | 
`public template<>`  <br/>`inline std::vector< boost::tuple< Term, `[`SiteOperator](#d7/d82/classalps_1_1_site_operator), [SiteOperator`](#d7/d82/classalps_1_1_site_operator)` > > `[`split`](#de/df1/classalps_1_1_bond_operator_1a51c648f31f5ff419a57bca9ac137a4be)`(`[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > const & b1,`[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > const & b2,const Parameters & p) const` | 
`public inline std::vector< boost::tuple< Term, `[`SiteOperator](#d7/d82/classalps_1_1_site_operator), [SiteOperator`](#d7/d82/classalps_1_1_site_operator)` > > `[`split`](#de/df1/classalps_1_1_bond_operator_1a4c3a215297ae16349b648b1e0c09870f)`(const Parameters & p) const` | 
`public std::set< std::string > `[`operator_names`](#de/df1/classalps_1_1_bond_operator_1afb21953fbbb5fba07561cbb738b37baf)`(const Parameters &) const` | 
`public inline Parameters const & `[`parms`](#de/df1/classalps_1_1_bond_operator_1aba8ec97425e0dcf5aaec1314debf9b75)`() const` | 

## Members

#### `public inline  `[`BondOperator`](#de/df1/classalps_1_1_bond_operator_1a4c8bfa790b61caf2721af48a44203872)`()` 

#### `public inline  `[`BondOperator`](#de/df1/classalps_1_1_bond_operator_1a1a11767d9030b08299edae5da1f24a78)`(const std::string & s,const std::string & t)` 

#### `public inline  `[`BondOperator`](#de/df1/classalps_1_1_bond_operator_1ae4498c241cf44f8551cd320f20b96146)`(const std::string & term,const std::string & s,const std::string & t)` 

#### `public inline  `[`BondOperator`](#de/df1/classalps_1_1_bond_operator_1a5466e4b4056d0bb165f58c9fe50341d0)`(const XMLTag & tag,std::istream & in)` 

#### `public inline  `[`BondOperator`](#de/df1/classalps_1_1_bond_operator_1aba193825d739f2cefcf72cfce13900ac)`(`[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` const & op,std::string const & t,Parameters const & p)` 

#### `public void `[`read_xml`](#de/df1/classalps_1_1_bond_operator_1abce2fb7aff7ce009560c280b25662e2c)`(const XMLTag &,std::istream &)` 

#### `public void `[`write_xml`](#de/df1/classalps_1_1_bond_operator_1a31b6d6b8fe5b292e2ba340c5e6173f30)`(oxstream &) const` 

#### `public inline const std::string & `[`name`](#de/df1/classalps_1_1_bond_operator_1a53af66a6178012dfd3db91ef0f4931ee)`() const` 

#### `public inline const std::string & `[`term`](#de/df1/classalps_1_1_bond_operator_1a6e12a3df2a31f43e04d9eff97b27b811)`() const` 

#### `public inline std::string & `[`term`](#de/df1/classalps_1_1_bond_operator_1aab8197a345618784ceb45c137af74d22)`()` 

#### `public inline const std::string & `[`source`](#de/df1/classalps_1_1_bond_operator_1a9ad4de01441f98347127abf23eb18fa4)`() const` 

#### `public inline const std::string & `[`target`](#de/df1/classalps_1_1_bond_operator_1a60a0934574d9d8d0ccc33627581193bd)`() const` 

#### `public void `[`substitute_operators`](#de/df1/classalps_1_1_bond_operator_1a89768790a09ad7d2b5cac228435fd86e)`(const `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library)` & m,const Parameters & p)` 

#### `public template<>`  <br/>`multi_array< std::pair< T, bool >, 4 > `[`matrix`](#de/df1/classalps_1_1_bond_operator_1ab13d8dfd155738634fcd0a87045b8807)`(const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > &,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > &,const Parameters &) const` 

#### `public template<>`  <br/>`std::vector< boost::tuple< expression::Term< T >, `[`SiteOperator](#d7/d82/classalps_1_1_site_operator), [SiteOperator`](#d7/d82/classalps_1_1_site_operator)` > > `[`templated_split`](#de/df1/classalps_1_1_bond_operator_1a7351b105e82df03572cd66b89e6cadce)`(`[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > const &,`[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > const &,const Parameters &) const` 

#### `public template<>`  <br/>`inline std::vector< boost::tuple< Term, `[`SiteOperator](#d7/d82/classalps_1_1_site_operator), [SiteOperator`](#d7/d82/classalps_1_1_site_operator)` > > `[`split`](#de/df1/classalps_1_1_bond_operator_1a51c648f31f5ff419a57bca9ac137a4be)`(`[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > const & b1,`[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > const & b2,const Parameters & p) const` 

#### `public inline std::vector< boost::tuple< Term, `[`SiteOperator](#d7/d82/classalps_1_1_site_operator), [SiteOperator`](#d7/d82/classalps_1_1_site_operator)` > > `[`split`](#de/df1/classalps_1_1_bond_operator_1a4c3a215297ae16349b648b1e0c09870f)`(const Parameters & p) const` 

#### `public std::set< std::string > `[`operator_names`](#de/df1/classalps_1_1_bond_operator_1afb21953fbbb5fba07561cbb738b37baf)`(const Parameters &) const` 

#### `public inline Parameters const & `[`parms`](#de/df1/classalps_1_1_bond_operator_1aba8ec97425e0dcf5aaec1314debf9b75)`() const` 

# class `alps::BondOperatorEvaluator` 

```
class alps::BondOperatorEvaluator
  : public alps::OperatorEvaluator< T >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`BondOperatorEvaluator`](#de/d24/classalps_1_1_bond_operator_evaluator_1a78e606375f3c28695fc8481570208832)`(const STATE1 & s1,const STATE2 & s2,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b1,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b2,const std::string & site1,const std::string & site2,const Parameters & p)` | 
`public inline  `[`BondOperatorEvaluator`](#de/d24/classalps_1_1_bond_operator_evaluator_1a31e9eebaff88aa2c2a3b0d6c8a0657ff)`(const `[`SiteOperatorEvaluator`](#d7/dd9/classalps_1_1_site_operator_evaluator)`< I, T, STATE1 > & s1,const `[`SiteOperatorEvaluator`](#d7/dd9/classalps_1_1_site_operator_evaluator)`< I, T, STATE2 > & s2,const Parameters & p)` | 
`public bool `[`can_evaluate_function`](#de/d24/classalps_1_1_bond_operator_evaluator_1ae246658265afebad1060dc5f5434f977)`(const std::string &,const expression::Expression< T > &,bool) const` | 
`public expression::Expression< T > `[`partial_evaluate_function`](#de/d24/classalps_1_1_bond_operator_evaluator_1a5510b620e324e16caeabe6b48df21dde)`(const std::string & name,const expression::Expression< T > & argument,bool) const` | 
`public inline std::pair< STATE1, STATE2 > `[`state`](#de/d24/classalps_1_1_bond_operator_evaluator_1a0e2b388c2862cc7266f57a7bd1d980e9)`() const` | 
`public inline bool `[`fermionic`](#de/d24/classalps_1_1_bond_operator_evaluator_1a2d8e5f4f839410c2a7e707648d666cae)`() const` | 
`public inline bool `[`has_operator`](#de/d24/classalps_1_1_bond_operator_evaluator_1a004c156ff504aaed5be263cb67b572c1)`(const std::string & name,const expression::Expression< T > & arg) const` | 

## Members

#### `public inline  `[`BondOperatorEvaluator`](#de/d24/classalps_1_1_bond_operator_evaluator_1a78e606375f3c28695fc8481570208832)`(const STATE1 & s1,const STATE2 & s2,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b1,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b2,const std::string & site1,const std::string & site2,const Parameters & p)` 

#### `public inline  `[`BondOperatorEvaluator`](#de/d24/classalps_1_1_bond_operator_evaluator_1a31e9eebaff88aa2c2a3b0d6c8a0657ff)`(const `[`SiteOperatorEvaluator`](#d7/dd9/classalps_1_1_site_operator_evaluator)`< I, T, STATE1 > & s1,const `[`SiteOperatorEvaluator`](#d7/dd9/classalps_1_1_site_operator_evaluator)`< I, T, STATE2 > & s2,const Parameters & p)` 

#### `public bool `[`can_evaluate_function`](#de/d24/classalps_1_1_bond_operator_evaluator_1ae246658265afebad1060dc5f5434f977)`(const std::string &,const expression::Expression< T > &,bool) const` 

#### `public expression::Expression< T > `[`partial_evaluate_function`](#de/d24/classalps_1_1_bond_operator_evaluator_1a5510b620e324e16caeabe6b48df21dde)`(const std::string & name,const expression::Expression< T > & argument,bool) const` 

#### `public inline std::pair< STATE1, STATE2 > `[`state`](#de/d24/classalps_1_1_bond_operator_evaluator_1a0e2b388c2862cc7266f57a7bd1d980e9)`() const` 

#### `public inline bool `[`fermionic`](#de/d24/classalps_1_1_bond_operator_evaluator_1a2d8e5f4f839410c2a7e707648d666cae)`() const` 

#### `public inline bool `[`has_operator`](#de/d24/classalps_1_1_bond_operator_evaluator_1a004c156ff504aaed5be263cb67b572c1)`(const std::string & name,const expression::Expression< T > & arg) const` 

# class `alps::BondOperatorSplitter` 

```
class alps::BondOperatorSplitter
  : public alps::OperatorEvaluator< std::complex< double > >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`BondOperatorSplitter`](#d0/df7/classalps_1_1_bond_operator_splitter_1ac51e3ce70b3e2dcc2d0bf6ac5e538e99)`(const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b1,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b2,const std::string & site1,const std::string & site2,const Parameters & p)` | 
`public bool `[`can_evaluate_function`](#d0/df7/classalps_1_1_bond_operator_splitter_1a33fc3b41a2b55debedd01199f6c06fef)`(const std::string & name,const expression::Expression< T > & argument,bool) const` | 
`public expression::Expression< T > `[`partial_evaluate_function`](#d0/df7/classalps_1_1_bond_operator_splitter_1ae002d73e35b4de45fe5c46bae3d1d28a)`(const std::string & name,const expression::Expression< T > & argument,bool) const` | 
`public inline const std::pair< expression::Term< T >, expression::Term< T > > & `[`site_operators`](#d0/df7/classalps_1_1_bond_operator_splitter_1a20f7b3fce92c714394b4bdf045318ff0)`() const` | 
`public inline bool `[`has_operator`](#d0/df7/classalps_1_1_bond_operator_splitter_1ab05c2745426cb6aa881cb9631787f995)`(const std::string & name,const expression::Expression< T > & arg) const` | 

## Members

#### `public inline  `[`BondOperatorSplitter`](#d0/df7/classalps_1_1_bond_operator_splitter_1ac51e3ce70b3e2dcc2d0bf6ac5e538e99)`(const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b1,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b2,const std::string & site1,const std::string & site2,const Parameters & p)` 

#### `public bool `[`can_evaluate_function`](#d0/df7/classalps_1_1_bond_operator_splitter_1a33fc3b41a2b55debedd01199f6c06fef)`(const std::string & name,const expression::Expression< T > & argument,bool) const` 

#### `public expression::Expression< T > `[`partial_evaluate_function`](#d0/df7/classalps_1_1_bond_operator_splitter_1ae002d73e35b4de45fe5c46bae3d1d28a)`(const std::string & name,const expression::Expression< T > & argument,bool) const` 

#### `public inline const std::pair< expression::Term< T >, expression::Term< T > > & `[`site_operators`](#d0/df7/classalps_1_1_bond_operator_splitter_1a20f7b3fce92c714394b4bdf045318ff0)`() const` 

#### `public inline bool `[`has_operator`](#d0/df7/classalps_1_1_bond_operator_splitter_1ab05c2745426cb6aa881cb9631787f995)`(const std::string & name,const expression::Expression< T > & arg) const` 

# class `alps::BondTermDescriptor` 

```
class alps::BondTermDescriptor
  : public alps::BondOperator
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor_1a5390c1957cf59cd631ab9e665b26ca0f)`()` | 
`public inline  `[`BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor_1a70f665457c8da8496dd95eaf9c2b8cd4)`(const std::string & s,const std::string & t)` | 
`public inline  `[`BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor_1a72485f0f9bf4d6a5e9c2e0a4344a4d48)`(const std::string & term,const std::string & s,const std::string & t)` | 
`public  `[`BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor_1ad87bbd463eb443508b661daeb0fb741f)`(const XMLTag &,std::istream &)` | 
`public inline  `[`BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor_1a686e4cb6f263d62fa6acc68496a30024)`(`[`BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor)` const & t,std::string const & term,Parameters const & p,unsigned int type)` | 
`public inline const `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` & `[`bond_operator`](#d3/df5/classalps_1_1_bond_term_descriptor_1abdebcc6d3fdf95b2c794a371c9ed2540)`() const` | 
`public void `[`write_xml`](#d3/df5/classalps_1_1_bond_term_descriptor_1a9759588b569892dd037220b549c1b478)`(oxstream &) const` | 
`public inline bool `[`match_type`](#d3/df5/classalps_1_1_bond_term_descriptor_1a0535cc5f53866ca72a785e8c1429429c)`(int type) const` | 

## Members

#### `public inline  `[`BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor_1a5390c1957cf59cd631ab9e665b26ca0f)`()` 

#### `public inline  `[`BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor_1a70f665457c8da8496dd95eaf9c2b8cd4)`(const std::string & s,const std::string & t)` 

#### `public inline  `[`BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor_1a72485f0f9bf4d6a5e9c2e0a4344a4d48)`(const std::string & term,const std::string & s,const std::string & t)` 

#### `public  `[`BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor_1ad87bbd463eb443508b661daeb0fb741f)`(const XMLTag &,std::istream &)` 

#### `public inline  `[`BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor_1a686e4cb6f263d62fa6acc68496a30024)`(`[`BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor)` const & t,std::string const & term,Parameters const & p,unsigned int type)` 

#### `public inline const `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` & `[`bond_operator`](#d3/df5/classalps_1_1_bond_term_descriptor_1abdebcc6d3fdf95b2c794a371c9ed2540)`() const` 

#### `public void `[`write_xml`](#d3/df5/classalps_1_1_bond_term_descriptor_1a9759588b569892dd037220b549c1b478)`(oxstream &) const` 

#### `public inline bool `[`match_type`](#d3/df5/classalps_1_1_bond_term_descriptor_1a0535cc5f53866ca72a785e8c1429429c)`(int type) const` 

# class `alps::DefaultTermDescriptor` 

```
class alps::DefaultTermDescriptor
  : public TERM
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`DefaultTermDescriptor`](#de/d64/classalps_1_1_default_term_descriptor_1a331d2e9fd45317eb08559a79b4015e9b)`()` | 
`public inline  `[`DefaultTermDescriptor`](#de/d64/classalps_1_1_default_term_descriptor_1a145cd438c069e9024f21af5d4cac12f1)`(const XMLTag & tag,std::istream & in)` | 
`public term_type `[`get`](#de/d64/classalps_1_1_default_term_descriptor_1a7a7bd6ed4a01c3e2c22d65a4b77df84b)`(unsigned int type) const` | 
`public inline Parameters `[`parms`](#de/d64/classalps_1_1_default_term_descriptor_1ae6069cdb808f5e0212bee9f0752521a6)`(unsigned int type) const` | 
`typedef `[`term_type`](#de/d64/classalps_1_1_default_term_descriptor_1a9fb91ae218018aae5100811c074a73db) | 

## Members

#### `public inline  `[`DefaultTermDescriptor`](#de/d64/classalps_1_1_default_term_descriptor_1a331d2e9fd45317eb08559a79b4015e9b)`()` 

#### `public inline  `[`DefaultTermDescriptor`](#de/d64/classalps_1_1_default_term_descriptor_1a145cd438c069e9024f21af5d4cac12f1)`(const XMLTag & tag,std::istream & in)` 

#### `public term_type `[`get`](#de/d64/classalps_1_1_default_term_descriptor_1a7a7bd6ed4a01c3e2c22d65a4b77df84b)`(unsigned int type) const` 

#### `public inline Parameters `[`parms`](#de/d64/classalps_1_1_default_term_descriptor_1ae6069cdb808f5e0212bee9f0752521a6)`(unsigned int type) const` 

#### `typedef `[`term_type`](#de/d64/classalps_1_1_default_term_descriptor_1a9fb91ae218018aae5100811c074a73db) 

# class `alps::GlobalOperator` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`GlobalOperator`](#db/ddd/classalps_1_1_global_operator_1a6153c5ed96f6a5ab162aec719721fa1f)`()` | 
`public  `[`GlobalOperator`](#db/ddd/classalps_1_1_global_operator_1a55d6f8bd55dfae2ff6542814fbcb441b)`(const XMLTag &,std::istream &)` | 
`public XMLTag `[`read_xml`](#db/ddd/classalps_1_1_global_operator_1a22015ff30c60147c83d19ca61163d189)`(const XMLTag &,std::istream &)` | 
`public void `[`write_xml`](#db/ddd/classalps_1_1_global_operator_1a37c9f8bbf20090eef96ab5b5fe1f6a6e)`(oxstream &) const` | 
`public inline const std::string & `[`name`](#db/ddd/classalps_1_1_global_operator_1a08d94e0455a983076003d2ad63b26896)`() const` | 
`public inline const std::vector< `[`SiteTermDescriptor`](#de/dbc/classalps_1_1_site_term_descriptor)` > & `[`site_terms`](#db/ddd/classalps_1_1_global_operator_1a0779681799591611c3429b4fbf646dd0)`() const` | 
`public inline const std::vector< `[`BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor)` > & `[`bond_terms`](#db/ddd/classalps_1_1_global_operator_1aef65379242c4b3c9c8e2e436937986cf)`() const` | 
`public `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` `[`site_term`](#db/ddd/classalps_1_1_global_operator_1a482fcd0202ca3fa7ebbf993e40e401fa)`(unsigned int type) const` | 
`public `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` `[`bond_term`](#db/ddd/classalps_1_1_global_operator_1a284582c96ba6fe4925c56ffa2598e760)`(unsigned int type) const` | 
`public void `[`substitute_operators`](#db/ddd/classalps_1_1_global_operator_1a56d7b3c48e183fa59ff060613ef937d1)`(const `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library)` & m,const Parameters & p)` | 
`public boost::optional< Parameters > `[`create_site_term`](#db/ddd/classalps_1_1_global_operator_1ac1b6a37772430321b03489c071ba9096)`(unsigned int type)` | 
`public boost::optional< Parameters > `[`create_bond_term`](#db/ddd/classalps_1_1_global_operator_1a079083ee6e3c70af8b0f8a591e553386)`(unsigned int type)` | 
`public template<>`  <br/>`inline Parameters `[`create_terms`](#db/ddd/classalps_1_1_global_operator_1a4ea540bcf7a796dc200c99830d5e3cda)`(graph_helper< G > const & l)` | 
`protected void `[`write_operators_xml`](#db/ddd/classalps_1_1_global_operator_1a5a427acffb675ef5c90d0d59a58ed54b)`(oxstream &) const` | 

## Members

#### `public inline  `[`GlobalOperator`](#db/ddd/classalps_1_1_global_operator_1a6153c5ed96f6a5ab162aec719721fa1f)`()` 

#### `public  `[`GlobalOperator`](#db/ddd/classalps_1_1_global_operator_1a55d6f8bd55dfae2ff6542814fbcb441b)`(const XMLTag &,std::istream &)` 

#### `public XMLTag `[`read_xml`](#db/ddd/classalps_1_1_global_operator_1a22015ff30c60147c83d19ca61163d189)`(const XMLTag &,std::istream &)` 

#### `public void `[`write_xml`](#db/ddd/classalps_1_1_global_operator_1a37c9f8bbf20090eef96ab5b5fe1f6a6e)`(oxstream &) const` 

#### `public inline const std::string & `[`name`](#db/ddd/classalps_1_1_global_operator_1a08d94e0455a983076003d2ad63b26896)`() const` 

#### `public inline const std::vector< `[`SiteTermDescriptor`](#de/dbc/classalps_1_1_site_term_descriptor)` > & `[`site_terms`](#db/ddd/classalps_1_1_global_operator_1a0779681799591611c3429b4fbf646dd0)`() const` 

#### `public inline const std::vector< `[`BondTermDescriptor`](#d3/df5/classalps_1_1_bond_term_descriptor)` > & `[`bond_terms`](#db/ddd/classalps_1_1_global_operator_1aef65379242c4b3c9c8e2e436937986cf)`() const` 

#### `public `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` `[`site_term`](#db/ddd/classalps_1_1_global_operator_1a482fcd0202ca3fa7ebbf993e40e401fa)`(unsigned int type) const` 

#### `public `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` `[`bond_term`](#db/ddd/classalps_1_1_global_operator_1a284582c96ba6fe4925c56ffa2598e760)`(unsigned int type) const` 

#### `public void `[`substitute_operators`](#db/ddd/classalps_1_1_global_operator_1a56d7b3c48e183fa59ff060613ef937d1)`(const `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library)` & m,const Parameters & p)` 

#### `public boost::optional< Parameters > `[`create_site_term`](#db/ddd/classalps_1_1_global_operator_1ac1b6a37772430321b03489c071ba9096)`(unsigned int type)` 

#### `public boost::optional< Parameters > `[`create_bond_term`](#db/ddd/classalps_1_1_global_operator_1a079083ee6e3c70af8b0f8a591e553386)`(unsigned int type)` 

#### `public template<>`  <br/>`inline Parameters `[`create_terms`](#db/ddd/classalps_1_1_global_operator_1a4ea540bcf7a796dc200c99830d5e3cda)`(graph_helper< G > const & l)` 

#### `protected void `[`write_operators_xml`](#db/ddd/classalps_1_1_global_operator_1a5a427acffb675ef5c90d0d59a58ed54b)`(oxstream &) const` 

# class `alps::half_integer` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`half_integer`](#d8/d6f/classalps_1_1half__integer_1a6b407cda6c3bd1758cc965b24e3f82a4)`()` | 
`public template<>`  <br/>`inline  `[`half_integer`](#d8/d6f/classalps_1_1half__integer_1a39bf3a9aa2aae57e17c3e0db2a7e7637)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & x)` | 
`public template<>`  <br/>`inline  `[`half_integer`](#d8/d6f/classalps_1_1half__integer_1aede1cc3d1ab8799d5761d565182e1170)`(J x,typename boost::enable_if< boost::is_integral< J > >::type *)` | 
`public template<>`  <br/>`inline  `[`half_integer`](#d8/d6f/classalps_1_1half__integer_1a77b0caba40846b63b2696f0e2071c352)`(J x,typename boost::enable_if< boost::mpl::and_< boost::is_float< J >, boost::mpl::not_< boost::is_same< J, double > > > >::type *)` | 
`public inline  `[`half_integer`](#d8/d6f/classalps_1_1half__integer_1a7adf6e375d3470053688deebd426bd55)`(double x)` | 
`public inline double `[`to_double`](#d8/d6f/classalps_1_1half__integer_1a179ddad5e4f795968ab84d16e78e26e2)`() const` | 
`public inline integer_type `[`to_integer`](#d8/d6f/classalps_1_1half__integer_1aa7b118da01808818e4554f3e9e524535)`() const` | 
`public inline void `[`set_half`](#d8/d6f/classalps_1_1half__integer_1aabf08eb828dfb3064a521a87adb40240)`(integer_type x)` | 
`public inline integer_type `[`get_twice`](#d8/d6f/classalps_1_1half__integer_1ae9183aea8ab028e04aba98dd79b12bef)`() const` | 
`public inline bool `[`is_odd`](#d8/d6f/classalps_1_1half__integer_1a563285de1e29727af88ab06664720dcc)`() const` | 
`public inline bool `[`is_even`](#d8/d6f/classalps_1_1half__integer_1a05e1174f6c07055d53a0f10a694b6b02)`() const` | 
`public template<>`  <br/>`inline bool `[`operator==`](#d8/d6f/classalps_1_1half__integer_1abe3dab2545936d39c4d959e575c486c8)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & rhs) const` | 
`public template<>`  <br/>`inline bool `[`operator!=`](#d8/d6f/classalps_1_1half__integer_1a88f63d3092f0dd0ee8df19f034140c25)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & rhs) const` | 
`public template<>`  <br/>`inline bool `[`operator<`](#d8/d6f/classalps_1_1half__integer_1a3b0f88d57f885a1043ab192c4da359ef)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & rhs) const` | 
`public template<>`  <br/>`inline bool `[`operator>`](#d8/d6f/classalps_1_1half__integer_1ac7c214c37ad46823af59eb7fa579a8db)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & rhs) const` | 
`public template<>`  <br/>`inline bool `[`operator<=`](#d8/d6f/classalps_1_1half__integer_1a77c3cc362787d6a2e06b46459c4d8e92)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & rhs) const` | 
`public template<>`  <br/>`inline bool `[`operator>=`](#d8/d6f/classalps_1_1half__integer_1a7e09468ea78f9e12b811a295a78d099f)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & rhs) const` | 
`public inline bool `[`operator==`](#d8/d6f/classalps_1_1half__integer_1a5c491b8137b53ac74286c6323795e263)`(double rhs) const` | 
`public inline bool `[`operator!=`](#d8/d6f/classalps_1_1half__integer_1a47d166393f886b9832bfc1b7d8e0bf46)`(double rhs) const` | 
`public inline bool `[`operator<`](#d8/d6f/classalps_1_1half__integer_1af3d388f5df7c51dd601bbbad5c2663b2)`(double rhs) const` | 
`public inline bool `[`operator>`](#d8/d6f/classalps_1_1half__integer_1a848b4acfb9ab8af676ef4af2e3d2fafa)`(double rhs) const` | 
`public inline bool `[`operator<=`](#d8/d6f/classalps_1_1half__integer_1aec701974f3bdc9053cfee064bf341aa0)`(double rhs) const` | 
`public inline bool `[`operator>=`](#d8/d6f/classalps_1_1half__integer_1addacd5f9a7308860d174b7b5fc5ac800)`(double rhs) const` | 
`public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` `[`operator-`](#d8/d6f/classalps_1_1half__integer_1aa8445b502f012397caa0f3189b7a7594)`() const` | 
`public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` & `[`operator++`](#d8/d6f/classalps_1_1half__integer_1aefabfdbaf193b22dd28edb6ba9672e81)`()` | 
`public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` & `[`operator--`](#d8/d6f/classalps_1_1half__integer_1a8e7826184f7a44f378b6e6c5b937414d)`()` | 
`public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` `[`operator++`](#d8/d6f/classalps_1_1half__integer_1a90d3311f723787d1c390fd975d88af77)`(int)` | 
`public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` `[`operator--`](#d8/d6f/classalps_1_1half__integer_1a2a53a817d25c9e969d80753cb2b6c8ba)`(int)` | 
`public template<>`  <br/>`inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` & `[`operator+=`](#d8/d6f/classalps_1_1half__integer_1a35971f0f0057e83e6b60767e9bb76aec)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & x)` | 
`public template<>`  <br/>`inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` & `[`operator-=`](#d8/d6f/classalps_1_1half__integer_1a5b25c0581d8bdda2992426479afebe11)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & x)` | 
`public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` & `[`operator+=`](#d8/d6f/classalps_1_1half__integer_1a9b4626ad8532251b0eadbae8392f0028)`(double x)` | 
`public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` & `[`operator-=`](#d8/d6f/classalps_1_1half__integer_1a9eee0ea3298650e95448241ed94e4bb5)`(double x)` | 
`public template<>`  <br/>`inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` `[`operator+`](#d8/d6f/classalps_1_1half__integer_1a625afc650ac0602d04b631b8393b39cb)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & x) const` | 
`public template<>`  <br/>`inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` `[`operator-`](#d8/d6f/classalps_1_1half__integer_1a40c632d1765e797b542dc926f6c7ab85)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & x) const` | 
`public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` `[`operator+`](#d8/d6f/classalps_1_1half__integer_1a877977b5f5fe87fc66a58c98d09a2690)`(double x) const` | 
`public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` `[`operator-`](#d8/d6f/classalps_1_1half__integer_1aee17f2b002d6d1677a5e5d82ad38bea5)`(double x) const` | 
`public inline integer_type `[`distance`](#d8/d6f/classalps_1_1half__integer_1a2ca2cb8a252a3860335fbaf1592c7c52)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` & x) const` | 
`public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` `[`abs`](#d8/d6f/classalps_1_1half__integer_1ac505b2d2633e28d09b909b4ecb5a6c80)`() const` | 
`typedef `[`integer_type`](#d8/d6f/classalps_1_1half__integer_1a5dda7800028b201f0c0a2dcaa2857900) | 

## Members

#### `public inline  `[`half_integer`](#d8/d6f/classalps_1_1half__integer_1a6b407cda6c3bd1758cc965b24e3f82a4)`()` 

#### `public template<>`  <br/>`inline  `[`half_integer`](#d8/d6f/classalps_1_1half__integer_1a39bf3a9aa2aae57e17c3e0db2a7e7637)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & x)` 

#### `public template<>`  <br/>`inline  `[`half_integer`](#d8/d6f/classalps_1_1half__integer_1aede1cc3d1ab8799d5761d565182e1170)`(J x,typename boost::enable_if< boost::is_integral< J > >::type *)` 

#### `public template<>`  <br/>`inline  `[`half_integer`](#d8/d6f/classalps_1_1half__integer_1a77b0caba40846b63b2696f0e2071c352)`(J x,typename boost::enable_if< boost::mpl::and_< boost::is_float< J >, boost::mpl::not_< boost::is_same< J, double > > > >::type *)` 

#### `public inline  `[`half_integer`](#d8/d6f/classalps_1_1half__integer_1a7adf6e375d3470053688deebd426bd55)`(double x)` 

#### `public inline double `[`to_double`](#d8/d6f/classalps_1_1half__integer_1a179ddad5e4f795968ab84d16e78e26e2)`() const` 

#### `public inline integer_type `[`to_integer`](#d8/d6f/classalps_1_1half__integer_1aa7b118da01808818e4554f3e9e524535)`() const` 

#### `public inline void `[`set_half`](#d8/d6f/classalps_1_1half__integer_1aabf08eb828dfb3064a521a87adb40240)`(integer_type x)` 

#### `public inline integer_type `[`get_twice`](#d8/d6f/classalps_1_1half__integer_1ae9183aea8ab028e04aba98dd79b12bef)`() const` 

#### `public inline bool `[`is_odd`](#d8/d6f/classalps_1_1half__integer_1a563285de1e29727af88ab06664720dcc)`() const` 

#### `public inline bool `[`is_even`](#d8/d6f/classalps_1_1half__integer_1a05e1174f6c07055d53a0f10a694b6b02)`() const` 

#### `public template<>`  <br/>`inline bool `[`operator==`](#d8/d6f/classalps_1_1half__integer_1abe3dab2545936d39c4d959e575c486c8)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & rhs) const` 

#### `public template<>`  <br/>`inline bool `[`operator!=`](#d8/d6f/classalps_1_1half__integer_1a88f63d3092f0dd0ee8df19f034140c25)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & rhs) const` 

#### `public template<>`  <br/>`inline bool `[`operator<`](#d8/d6f/classalps_1_1half__integer_1a3b0f88d57f885a1043ab192c4da359ef)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & rhs) const` 

#### `public template<>`  <br/>`inline bool `[`operator>`](#d8/d6f/classalps_1_1half__integer_1ac7c214c37ad46823af59eb7fa579a8db)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & rhs) const` 

#### `public template<>`  <br/>`inline bool `[`operator<=`](#d8/d6f/classalps_1_1half__integer_1a77c3cc362787d6a2e06b46459c4d8e92)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & rhs) const` 

#### `public template<>`  <br/>`inline bool `[`operator>=`](#d8/d6f/classalps_1_1half__integer_1a7e09468ea78f9e12b811a295a78d099f)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & rhs) const` 

#### `public inline bool `[`operator==`](#d8/d6f/classalps_1_1half__integer_1a5c491b8137b53ac74286c6323795e263)`(double rhs) const` 

#### `public inline bool `[`operator!=`](#d8/d6f/classalps_1_1half__integer_1a47d166393f886b9832bfc1b7d8e0bf46)`(double rhs) const` 

#### `public inline bool `[`operator<`](#d8/d6f/classalps_1_1half__integer_1af3d388f5df7c51dd601bbbad5c2663b2)`(double rhs) const` 

#### `public inline bool `[`operator>`](#d8/d6f/classalps_1_1half__integer_1a848b4acfb9ab8af676ef4af2e3d2fafa)`(double rhs) const` 

#### `public inline bool `[`operator<=`](#d8/d6f/classalps_1_1half__integer_1aec701974f3bdc9053cfee064bf341aa0)`(double rhs) const` 

#### `public inline bool `[`operator>=`](#d8/d6f/classalps_1_1half__integer_1addacd5f9a7308860d174b7b5fc5ac800)`(double rhs) const` 

#### `public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` `[`operator-`](#d8/d6f/classalps_1_1half__integer_1aa8445b502f012397caa0f3189b7a7594)`() const` 

#### `public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` & `[`operator++`](#d8/d6f/classalps_1_1half__integer_1aefabfdbaf193b22dd28edb6ba9672e81)`()` 

#### `public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` & `[`operator--`](#d8/d6f/classalps_1_1half__integer_1a8e7826184f7a44f378b6e6c5b937414d)`()` 

#### `public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` `[`operator++`](#d8/d6f/classalps_1_1half__integer_1a90d3311f723787d1c390fd975d88af77)`(int)` 

#### `public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` `[`operator--`](#d8/d6f/classalps_1_1half__integer_1a2a53a817d25c9e969d80753cb2b6c8ba)`(int)` 

#### `public template<>`  <br/>`inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` & `[`operator+=`](#d8/d6f/classalps_1_1half__integer_1a35971f0f0057e83e6b60767e9bb76aec)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & x)` 

#### `public template<>`  <br/>`inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` & `[`operator-=`](#d8/d6f/classalps_1_1half__integer_1a5b25c0581d8bdda2992426479afebe11)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & x)` 

#### `public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` & `[`operator+=`](#d8/d6f/classalps_1_1half__integer_1a9b4626ad8532251b0eadbae8392f0028)`(double x)` 

#### `public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` & `[`operator-=`](#d8/d6f/classalps_1_1half__integer_1a9eee0ea3298650e95448241ed94e4bb5)`(double x)` 

#### `public template<>`  <br/>`inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` `[`operator+`](#d8/d6f/classalps_1_1half__integer_1a625afc650ac0602d04b631b8393b39cb)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & x) const` 

#### `public template<>`  <br/>`inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` `[`operator-`](#d8/d6f/classalps_1_1half__integer_1a40c632d1765e797b542dc926f6c7ab85)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > & x) const` 

#### `public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` `[`operator+`](#d8/d6f/classalps_1_1half__integer_1a877977b5f5fe87fc66a58c98d09a2690)`(double x) const` 

#### `public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` `[`operator-`](#d8/d6f/classalps_1_1half__integer_1aee17f2b002d6d1677a5e5d82ad38bea5)`(double x) const` 

#### `public inline integer_type `[`distance`](#d8/d6f/classalps_1_1half__integer_1a2ca2cb8a252a3860335fbaf1592c7c52)`(const `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` & x) const` 

#### `public inline `[`half_integer`](#d8/d6f/classalps_1_1half__integer)` `[`abs`](#d8/d6f/classalps_1_1half__integer_1ac505b2d2633e28d09b909b4ecb5a6c80)`() const` 

#### `typedef `[`integer_type`](#d8/d6f/classalps_1_1half__integer_1a5dda7800028b201f0c0a2dcaa2857900) 

# class `alps::hamiltonian_matrix` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`hamiltonian_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ab25f10e7e7dc681374c49004b27f20ba)`(Parameters const & parms)` | 
`public inline void `[`set_parameters`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a8e0d3c5c270da196f51fbafba16ebaf0)`(Parameters const & p)` | 
`public inline `[`basis_states_type`](#dc/d98/classalps_1_1basis__states)` & `[`states_vector`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ad053d03961e6b402bd7f108dc67be7ba)`()` | 
`public inline const `[`basis_states_type`](#dc/d98/classalps_1_1basis__states)` & `[`states_vector`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a465e1d231a08d04556d411ae5fce3c67)`() const` | 
`public inline `[`bloch_basis_states_type`](#d0/d55/classalps_1_1bloch__basis__states)` & `[`bloch_states_vector`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a83da2660a0b2f9ec17acfdd1da322607)`()` | 
`public inline const `[`bloch_basis_states_type`](#d0/d55/classalps_1_1bloch__basis__states)` & `[`bloch_states_vector`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a17a182b8b28cc99c4adc854648de8c4b)`() const` | 
`public inline matrix_type & `[`matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1adeb486943c4964794ffb95d6a77da373)`()` | 
`public inline const matrix_type & `[`matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a1182c9e42ab79b59f292b0b0117cc9c6)`() const` | 
`public inline std::size_t `[`dimension`](#d2/d2b/classalps_1_1hamiltonian__matrix_1aafdf4877b9a7bf554aec15c1962651d5)`() const` | 
`public void `[`dostep`](#d2/d2b/classalps_1_1hamiltonian__matrix_1aafb7b767449f4c2af472b865a692f06c)`()` | 
`public inline void `[`print_basis`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a3e5a0922fd954289091d55ef8851d70e)`(std::ostream & os) const` | 
`public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a862059f103fc0f91619f663d3661e009)`(const STATES &,const `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & op,site_descriptor s,const V &,W &) const` | 
`public template<>`  <br/>`inline void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a9e56bd1943b755d482fa94a76e8873bb)`(const `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & op,site_descriptor s,const V & x,W & y) const` | 
`public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a33d7ee2376cb9075379c9c9380dff43e)`(const `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` & op,bond_descriptor b,const V &,W &) const` | 
`public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a817d46b6e509f6bcd4372aa700bd8fcc)`(const `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` & op,site_descriptor s1,site_descriptor s2,const V &,W &) const` | 
`public template<>`  <br/>`inline void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a3331ddab80b2f9d2945287f7bc6a35a8)`(const boost::multi_array< std::pair< value_type, bool >, 4 > & mat,site_descriptor s1,site_descriptor s2,const V & x,W & y) const` | 
`public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a99bbc6e7298b1d11308b8879be1a8278)`(const STATES &,const boost::multi_array< std::pair< value_type, bool >, 4 > & mat,site_descriptor s1,site_descriptor s2,const V & x,W & y) const` | 
`public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a25138f2532cfdd73151d42f01a15e00d)`(const `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & op,const V &,W &) const` | 
`public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ab2e3b654c517cb3c5a6a66e10d6d1a1e)`(const `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` & op,const V &,W &) const` | 
`public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a3070ef3d1837d77a672e9d0c1cc2ca03)`(const `[`GlobalOperator`](#db/ddd/classalps_1_1_global_operator)` & op,const V &,W &) const` | 
`public template<>`  <br/>`inline MM `[`operator_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ae1aaec64f3ea03f9ed404064b6f4f2a9)`(const OP & op) const` | 
`public template<>`  <br/>`inline void `[`add_operator_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a2688744a397bd342746405d6f1712b4d)`(MM & m,const OP & op) const` | 
`public template<>`  <br/>`inline MM `[`operator_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1aef28fb3740544f375f6ddbeaa2fc83cb)`(const OP & op,D d) const` | 
`public template<>`  <br/>`inline void `[`add_operator_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a67d39abd53ce7477dda44274b810b245)`(MM & m,const OP & op,D d) const` | 
`public template<>`  <br/>`inline MM `[`operator_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1aeac5dce094ab65b0508d03da9c292dc8)`(const OP & op,site_descriptor s1,site_descriptor s2) const` | 
`public template<>`  <br/>`inline void `[`add_operator_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1add0f215b50f77e14b526a0ef21b8520d)`(MM & m,const OP & op,site_descriptor s1,site_descriptor s2) const` | 
`public multi_array< value_type, 2 > `[`local_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ad4cc8310997d9625bd08bb97574e4dac)`(const `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & op,site_descriptor s) const` | 
`public multi_array< std::pair< value_type, bool >, 4 > `[`local_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a661b3611a83dbfbfee1a7af76f8bf3d1)`(const `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` & op,const bond_descriptor & b) const` | 
`public multi_array< std::pair< value_type, bool >, 4 > `[`local_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a1e303f538f3810540130ad0c6335a744)`(const `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` & op,const site_descriptor & s1,const site_descriptor & s2) const` | 
`public template<>`  <br/>`inline void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a38cda175249797fb2092a2f022b3d29f)`(const std::string & name,bond_descriptor b,const V & x,W & y) const` | 
`public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a755e0768bbe5e6529eef8808c71b9338)`(const std::string & op,site_descriptor s,const V & x,W & y) const` | 
`public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ab4bf36e1874311860e0f18970b04365a)`(const std::string & name,const V & x,W & y) const` | 
`public inline bool `[`uses_translation_invariance`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a21f9b8ba97d58f59af4ed651700bf796)`() const` | 
`protected mutable `[`basis_states_type`](#dc/d98/classalps_1_1basis__states)` `[`states`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a7fb61a289557286550002badccfbd535) | 
`protected mutable `[`bloch_basis_states_type`](#d0/d55/classalps_1_1bloch__basis__states)` `[`bloch_states`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ae7e86ee6e5750a6f0a7a3bb2ac3cdc0a) | 
`protected void `[`build`](#d2/d2b/classalps_1_1hamiltonian__matrix_1aeab63f4d521baff7432e4c4caf60e129)`() const` | 
`protected void `[`build_basis`](#d2/d2b/classalps_1_1hamiltonian__matrix_1aa92d8bb19097711557d9540a398009a8)`() const` | 
`typedef `[`matrix_type`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a8a7628115e1e5d60a785dc7e10d7f732) | 
`typedef `[`value_type`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a215075c12fe3af10da7af9ca287c5678) | 
`typedef `[`graph_type`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a69921b0e90eb6213164d1697916c4eae) | 
`typedef `[`site_descriptor`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ae1deec9c699e07b0316a1325fe646936) | 
`typedef `[`bond_descriptor`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a33a317c5deba3f0273c2e42d3ce68c19) | 
`typedef `[`site_iterator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ad961197e97a8fddcd3e81dffa1b524de) | 
`typedef `[`bond_iterator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a807260d36e980f8994b5efbcb3118972) | 
`typedef `[`vector_type`](#d2/d2b/classalps_1_1hamiltonian__matrix_1acf3a42c2ff04b888094bb50aac902c51) | 
`typedef `[`basis_descriptor_type`](#d2/d2b/classalps_1_1hamiltonian__matrix_1abe1b7da69d96efafabf25c63e1d2aebd) | 
`typedef `[`basis_states_type`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a43098b1809b1a2b9887978a7c6d7b0b4) | 
`typedef `[`bloch_basis_states_type`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a74b71cf8cadc283b5016ee1743b1070a) | 
`typedef `[`state_type`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ac279738809f8e11a007f8597a7b1e6b8) | 

## Members

#### `public  `[`hamiltonian_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ab25f10e7e7dc681374c49004b27f20ba)`(Parameters const & parms)` 

#### `public inline void `[`set_parameters`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a8e0d3c5c270da196f51fbafba16ebaf0)`(Parameters const & p)` 

#### `public inline `[`basis_states_type`](#dc/d98/classalps_1_1basis__states)` & `[`states_vector`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ad053d03961e6b402bd7f108dc67be7ba)`()` 

#### `public inline const `[`basis_states_type`](#dc/d98/classalps_1_1basis__states)` & `[`states_vector`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a465e1d231a08d04556d411ae5fce3c67)`() const` 

#### `public inline `[`bloch_basis_states_type`](#d0/d55/classalps_1_1bloch__basis__states)` & `[`bloch_states_vector`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a83da2660a0b2f9ec17acfdd1da322607)`()` 

#### `public inline const `[`bloch_basis_states_type`](#d0/d55/classalps_1_1bloch__basis__states)` & `[`bloch_states_vector`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a17a182b8b28cc99c4adc854648de8c4b)`() const` 

#### `public inline matrix_type & `[`matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1adeb486943c4964794ffb95d6a77da373)`()` 

#### `public inline const matrix_type & `[`matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a1182c9e42ab79b59f292b0b0117cc9c6)`() const` 

#### `public inline std::size_t `[`dimension`](#d2/d2b/classalps_1_1hamiltonian__matrix_1aafdf4877b9a7bf554aec15c1962651d5)`() const` 

#### `public void `[`dostep`](#d2/d2b/classalps_1_1hamiltonian__matrix_1aafb7b767449f4c2af472b865a692f06c)`()` 

#### `public inline void `[`print_basis`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a3e5a0922fd954289091d55ef8851d70e)`(std::ostream & os) const` 

#### `public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a862059f103fc0f91619f663d3661e009)`(const STATES &,const `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & op,site_descriptor s,const V &,W &) const` 

#### `public template<>`  <br/>`inline void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a9e56bd1943b755d482fa94a76e8873bb)`(const `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & op,site_descriptor s,const V & x,W & y) const` 

#### `public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a33d7ee2376cb9075379c9c9380dff43e)`(const `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` & op,bond_descriptor b,const V &,W &) const` 

#### `public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a817d46b6e509f6bcd4372aa700bd8fcc)`(const `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` & op,site_descriptor s1,site_descriptor s2,const V &,W &) const` 

#### `public template<>`  <br/>`inline void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a3331ddab80b2f9d2945287f7bc6a35a8)`(const boost::multi_array< std::pair< value_type, bool >, 4 > & mat,site_descriptor s1,site_descriptor s2,const V & x,W & y) const` 

#### `public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a99bbc6e7298b1d11308b8879be1a8278)`(const STATES &,const boost::multi_array< std::pair< value_type, bool >, 4 > & mat,site_descriptor s1,site_descriptor s2,const V & x,W & y) const` 

#### `public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a25138f2532cfdd73151d42f01a15e00d)`(const `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & op,const V &,W &) const` 

#### `public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ab2e3b654c517cb3c5a6a66e10d6d1a1e)`(const `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` & op,const V &,W &) const` 

#### `public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a3070ef3d1837d77a672e9d0c1cc2ca03)`(const `[`GlobalOperator`](#db/ddd/classalps_1_1_global_operator)` & op,const V &,W &) const` 

#### `public template<>`  <br/>`inline MM `[`operator_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ae1aaec64f3ea03f9ed404064b6f4f2a9)`(const OP & op) const` 

#### `public template<>`  <br/>`inline void `[`add_operator_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a2688744a397bd342746405d6f1712b4d)`(MM & m,const OP & op) const` 

#### `public template<>`  <br/>`inline MM `[`operator_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1aef28fb3740544f375f6ddbeaa2fc83cb)`(const OP & op,D d) const` 

#### `public template<>`  <br/>`inline void `[`add_operator_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a67d39abd53ce7477dda44274b810b245)`(MM & m,const OP & op,D d) const` 

#### `public template<>`  <br/>`inline MM `[`operator_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1aeac5dce094ab65b0508d03da9c292dc8)`(const OP & op,site_descriptor s1,site_descriptor s2) const` 

#### `public template<>`  <br/>`inline void `[`add_operator_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1add0f215b50f77e14b526a0ef21b8520d)`(MM & m,const OP & op,site_descriptor s1,site_descriptor s2) const` 

#### `public multi_array< value_type, 2 > `[`local_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ad4cc8310997d9625bd08bb97574e4dac)`(const `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & op,site_descriptor s) const` 

#### `public multi_array< std::pair< value_type, bool >, 4 > `[`local_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a661b3611a83dbfbfee1a7af76f8bf3d1)`(const `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` & op,const bond_descriptor & b) const` 

#### `public multi_array< std::pair< value_type, bool >, 4 > `[`local_matrix`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a1e303f538f3810540130ad0c6335a744)`(const `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` & op,const site_descriptor & s1,const site_descriptor & s2) const` 

#### `public template<>`  <br/>`inline void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a38cda175249797fb2092a2f022b3d29f)`(const std::string & name,bond_descriptor b,const V & x,W & y) const` 

#### `public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a755e0768bbe5e6529eef8808c71b9338)`(const std::string & op,site_descriptor s,const V & x,W & y) const` 

#### `public template<>`  <br/>`void `[`apply_operator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ab4bf36e1874311860e0f18970b04365a)`(const std::string & name,const V & x,W & y) const` 

#### `public inline bool `[`uses_translation_invariance`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a21f9b8ba97d58f59af4ed651700bf796)`() const` 

#### `protected mutable `[`basis_states_type`](#dc/d98/classalps_1_1basis__states)` `[`states`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a7fb61a289557286550002badccfbd535) 

#### `protected mutable `[`bloch_basis_states_type`](#d0/d55/classalps_1_1bloch__basis__states)` `[`bloch_states`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ae7e86ee6e5750a6f0a7a3bb2ac3cdc0a) 

#### `protected void `[`build`](#d2/d2b/classalps_1_1hamiltonian__matrix_1aeab63f4d521baff7432e4c4caf60e129)`() const` 

#### `protected void `[`build_basis`](#d2/d2b/classalps_1_1hamiltonian__matrix_1aa92d8bb19097711557d9540a398009a8)`() const` 

#### `typedef `[`matrix_type`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a8a7628115e1e5d60a785dc7e10d7f732) 

#### `typedef `[`value_type`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a215075c12fe3af10da7af9ca287c5678) 

#### `typedef `[`graph_type`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a69921b0e90eb6213164d1697916c4eae) 

#### `typedef `[`site_descriptor`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ae1deec9c699e07b0316a1325fe646936) 

#### `typedef `[`bond_descriptor`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a33a317c5deba3f0273c2e42d3ce68c19) 

#### `typedef `[`site_iterator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ad961197e97a8fddcd3e81dffa1b524de) 

#### `typedef `[`bond_iterator`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a807260d36e980f8994b5efbcb3118972) 

#### `typedef `[`vector_type`](#d2/d2b/classalps_1_1hamiltonian__matrix_1acf3a42c2ff04b888094bb50aac902c51) 

#### `typedef `[`basis_descriptor_type`](#d2/d2b/classalps_1_1hamiltonian__matrix_1abe1b7da69d96efafabf25c63e1d2aebd) 

#### `typedef `[`basis_states_type`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a43098b1809b1a2b9887978a7c6d7b0b4) 

#### `typedef `[`bloch_basis_states_type`](#d2/d2b/classalps_1_1hamiltonian__matrix_1a74b71cf8cadc283b5016ee1743b1070a) 

#### `typedef `[`state_type`](#d2/d2b/classalps_1_1hamiltonian__matrix_1ac279738809f8e11a007f8597a7b1e6b8) 

# class `alps::HamiltonianDescriptor` 

```
class alps::HamiltonianDescriptor
  : public alps::GlobalOperator
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1afe308c4bac2c54a929036698b8f44eee)`()` | 
`public  `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1a7704f08adec87cddc70ac54f83171db7)`(const XMLTag &,std::istream &,const basis_map &,const operator_map &)` | 
`public void `[`write_xml`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1abe3509c9d3c7d4e7e669605e6549add2)`(oxstream &) const` | 
`public inline const std::string & `[`name`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1ac6dac88c1fa97a0cf575cbd91ebafac1)`() const` | 
`public inline const `[`BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor)`< I > & `[`basis`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1a40580c8b06cc8977d3d6de7350cf5ea2)`() const` | 
`public inline `[`BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor)`< I > & `[`basis`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1a39efd7088e99f3d0c056d63ec44ef70d)`()` | 
`public inline const Parameters & `[`default_parameters`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1a31756d57014b1bff6c81964643c7ef8b)`() const` | 
`public bool `[`set_parameters`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1aee7e6951f4a8d87fd7623c610d1c15b4)`(Parameters p)` | 
`public template<>`  <br/>`inline void `[`create_terms`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1aa7b3f534fc06767feabcaf5b36c9b9a1)`(graph_helper< G > const & l)` | 
`typedef `[`basis_map`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1a2c54b3c794ab309e0a8f126ec42968da) | 
`typedef `[`operator_map`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1a9ccc918517e5a5467818eb984e9dcd5f) | 

## Members

#### `public inline  `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1afe308c4bac2c54a929036698b8f44eee)`()` 

#### `public  `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1a7704f08adec87cddc70ac54f83171db7)`(const XMLTag &,std::istream &,const basis_map &,const operator_map &)` 

#### `public void `[`write_xml`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1abe3509c9d3c7d4e7e669605e6549add2)`(oxstream &) const` 

#### `public inline const std::string & `[`name`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1ac6dac88c1fa97a0cf575cbd91ebafac1)`() const` 

#### `public inline const `[`BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor)`< I > & `[`basis`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1a40580c8b06cc8977d3d6de7350cf5ea2)`() const` 

#### `public inline `[`BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor)`< I > & `[`basis`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1a39efd7088e99f3d0c056d63ec44ef70d)`()` 

#### `public inline const Parameters & `[`default_parameters`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1a31756d57014b1bff6c81964643c7ef8b)`() const` 

#### `public bool `[`set_parameters`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1aee7e6951f4a8d87fd7623c610d1c15b4)`(Parameters p)` 

#### `public template<>`  <br/>`inline void `[`create_terms`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1aa7b3f534fc06767feabcaf5b36c9b9a1)`(graph_helper< G > const & l)` 

#### `typedef `[`basis_map`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1a2c54b3c794ab309e0a8f126ec42968da) 

#### `typedef `[`operator_map`](#d6/da8/classalps_1_1_hamiltonian_descriptor_1a9ccc918517e5a5467818eb984e9dcd5f) 

# class `alps::integer_state` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`BOOST_STATIC_CONSTANT`](#d0/d14/classalps_1_1integer__state_1a71f50136c1c41f84ffd2ba2ba32094f5)`(int,bits)` | 
`public  `[`BOOST_STATIC_CONSTANT`](#d0/d14/classalps_1_1integer__state_1a43129efb3773569b1c5c939e5b98e5a2)`(int,mask)` | 
`public inline  `[`integer_state`](#d0/d14/classalps_1_1integer__state_1a555c07bbb579cc64b43de02a3b93c0ff)`(representation_type x)` | 
`public template<>`  <br/>`inline  `[`integer_state`](#d0/d14/classalps_1_1integer__state_1a924f40df5ac0d3b88a4a260666dfbe67)`(const std::vector< J > & x)` | 
`public inline int `[`operator[]`](#d0/d14/classalps_1_1integer__state_1a639249f951395e407452652b6bbaab9c)`(int i) const` | 
`public inline `[`reference`](#d1/da3/classalps_1_1integer__state_1_1reference)` `[`operator[]`](#d0/d14/classalps_1_1integer__state_1ad7866ed4bba1f246f4939546874285c9)`(int i)` | 
`public inline  `[`operator representation_type`](#d0/d14/classalps_1_1integer__state_1ae586fa043eb1f8619c45e1585ca59410)`() const` | 
`public inline representation_type `[`state`](#d0/d14/classalps_1_1integer__state_1a45542cd1b7faef6df6b1634ea36a925d)`() const` | 
`typedef `[`representation_type`](#d0/d14/classalps_1_1integer__state_1ade7112c7853b75722c7be5b379f80960) | 

## Members

#### `public  `[`BOOST_STATIC_CONSTANT`](#d0/d14/classalps_1_1integer__state_1a71f50136c1c41f84ffd2ba2ba32094f5)`(int,bits)` 

#### `public  `[`BOOST_STATIC_CONSTANT`](#d0/d14/classalps_1_1integer__state_1a43129efb3773569b1c5c939e5b98e5a2)`(int,mask)` 

#### `public inline  `[`integer_state`](#d0/d14/classalps_1_1integer__state_1a555c07bbb579cc64b43de02a3b93c0ff)`(representation_type x)` 

#### `public template<>`  <br/>`inline  `[`integer_state`](#d0/d14/classalps_1_1integer__state_1a924f40df5ac0d3b88a4a260666dfbe67)`(const std::vector< J > & x)` 

#### `public inline int `[`operator[]`](#d0/d14/classalps_1_1integer__state_1a639249f951395e407452652b6bbaab9c)`(int i) const` 

#### `public inline `[`reference`](#d1/da3/classalps_1_1integer__state_1_1reference)` `[`operator[]`](#d0/d14/classalps_1_1integer__state_1ad7866ed4bba1f246f4939546874285c9)`(int i)` 

#### `public inline  `[`operator representation_type`](#d0/d14/classalps_1_1integer__state_1ae586fa043eb1f8619c45e1585ca59410)`() const` 

#### `public inline representation_type `[`state`](#d0/d14/classalps_1_1integer__state_1a45542cd1b7faef6df6b1634ea36a925d)`() const` 

#### `typedef `[`representation_type`](#d0/d14/classalps_1_1integer__state_1ade7112c7853b75722c7be5b379f80960) 

# class `alps::integer_state< I, 1 >` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`integer_state`](#d1/dc2/classalps_1_1integer__state_3_01_i_00_011_01_4_1af0e3e8cad23faf43f52e9498e4b4433e)`(representation_type x)` | 
`public template<>`  <br/>`inline  `[`integer_state`](#d1/dc2/classalps_1_1integer__state_3_01_i_00_011_01_4_1ab9d65a1ee9a2cc66ec2e07271317004a)`(const std::vector< J > & x)` | 
`public inline int `[`operator[]`](#d1/dc2/classalps_1_1integer__state_3_01_i_00_011_01_4_1afdf6f6410c245b50980d3bb343c5cc95)`(int i) const` | 
`public inline `[`reference`](#d4/d7a/classalps_1_1integer__state_3_01_i_00_011_01_4_1_1reference)` `[`operator[]`](#d1/dc2/classalps_1_1integer__state_3_01_i_00_011_01_4_1a7123df03279acd31086ca8c10a5af89b)`(int i)` | 
`public inline  `[`operator representation_type`](#d1/dc2/classalps_1_1integer__state_3_01_i_00_011_01_4_1a6d169004fe9f3d98669a7347b2736b71)`() const` | 
`public inline representation_type `[`state`](#d1/dc2/classalps_1_1integer__state_3_01_i_00_011_01_4_1ad291c4b57a9c0301c738f3ec5a806b30)`() const` | 
`typedef `[`representation_type`](#d1/dc2/classalps_1_1integer__state_3_01_i_00_011_01_4_1a92ad03bf30299e7d566decef11d50159) | 

## Members

#### `public inline  `[`integer_state`](#d1/dc2/classalps_1_1integer__state_3_01_i_00_011_01_4_1af0e3e8cad23faf43f52e9498e4b4433e)`(representation_type x)` 

#### `public template<>`  <br/>`inline  `[`integer_state`](#d1/dc2/classalps_1_1integer__state_3_01_i_00_011_01_4_1ab9d65a1ee9a2cc66ec2e07271317004a)`(const std::vector< J > & x)` 

#### `public inline int `[`operator[]`](#d1/dc2/classalps_1_1integer__state_3_01_i_00_011_01_4_1afdf6f6410c245b50980d3bb343c5cc95)`(int i) const` 

#### `public inline `[`reference`](#d4/d7a/classalps_1_1integer__state_3_01_i_00_011_01_4_1_1reference)` `[`operator[]`](#d1/dc2/classalps_1_1integer__state_3_01_i_00_011_01_4_1a7123df03279acd31086ca8c10a5af89b)`(int i)` 

#### `public inline  `[`operator representation_type`](#d1/dc2/classalps_1_1integer__state_3_01_i_00_011_01_4_1a6d169004fe9f3d98669a7347b2736b71)`() const` 

#### `public inline representation_type `[`state`](#d1/dc2/classalps_1_1integer__state_3_01_i_00_011_01_4_1ad291c4b57a9c0301c738f3ec5a806b30)`() const` 

#### `typedef `[`representation_type`](#d1/dc2/classalps_1_1integer__state_3_01_i_00_011_01_4_1a92ad03bf30299e7d566decef11d50159) 

# class `alps::lookup_basis_states` 

```
class alps::lookup_basis_states
  : public alps::basis_states< short, integer_state< unsigned int >, basis_states_descriptor< short > >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`lookup_basis_states`](#d1/d99/classalps_1_1lookup__basis__states_1a6f9594d21b473d1f59ba30a56b8a1a6b)`(const `[`basis_states_descriptor`](#de/d04/classalps_1_1basis__states__descriptor)`< J, SS > & b)` | 
`public inline size_type `[`index`](#d1/d99/classalps_1_1lookup__basis__states_1a2333f38e7525a2e437937e5f5b56ab87)`(const value_type & x) const` | 
`public inline std::pair< size_type, std::complex< double > > `[`index_and_phase`](#d1/d99/classalps_1_1lookup__basis__states_1aa6b29ed58e127579b3a83eee50f7fc0c)`(const value_type & x) const` | 
`typedef `[`const_iterator`](#d1/d99/classalps_1_1lookup__basis__states_1aa404d965d9c276c3fc3072d1180b7941) | 
`typedef `[`value_type`](#d1/d99/classalps_1_1lookup__basis__states_1a2061b8a825636230d0fc9e3178b07b07) | 
`typedef `[`size_type`](#d1/d99/classalps_1_1lookup__basis__states_1aa4aa734c3689d1bc52fc02f9974c4c71) | 
`typedef `[`basis_type`](#d1/d99/classalps_1_1lookup__basis__states_1a50436ef27113a5b69f23d5268b71585a) | 

## Members

#### `public inline  `[`lookup_basis_states`](#d1/d99/classalps_1_1lookup__basis__states_1a6f9594d21b473d1f59ba30a56b8a1a6b)`(const `[`basis_states_descriptor`](#de/d04/classalps_1_1basis__states__descriptor)`< J, SS > & b)` 

#### `public inline size_type `[`index`](#d1/d99/classalps_1_1lookup__basis__states_1a2333f38e7525a2e437937e5f5b56ab87)`(const value_type & x) const` 

#### `public inline std::pair< size_type, std::complex< double > > `[`index_and_phase`](#d1/d99/classalps_1_1lookup__basis__states_1aa6b29ed58e127579b3a83eee50f7fc0c)`(const value_type & x) const` 

#### `typedef `[`const_iterator`](#d1/d99/classalps_1_1lookup__basis__states_1aa404d965d9c276c3fc3072d1180b7941) 

#### `typedef `[`value_type`](#d1/d99/classalps_1_1lookup__basis__states_1a2061b8a825636230d0fc9e3178b07b07) 

#### `typedef `[`size_type`](#d1/d99/classalps_1_1lookup__basis__states_1aa4aa734c3689d1bc52fc02f9974c4c71) 

#### `typedef `[`basis_type`](#d1/d99/classalps_1_1lookup__basis__states_1a50436ef27113a5b69f23d5268b71585a) 

# class `alps::model_helper` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`model_helper`](#df/d1b/classalps_1_1model__helper_1ac74cef02eb8fe3edfea4f15eaa673bfd)`(alps::Parameters const & p,bool issymbolic)` | 
`public template<>`  <br/>`inline  `[`model_helper`](#df/d1b/classalps_1_1model__helper_1aa1a721e712e5aa27c162fd450d492d9b)`(alps::graph_helper< G > const & g,alps::Parameters const & p,bool issymbolic)` | 
`public inline const `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library)` & `[`model_library`](#df/d1b/classalps_1_1model__helper_1af730e87cc1182219bced2933c1da1e1e)`() const` | 
`public inline `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< I > & `[`model`](#df/d1b/classalps_1_1model__helper_1a3591ecddaf3f1dd0c1f57c76d46da3dd)`()` | 
`public inline const `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< I > & `[`model`](#df/d1b/classalps_1_1model__helper_1a3128505c85d60d9d837992f814ecfb89)`() const` | 
`public inline `[`basis_descriptor_type`](#dc/dd6/classalps_1_1_basis_descriptor)` & `[`basis`](#df/d1b/classalps_1_1model__helper_1ab24bc7fa0f368572783fcbc9609f4728)`()` | 
`public inline const `[`basis_descriptor_type`](#dc/dd6/classalps_1_1_basis_descriptor)` & `[`basis`](#df/d1b/classalps_1_1model__helper_1ae492b58cada8d7ecb0e6aa6da471553e)`() const` | 
`public inline const `[`site_basis_descriptor_type`](#d7/ddb/classalps_1_1_site_basis_descriptor)` & `[`site_basis`](#df/d1b/classalps_1_1model__helper_1a5af8210eb9488394fcb28ab84c0f46a2)`(int type) const` | 
`public inline `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` `[`site_term`](#df/d1b/classalps_1_1model__helper_1a78862d9a1919a802f36720417b5863cc)`(int type) const` | 
`public inline `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` `[`bond_term`](#df/d1b/classalps_1_1model__helper_1a8eb205d89f6affdd1250fa7afddb1393)`(int type) const` | 
`public inline bool `[`has_site_operator`](#df/d1b/classalps_1_1model__helper_1ae39116740b51195f04a18daf50419cfd)`(const std::string & name) const` | 
`public inline bool `[`has_bond_operator`](#df/d1b/classalps_1_1model__helper_1a7b9d1c23695f326197341606eb649876)`(const std::string & name) const` | 
`public inline bool `[`has_global_operator`](#df/d1b/classalps_1_1model__helper_1aabba6efcda281fdf1d39eb02b1f069a8)`(const std::string & name) const` | 
`public inline bool `[`has_operator`](#df/d1b/classalps_1_1model__helper_1a561457550fb9ff28606c8befe567bd26)`(const std::string & name) const` | 
`public inline `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` `[`get_site_operator`](#df/d1b/classalps_1_1model__helper_1affa4b7c2119bbfd40355cc84ee4027a6)`(const std::string & name,const Parameters & p) const` | 
`public inline `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` `[`get_bond_operator`](#df/d1b/classalps_1_1model__helper_1a9d5907d23a6b90101d7e3cfc22dc2b1c)`(const std::string & name,const Parameters & p) const` | 
`public inline `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` `[`get_site_operator`](#df/d1b/classalps_1_1model__helper_1a1cc78343ac9967b0502f579db27d3d99)`(const std::string & name) const` | 
`public inline `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` `[`get_bond_operator`](#df/d1b/classalps_1_1model__helper_1a705e1994c13e09c8432777e21c1cfd36)`(const std::string & name) const` | 
`public inline `[`GlobalOperator`](#db/ddd/classalps_1_1_global_operator)` `[`get_global_operator`](#df/d1b/classalps_1_1model__helper_1a41e15fbbd70064074fe82b110f6d6ebc)`(const std::string & name) const` | 
`public template<>`  <br/>`inline void `[`substitute_operators`](#df/d1b/classalps_1_1model__helper_1ab7896834a34e275a76c410644776e3da)`(OP & op,const Parameters & p) const` | 
`public inline std::set< std::string > `[`quantum_numbers`](#df/d1b/classalps_1_1model__helper_1ad8809b9d8539ebbf54b9bd73f04e0fdf)`(int type)` | 
`typedef `[`basis_descriptor_type`](#df/d1b/classalps_1_1model__helper_1a4b3747f34963531d77533e889ec632b7) | 
`typedef `[`site_basis_descriptor_type`](#df/d1b/classalps_1_1model__helper_1a171ea855823cd6202afcc49e028f4732) | 
`typedef `[`half_integer_type`](#df/d1b/classalps_1_1model__helper_1ac1a6091eec8223a2520edde1dba5d3c4) | 
`typedef `[`quantum_number_type`](#df/d1b/classalps_1_1model__helper_1abea0965975776311b2a7a0246921b0d7) | 

## Members

#### `public inline  `[`model_helper`](#df/d1b/classalps_1_1model__helper_1ac74cef02eb8fe3edfea4f15eaa673bfd)`(alps::Parameters const & p,bool issymbolic)` 

#### `public template<>`  <br/>`inline  `[`model_helper`](#df/d1b/classalps_1_1model__helper_1aa1a721e712e5aa27c162fd450d492d9b)`(alps::graph_helper< G > const & g,alps::Parameters const & p,bool issymbolic)` 

#### `public inline const `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library)` & `[`model_library`](#df/d1b/classalps_1_1model__helper_1af730e87cc1182219bced2933c1da1e1e)`() const` 

#### `public inline `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< I > & `[`model`](#df/d1b/classalps_1_1model__helper_1a3591ecddaf3f1dd0c1f57c76d46da3dd)`()` 

#### `public inline const `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< I > & `[`model`](#df/d1b/classalps_1_1model__helper_1a3128505c85d60d9d837992f814ecfb89)`() const` 

#### `public inline `[`basis_descriptor_type`](#dc/dd6/classalps_1_1_basis_descriptor)` & `[`basis`](#df/d1b/classalps_1_1model__helper_1ab24bc7fa0f368572783fcbc9609f4728)`()` 

#### `public inline const `[`basis_descriptor_type`](#dc/dd6/classalps_1_1_basis_descriptor)` & `[`basis`](#df/d1b/classalps_1_1model__helper_1ae492b58cada8d7ecb0e6aa6da471553e)`() const` 

#### `public inline const `[`site_basis_descriptor_type`](#d7/ddb/classalps_1_1_site_basis_descriptor)` & `[`site_basis`](#df/d1b/classalps_1_1model__helper_1a5af8210eb9488394fcb28ab84c0f46a2)`(int type) const` 

#### `public inline `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` `[`site_term`](#df/d1b/classalps_1_1model__helper_1a78862d9a1919a802f36720417b5863cc)`(int type) const` 

#### `public inline `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` `[`bond_term`](#df/d1b/classalps_1_1model__helper_1a8eb205d89f6affdd1250fa7afddb1393)`(int type) const` 

#### `public inline bool `[`has_site_operator`](#df/d1b/classalps_1_1model__helper_1ae39116740b51195f04a18daf50419cfd)`(const std::string & name) const` 

#### `public inline bool `[`has_bond_operator`](#df/d1b/classalps_1_1model__helper_1a7b9d1c23695f326197341606eb649876)`(const std::string & name) const` 

#### `public inline bool `[`has_global_operator`](#df/d1b/classalps_1_1model__helper_1aabba6efcda281fdf1d39eb02b1f069a8)`(const std::string & name) const` 

#### `public inline bool `[`has_operator`](#df/d1b/classalps_1_1model__helper_1a561457550fb9ff28606c8befe567bd26)`(const std::string & name) const` 

#### `public inline `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` `[`get_site_operator`](#df/d1b/classalps_1_1model__helper_1affa4b7c2119bbfd40355cc84ee4027a6)`(const std::string & name,const Parameters & p) const` 

#### `public inline `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` `[`get_bond_operator`](#df/d1b/classalps_1_1model__helper_1a9d5907d23a6b90101d7e3cfc22dc2b1c)`(const std::string & name,const Parameters & p) const` 

#### `public inline `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` `[`get_site_operator`](#df/d1b/classalps_1_1model__helper_1a1cc78343ac9967b0502f579db27d3d99)`(const std::string & name) const` 

#### `public inline `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` `[`get_bond_operator`](#df/d1b/classalps_1_1model__helper_1a705e1994c13e09c8432777e21c1cfd36)`(const std::string & name) const` 

#### `public inline `[`GlobalOperator`](#db/ddd/classalps_1_1_global_operator)` `[`get_global_operator`](#df/d1b/classalps_1_1model__helper_1a41e15fbbd70064074fe82b110f6d6ebc)`(const std::string & name) const` 

#### `public template<>`  <br/>`inline void `[`substitute_operators`](#df/d1b/classalps_1_1model__helper_1ab7896834a34e275a76c410644776e3da)`(OP & op,const Parameters & p) const` 

#### `public inline std::set< std::string > `[`quantum_numbers`](#df/d1b/classalps_1_1model__helper_1ad8809b9d8539ebbf54b9bd73f04e0fdf)`(int type)` 

#### `typedef `[`basis_descriptor_type`](#df/d1b/classalps_1_1model__helper_1a4b3747f34963531d77533e889ec632b7) 

#### `typedef `[`site_basis_descriptor_type`](#df/d1b/classalps_1_1model__helper_1a171ea855823cd6202afcc49e028f4732) 

#### `typedef `[`half_integer_type`](#df/d1b/classalps_1_1model__helper_1ac1a6091eec8223a2520edde1dba5d3c4) 

#### `typedef `[`quantum_number_type`](#df/d1b/classalps_1_1model__helper_1abea0965975776311b2a7a0246921b0d7) 

# class `alps::ModelLibrary` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library_1a1e92fd9e83ed0affa3674c6d90442997)`()` | 
`public inline  `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library_1a6fbb7ae8cb6607a84f7bee965eca9552)`(std::istream & in)` | 
`public inline  `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library_1aac822ed4c73a44e78bc2a20ab9abf285)`(const XMLTag & tag,std::istream & p)` | 
`public  `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library_1ab2ac808f094542975b67981bf7605399)`(const Parameters & parms)` | 
`public inline void `[`read_xml`](#d8/de2/classalps_1_1_model_library_1a4b7c7f442a337f5c6209b58aa2033432)`(std::istream & in)` | 
`public void `[`read_xml`](#d8/de2/classalps_1_1_model_library_1aee134a3826712573aee80f788b8263a8)`(const XMLTag & tag,std::istream & p)` | 
`public void `[`write_xml`](#d8/de2/classalps_1_1_model_library_1a5b69ed9a8b3e90d90ba182bfc122505a)`(alps::oxstream &) const` | 
`public bool `[`has_basis`](#d8/de2/classalps_1_1_model_library_1aa9f4fa73c8277a0bd10bb6399a97a6f5)`(const std::string & name) const` | 
`public bool `[`has_site_basis`](#d8/de2/classalps_1_1_model_library_1a5eb733fe39e8b49d4b13367a926c8a95)`(const std::string & name) const` | 
`public bool `[`has_hamiltonian`](#d8/de2/classalps_1_1_model_library_1a1eb15a7fc84c2571955b776c7f459176)`(const std::string & name) const` | 
`public bool `[`has_site_operator`](#d8/de2/classalps_1_1_model_library_1a37cc9158407362aed53e900fc1f0884c)`(const std::string & name) const` | 
`public bool `[`has_bond_operator`](#d8/de2/classalps_1_1_model_library_1ab4ef67d8ea478da79dfa30fa2132abe8)`(const std::string & name) const` | 
`public bool `[`has_global_operator`](#d8/de2/classalps_1_1_model_library_1a918fdfb763bf0a275de7e3259f798ee4)`(const std::string & name) const` | 
`public inline bool `[`has_operator`](#d8/de2/classalps_1_1_model_library_1a0d23192d4021e91fa28b11ba0ed2088e)`(const std::string & name) const` | 
`public const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< short > & `[`get_site_basis`](#d8/de2/classalps_1_1_model_library_1a0dff3244703c2722fd1ea733d4d7c0ec)`(const std::string & name) const` | 
`public const `[`BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor)`< short > & `[`get_basis`](#d8/de2/classalps_1_1_model_library_1a39f5263d87a7d2c281e3b635b95fee92)`(const std::string & name) const` | 
`public const `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< short > & `[`get_hamiltonian`](#d8/de2/classalps_1_1_model_library_1a9bd7af0a952a594de4405bfaf0dc33ce)`(const std::string & name) const` | 
`public `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< short > `[`get_hamiltonian`](#d8/de2/classalps_1_1_model_library_1a03a1803bfbda32348c437ef9fcd0fa4d)`(const std::string & name,Parameters const & parms,bool issymbolic) const` | 
`public inline `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< short > `[`get_hamiltonian`](#d8/de2/classalps_1_1_model_library_1a633d981dc5a04e5ab50776d1d8f57c5c)`(Parameters const & parms,bool issymbolic) const` | 
`public template<>`  <br/>`inline `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< short > `[`get_hamiltonian`](#d8/de2/classalps_1_1_model_library_1ac19b08e4c01f414739f2717b3b3d3d1e)`(alps::graph_helper< G > const & g,Parameters const & parms,bool issymbolic) const` | 
`public template<>`  <br/>`inline `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< short > `[`get_hamiltonian`](#d8/de2/classalps_1_1_model_library_1a61e88273ac9138a68c80252e562f3982)`(alps::graph_helper< G > const & g,const std::string & name,Parameters const & parms,bool issymbolic) const` | 
`public inline const SiteOperatorMap & `[`site_operators`](#d8/de2/classalps_1_1_model_library_1a2bf66bae82109032a406b64206176e6b)`() const` | 
`public inline const BondOperatorMap & `[`bond_operators`](#d8/de2/classalps_1_1_model_library_1aec8bc1ea4659df66d25cf0b4d46d119b)`() const` | 
`public inline const GlobalOperatorMap & `[`global_operators`](#d8/de2/classalps_1_1_model_library_1a59a75b15894220aad28acfb7c7b75bc3)`() const` | 
`public `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` `[`get_site_operator`](#d8/de2/classalps_1_1_model_library_1aa7631811cd2d3f061f3650a0bb8ee7dc)`(const std::string & name,Parameters const & p) const` | 
`public `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` `[`get_bond_operator`](#d8/de2/classalps_1_1_model_library_1ae70d7f3fe459c1e898e0fbc23f29bea4)`(const std::string & name,Parameters const & p) const` | 
`public `[`GlobalOperator`](#db/ddd/classalps_1_1_global_operator)` `[`get_global_operator`](#d8/de2/classalps_1_1_model_library_1ae490de1e9557ca07be1804d4a52bea26)`(const std::string & name,Parameters const & p) const` | 
`typedef `[`OperatorDescriptorMap`](#d8/de2/classalps_1_1_model_library_1af9d2c7b414494738cbec28158356ec11) | 
`typedef `[`SiteOperatorMap`](#d8/de2/classalps_1_1_model_library_1a8ac7eba0b48f737a521d5367f8d8e9e6) | 
`typedef `[`BondOperatorMap`](#d8/de2/classalps_1_1_model_library_1ae02b93a6b8e7204173515e827b154492) | 
`typedef `[`GlobalOperatorMap`](#d8/de2/classalps_1_1_model_library_1aee42f52ddc4b3769ab0f8438ca3e10bc) | 

## Members

#### `public inline  `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library_1a1e92fd9e83ed0affa3674c6d90442997)`()` 

#### `public inline  `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library_1a6fbb7ae8cb6607a84f7bee965eca9552)`(std::istream & in)` 

#### `public inline  `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library_1aac822ed4c73a44e78bc2a20ab9abf285)`(const XMLTag & tag,std::istream & p)` 

#### `public  `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library_1ab2ac808f094542975b67981bf7605399)`(const Parameters & parms)` 

#### `public inline void `[`read_xml`](#d8/de2/classalps_1_1_model_library_1a4b7c7f442a337f5c6209b58aa2033432)`(std::istream & in)` 

#### `public void `[`read_xml`](#d8/de2/classalps_1_1_model_library_1aee134a3826712573aee80f788b8263a8)`(const XMLTag & tag,std::istream & p)` 

#### `public void `[`write_xml`](#d8/de2/classalps_1_1_model_library_1a5b69ed9a8b3e90d90ba182bfc122505a)`(alps::oxstream &) const` 

#### `public bool `[`has_basis`](#d8/de2/classalps_1_1_model_library_1aa9f4fa73c8277a0bd10bb6399a97a6f5)`(const std::string & name) const` 

#### `public bool `[`has_site_basis`](#d8/de2/classalps_1_1_model_library_1a5eb733fe39e8b49d4b13367a926c8a95)`(const std::string & name) const` 

#### `public bool `[`has_hamiltonian`](#d8/de2/classalps_1_1_model_library_1a1eb15a7fc84c2571955b776c7f459176)`(const std::string & name) const` 

#### `public bool `[`has_site_operator`](#d8/de2/classalps_1_1_model_library_1a37cc9158407362aed53e900fc1f0884c)`(const std::string & name) const` 

#### `public bool `[`has_bond_operator`](#d8/de2/classalps_1_1_model_library_1ab4ef67d8ea478da79dfa30fa2132abe8)`(const std::string & name) const` 

#### `public bool `[`has_global_operator`](#d8/de2/classalps_1_1_model_library_1a918fdfb763bf0a275de7e3259f798ee4)`(const std::string & name) const` 

#### `public inline bool `[`has_operator`](#d8/de2/classalps_1_1_model_library_1a0d23192d4021e91fa28b11ba0ed2088e)`(const std::string & name) const` 

#### `public const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< short > & `[`get_site_basis`](#d8/de2/classalps_1_1_model_library_1a0dff3244703c2722fd1ea733d4d7c0ec)`(const std::string & name) const` 

#### `public const `[`BasisDescriptor`](#dc/dd6/classalps_1_1_basis_descriptor)`< short > & `[`get_basis`](#d8/de2/classalps_1_1_model_library_1a39f5263d87a7d2c281e3b635b95fee92)`(const std::string & name) const` 

#### `public const `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< short > & `[`get_hamiltonian`](#d8/de2/classalps_1_1_model_library_1a9bd7af0a952a594de4405bfaf0dc33ce)`(const std::string & name) const` 

#### `public `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< short > `[`get_hamiltonian`](#d8/de2/classalps_1_1_model_library_1a03a1803bfbda32348c437ef9fcd0fa4d)`(const std::string & name,Parameters const & parms,bool issymbolic) const` 

#### `public inline `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< short > `[`get_hamiltonian`](#d8/de2/classalps_1_1_model_library_1a633d981dc5a04e5ab50776d1d8f57c5c)`(Parameters const & parms,bool issymbolic) const` 

#### `public template<>`  <br/>`inline `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< short > `[`get_hamiltonian`](#d8/de2/classalps_1_1_model_library_1ac19b08e4c01f414739f2717b3b3d3d1e)`(alps::graph_helper< G > const & g,Parameters const & parms,bool issymbolic) const` 

#### `public template<>`  <br/>`inline `[`HamiltonianDescriptor`](#d6/da8/classalps_1_1_hamiltonian_descriptor)`< short > `[`get_hamiltonian`](#d8/de2/classalps_1_1_model_library_1a61e88273ac9138a68c80252e562f3982)`(alps::graph_helper< G > const & g,const std::string & name,Parameters const & parms,bool issymbolic) const` 

#### `public inline const SiteOperatorMap & `[`site_operators`](#d8/de2/classalps_1_1_model_library_1a2bf66bae82109032a406b64206176e6b)`() const` 

#### `public inline const BondOperatorMap & `[`bond_operators`](#d8/de2/classalps_1_1_model_library_1aec8bc1ea4659df66d25cf0b4d46d119b)`() const` 

#### `public inline const GlobalOperatorMap & `[`global_operators`](#d8/de2/classalps_1_1_model_library_1a59a75b15894220aad28acfb7c7b75bc3)`() const` 

#### `public `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` `[`get_site_operator`](#d8/de2/classalps_1_1_model_library_1aa7631811cd2d3f061f3650a0bb8ee7dc)`(const std::string & name,Parameters const & p) const` 

#### `public `[`BondOperator`](#de/df1/classalps_1_1_bond_operator)` `[`get_bond_operator`](#d8/de2/classalps_1_1_model_library_1ae70d7f3fe459c1e898e0fbc23f29bea4)`(const std::string & name,Parameters const & p) const` 

#### `public `[`GlobalOperator`](#db/ddd/classalps_1_1_global_operator)` `[`get_global_operator`](#d8/de2/classalps_1_1_model_library_1ae490de1e9557ca07be1804d4a52bea26)`(const std::string & name,Parameters const & p) const` 

#### `typedef `[`OperatorDescriptorMap`](#d8/de2/classalps_1_1_model_library_1af9d2c7b414494738cbec28158356ec11) 

#### `typedef `[`SiteOperatorMap`](#d8/de2/classalps_1_1_model_library_1a8ac7eba0b48f737a521d5367f8d8e9e6) 

#### `typedef `[`BondOperatorMap`](#d8/de2/classalps_1_1_model_library_1ae02b93a6b8e7204173515e827b154492) 

#### `typedef `[`GlobalOperatorMap`](#d8/de2/classalps_1_1_model_library_1aee42f52ddc4b3769ab0f8438ca3e10bc) 

# class `alps::OperatorDescriptor` 

```
class alps::OperatorDescriptor
  : private std::vector< std::pair< std::string, half_integer< I > > >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`OperatorDescriptor`](#da/d8c/classalps_1_1_operator_descriptor_1a9749943313ce5c7786618ad2411fddc2)`()` | 
`public inline  `[`OperatorDescriptor`](#da/d8c/classalps_1_1_operator_descriptor_1abacdc8a9911896efceaf54f86b00ce46)`(const std::string & name,const std::string & elm)` | 
`public  `[`OperatorDescriptor`](#da/d8c/classalps_1_1_operator_descriptor_1abc95daf6169c35293eca4b1460d1b93a)`(const XMLTag &,std::istream &)` | 
`public void `[`write_xml`](#da/d8c/classalps_1_1_operator_descriptor_1a3c68361198e0a6a457003f28c2ec648f)`(oxstream &) const` | 
`public template<>`  <br/>`boost::tuple< STATE, expression::Expression< T >, bool > `[`apply`](#da/d8c/classalps_1_1_operator_descriptor_1a6e1242bd291d3282f3cb2baac8b5a3ce)`(STATE state,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & basis,const expression::ParameterEvaluator< T > & p,bool) const` | 
`public bool `[`is_fermionic`](#da/d8c/classalps_1_1_operator_descriptor_1ad15514db0add70fe9cd90c70ae248f22)`(const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & basis) const` | 
`public inline const std::string & `[`name`](#da/d8c/classalps_1_1_operator_descriptor_1a262ca396922ade5c14260740896193cf)`() const` | 
`public inline const std::string & `[`matrixelement`](#da/d8c/classalps_1_1_operator_descriptor_1af95c829b2fbceb618f6868ec83525932)`() const` | 
`typedef `[`const_iterator`](#da/d8c/classalps_1_1_operator_descriptor_1aa7c59f629385242dbf5e4e6ca1bf3449) | 
`typedef `[`operator_map`](#da/d8c/classalps_1_1_operator_descriptor_1a35842ff06469461f72f15f5211200159) | 

## Members

#### `public inline  `[`OperatorDescriptor`](#da/d8c/classalps_1_1_operator_descriptor_1a9749943313ce5c7786618ad2411fddc2)`()` 

#### `public inline  `[`OperatorDescriptor`](#da/d8c/classalps_1_1_operator_descriptor_1abacdc8a9911896efceaf54f86b00ce46)`(const std::string & name,const std::string & elm)` 

#### `public  `[`OperatorDescriptor`](#da/d8c/classalps_1_1_operator_descriptor_1abc95daf6169c35293eca4b1460d1b93a)`(const XMLTag &,std::istream &)` 

#### `public void `[`write_xml`](#da/d8c/classalps_1_1_operator_descriptor_1a3c68361198e0a6a457003f28c2ec648f)`(oxstream &) const` 

#### `public template<>`  <br/>`boost::tuple< STATE, expression::Expression< T >, bool > `[`apply`](#da/d8c/classalps_1_1_operator_descriptor_1a6e1242bd291d3282f3cb2baac8b5a3ce)`(STATE state,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & basis,const expression::ParameterEvaluator< T > & p,bool) const` 

#### `public bool `[`is_fermionic`](#da/d8c/classalps_1_1_operator_descriptor_1ad15514db0add70fe9cd90c70ae248f22)`(const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & basis) const` 

#### `public inline const std::string & `[`name`](#da/d8c/classalps_1_1_operator_descriptor_1a262ca396922ade5c14260740896193cf)`() const` 

#### `public inline const std::string & `[`matrixelement`](#da/d8c/classalps_1_1_operator_descriptor_1af95c829b2fbceb618f6868ec83525932)`() const` 

#### `typedef `[`const_iterator`](#da/d8c/classalps_1_1_operator_descriptor_1aa7c59f629385242dbf5e4e6ca1bf3449) 

#### `typedef `[`operator_map`](#da/d8c/classalps_1_1_operator_descriptor_1a35842ff06469461f72f15f5211200159) 

# class `alps::OperatorEvaluator` 

```
class alps::OperatorEvaluator
  : public expression::ParameterEvaluator< std::complex< double > >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`OperatorEvaluator`](#d7/dbe/classalps_1_1_operator_evaluator_1a5a60233245a296fc4ee84d5375560868)`(const Parameters & p)` | 
`public inline super_type::Direction `[`direction`](#d7/dbe/classalps_1_1_operator_evaluator_1a489afc175db348206f7f6b84edb3a7d2)`() const` | 
`public inline value_type `[`evaluate`](#d7/dbe/classalps_1_1_operator_evaluator_1ad5c01e9bfafef117ee3748a28721ad9f)`(const std::string & name,bool isarg) const` | 
`public inline value_type `[`evaluate_function`](#d7/dbe/classalps_1_1_operator_evaluator_1ab0e440e583c12c7eefcafe0b7541a774)`(const std::string & name,const expression::Expression< T > & arg,bool isarg) const` | 
`public inline value_type `[`evaluate_function`](#d7/dbe/classalps_1_1_operator_evaluator_1aa39c3425e1e51c5ae9ec7860337fb7f7)`(const std::string & name,const std::vector< expression::Expression< T > > & args,bool isarg) const` | 
`typedef `[`super_type`](#d7/dbe/classalps_1_1_operator_evaluator_1a2a62e62e910e50f07eaa53a46961cc27) | 
`typedef `[`value_type`](#d7/dbe/classalps_1_1_operator_evaluator_1a77646576e333382254a0a77d00d546e0) | 

## Members

#### `public inline  `[`OperatorEvaluator`](#d7/dbe/classalps_1_1_operator_evaluator_1a5a60233245a296fc4ee84d5375560868)`(const Parameters & p)` 

#### `public inline super_type::Direction `[`direction`](#d7/dbe/classalps_1_1_operator_evaluator_1a489afc175db348206f7f6b84edb3a7d2)`() const` 

#### `public inline value_type `[`evaluate`](#d7/dbe/classalps_1_1_operator_evaluator_1ad5c01e9bfafef117ee3748a28721ad9f)`(const std::string & name,bool isarg) const` 

#### `public inline value_type `[`evaluate_function`](#d7/dbe/classalps_1_1_operator_evaluator_1ab0e440e583c12c7eefcafe0b7541a774)`(const std::string & name,const expression::Expression< T > & arg,bool isarg) const` 

#### `public inline value_type `[`evaluate_function`](#d7/dbe/classalps_1_1_operator_evaluator_1aa39c3425e1e51c5ae9ec7860337fb7f7)`(const std::string & name,const std::vector< expression::Expression< T > > & args,bool isarg) const` 

#### `typedef `[`super_type`](#d7/dbe/classalps_1_1_operator_evaluator_1a2a62e62e910e50f07eaa53a46961cc27) 

#### `typedef `[`value_type`](#d7/dbe/classalps_1_1_operator_evaluator_1a77646576e333382254a0a77d00d546e0) 

# class `alps::OperatorSubstitution` 

```
class alps::OperatorSubstitution
  : public expression::ParameterEvaluator< std::complex< double > >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`OperatorSubstitution`](#d2/d76/classalps_1_1_operator_substitution_1a8edb238f0d906b3f830e0dc9645cf40d)`(const `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library)` & lib,const Parameters & p,const std::vector< std::string > & s)` | 
`public expression::Expression< T > `[`partial_evaluate`](#d2/d76/classalps_1_1_operator_substitution_1aa5e9cb36a0f8717e1f63dd56b90d2941)`(const std::string & name,bool) const` | 
`public bool `[`can_evaluate_function`](#d2/d76/classalps_1_1_operator_substitution_1ac868ed1d5476ae64e52e5f5ef019bb66)`(const std::string &,const std::vector< expression::Expression< T > > &,bool) const` | 
`public expression::Expression< T > `[`partial_evaluate_function`](#d2/d76/classalps_1_1_operator_substitution_1a5131b6c2c9ff1d294c9154a8d3647301)`(const std::string &,const std::vector< expression::Expression< T > > &,bool) const` | 
`public inline void `[`substitute_arguments`](#d2/d76/classalps_1_1_operator_substitution_1a42c28d874eb2a08d2df2b1a9d41b62e6)`(const std::map< std::string, std::string > & p)` | 
`public inline void `[`set_sites`](#d2/d76/classalps_1_1_operator_substitution_1afdda51c5b96bdc396864cac09c4ac22b)`(const std::vector< std::string > & s)` | 
`typedef `[`SiteOperatorMap`](#d2/d76/classalps_1_1_operator_substitution_1ada30b4fb531b5ec11906348b379ad25f) | 
`typedef `[`BondOperatorMap`](#d2/d76/classalps_1_1_operator_substitution_1ab97a13b0a36224a799261691c826a382) | 

## Members

#### `public inline  `[`OperatorSubstitution`](#d2/d76/classalps_1_1_operator_substitution_1a8edb238f0d906b3f830e0dc9645cf40d)`(const `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library)` & lib,const Parameters & p,const std::vector< std::string > & s)` 

#### `public expression::Expression< T > `[`partial_evaluate`](#d2/d76/classalps_1_1_operator_substitution_1aa5e9cb36a0f8717e1f63dd56b90d2941)`(const std::string & name,bool) const` 

#### `public bool `[`can_evaluate_function`](#d2/d76/classalps_1_1_operator_substitution_1ac868ed1d5476ae64e52e5f5ef019bb66)`(const std::string &,const std::vector< expression::Expression< T > > &,bool) const` 

#### `public expression::Expression< T > `[`partial_evaluate_function`](#d2/d76/classalps_1_1_operator_substitution_1a5131b6c2c9ff1d294c9154a8d3647301)`(const std::string &,const std::vector< expression::Expression< T > > &,bool) const` 

#### `public inline void `[`substitute_arguments`](#d2/d76/classalps_1_1_operator_substitution_1a42c28d874eb2a08d2df2b1a9d41b62e6)`(const std::map< std::string, std::string > & p)` 

#### `public inline void `[`set_sites`](#d2/d76/classalps_1_1_operator_substitution_1afdda51c5b96bdc396864cac09c4ac22b)`(const std::vector< std::string > & s)` 

#### `typedef `[`SiteOperatorMap`](#d2/d76/classalps_1_1_operator_substitution_1ada30b4fb531b5ec11906348b379ad25f) 

#### `typedef `[`BondOperatorMap`](#d2/d76/classalps_1_1_operator_substitution_1ab97a13b0a36224a799261691c826a382) 

# class `alps::QuantumNumberDescriptor` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a70b1f0ddee5ad5a4839fecc3f5ed92aa)`(const std::string & n,`[`value_type`](#d8/d6f/classalps_1_1half__integer)` minVal,`[`value_type`](#d8/d6f/classalps_1_1half__integer)` maxVal,bool f)` | 
`public  `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a20baec2403c009e420e943f38da2b7aa)`(const std::string & n,const std::string & min_str,const std::string & max_str,bool f)` | 
`public  `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a9fcc74d091cc9923cfb4e9709d6e946e)`(const XMLTag &,std::istream &)` | 
`public inline bool `[`valid`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a30ff830a3451ca579995e1972bf527ad)`(`[`value_type`](#d8/d6f/classalps_1_1half__integer)` x) const` | 
`public inline const std::string `[`min_expression`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1ad6bf33f9a249e98947c0f43cb92bf521)`() const` | 
`public inline const std::string `[`max_expression`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1aec387c461110b2b01ca75895f25a4b35)`() const` | 
`public inline `[`value_type`](#d8/d6f/classalps_1_1half__integer)` min `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1af107c484c27c3cba446fd3ab91772737)`() const` | 
`public inline `[`value_type`](#d8/d6f/classalps_1_1half__integer)` max `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a20728f5de8fa9619435196c2114e4093)`() const` | 
`public inline `[`value_type`](#d8/d6f/classalps_1_1half__integer)` `[`global_max`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1aef189b14d48dca2415a1d020a322c0c2)`() const` | 
`public inline `[`value_type`](#d8/d6f/classalps_1_1half__integer)` `[`global_min`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a6702a2588cc4d8c7af47c68eda740b39)`() const` | 
`public inline `[`value_type`](#d8/d6f/classalps_1_1half__integer)` `[`global_increment`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1ada66dd4ad603f0f774305b9b24ddea0e)`() const` | 
`public inline range_type `[`global_range`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a1664c021a424f73ba496f4bd2c0bc6c7)`() const` | 
`public inline I `[`levels`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a184aab8febb3080b03c0f5ed72181e47)`() const` | 
`public inline const std::string & `[`name`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a11c46db6194735d6a8c092b5442d1c8f)`() const` | 
`public const `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)` & `[`operator+=`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a508c4522da901d2c275e14c33e644bcf)`(const `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)` & rhs)` | 
`public void `[`write_xml`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1af38ed896477b53be3a03b51bb3357b5f)`(alps::oxstream &) const` | 
`public inline bool `[`fermionic`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a3d9fa8d396e59e40a3a488e8bff2d447)`() const` | 
`public bool `[`set_parameters`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a7400d1bd6b998b48f5d41bfecd3e16c1)`(const Parameters &)` | 
`public bool `[`depends_on`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1ac387dce4521e49a677e68fbca03acf11)`(const Parameters::key_type & s) const` | 
`public inline bool `[`depends_on`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a3e6741097bf3ab6d5aabc309233395d3)`(const `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)` & qn) const` | 
`public inline void `[`add_dependency`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a04572196e5aa4848357cb3fa42713c8f)`(const `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)` & qn)` | 
`public inline void `[`reset_limits`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a9f31ca1d9ec4edc1c3eae5cd7a33926b)`()` | 
`public inline void `[`update_limits`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1ae083f1d2e1e6295a9dd18a2e52a6904c)`()` | 
`typedef `[`value_type`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a78da8bfdbe4f305a803be94baa817750) | 
`typedef `[`range_type`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a5608c7d0e9c859edafa3a159777ba9c4) | 

## Members

#### `public  `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a70b1f0ddee5ad5a4839fecc3f5ed92aa)`(const std::string & n,`[`value_type`](#d8/d6f/classalps_1_1half__integer)` minVal,`[`value_type`](#d8/d6f/classalps_1_1half__integer)` maxVal,bool f)` 

#### `public  `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a20baec2403c009e420e943f38da2b7aa)`(const std::string & n,const std::string & min_str,const std::string & max_str,bool f)` 

#### `public  `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a9fcc74d091cc9923cfb4e9709d6e946e)`(const XMLTag &,std::istream &)` 

#### `public inline bool `[`valid`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a30ff830a3451ca579995e1972bf527ad)`(`[`value_type`](#d8/d6f/classalps_1_1half__integer)` x) const` 

#### `public inline const std::string `[`min_expression`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1ad6bf33f9a249e98947c0f43cb92bf521)`() const` 

#### `public inline const std::string `[`max_expression`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1aec387c461110b2b01ca75895f25a4b35)`() const` 

#### `public inline `[`value_type`](#d8/d6f/classalps_1_1half__integer)` min `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1af107c484c27c3cba446fd3ab91772737)`() const` 

#### `public inline `[`value_type`](#d8/d6f/classalps_1_1half__integer)` max `[`BOOST_PREVENT_MACRO_SUBSTITUTION`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a20728f5de8fa9619435196c2114e4093)`() const` 

#### `public inline `[`value_type`](#d8/d6f/classalps_1_1half__integer)` `[`global_max`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1aef189b14d48dca2415a1d020a322c0c2)`() const` 

#### `public inline `[`value_type`](#d8/d6f/classalps_1_1half__integer)` `[`global_min`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a6702a2588cc4d8c7af47c68eda740b39)`() const` 

#### `public inline `[`value_type`](#d8/d6f/classalps_1_1half__integer)` `[`global_increment`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1ada66dd4ad603f0f774305b9b24ddea0e)`() const` 

#### `public inline range_type `[`global_range`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a1664c021a424f73ba496f4bd2c0bc6c7)`() const` 

#### `public inline I `[`levels`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a184aab8febb3080b03c0f5ed72181e47)`() const` 

#### `public inline const std::string & `[`name`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a11c46db6194735d6a8c092b5442d1c8f)`() const` 

#### `public const `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)` & `[`operator+=`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a508c4522da901d2c275e14c33e644bcf)`(const `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)` & rhs)` 

#### `public void `[`write_xml`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1af38ed896477b53be3a03b51bb3357b5f)`(alps::oxstream &) const` 

#### `public inline bool `[`fermionic`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a3d9fa8d396e59e40a3a488e8bff2d447)`() const` 

#### `public bool `[`set_parameters`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a7400d1bd6b998b48f5d41bfecd3e16c1)`(const Parameters &)` 

#### `public bool `[`depends_on`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1ac387dce4521e49a677e68fbca03acf11)`(const Parameters::key_type & s) const` 

#### `public inline bool `[`depends_on`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a3e6741097bf3ab6d5aabc309233395d3)`(const `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)` & qn) const` 

#### `public inline void `[`add_dependency`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a04572196e5aa4848357cb3fa42713c8f)`(const `[`QuantumNumberDescriptor`](#d0/d0f/classalps_1_1_quantum_number_descriptor)` & qn)` 

#### `public inline void `[`reset_limits`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a9f31ca1d9ec4edc1c3eae5cd7a33926b)`()` 

#### `public inline void `[`update_limits`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1ae083f1d2e1e6295a9dd18a2e52a6904c)`()` 

#### `typedef `[`value_type`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a78da8bfdbe4f305a803be94baa817750) 

#### `typedef `[`range_type`](#d0/d0f/classalps_1_1_quantum_number_descriptor_1a5608c7d0e9c859edafa3a159777ba9c4) 

# class `alps::single_qn_site_state` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state_1a29f25d265d8a249e89fb2aa64c48a35b)`()` | 
`public inline  `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state_1a0f99e2a2b81f08b2cc2e7048a7ced6b0)`(`[`representation_type`](#d8/d6f/classalps_1_1half__integer)` x)` | 
`public template<>`  <br/>`inline  `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state_1ac178fda942e2593c24d2ad5853d35ec0)`(const std::vector< `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > > & x)` | 
`public inline  `[`operator representation_type`](#d2/db8/classalps_1_1single__qn__site__state_1a60dd2eaffa7186dbfb04a27a2e6f4678)`() const` | 
`public inline `[`representation_type`](#d8/d6f/classalps_1_1half__integer)` `[`state`](#d2/db8/classalps_1_1single__qn__site__state_1ae7a3a57c54a573ddf2ade3d7575880dd)`() const` | 
`public inline `[`representation_type`](#d8/d6f/classalps_1_1half__integer)` & `[`state`](#d2/db8/classalps_1_1single__qn__site__state_1ad8fe38bad4aaa1efc7a412f7385fa994)`()` | 
`typedef `[`representation_type`](#d2/db8/classalps_1_1single__qn__site__state_1a76874e477e4d7bb6eaf50b8c79872cb6) | 
`typedef `[`quantumnumber_type`](#d2/db8/classalps_1_1single__qn__site__state_1a52211c9ba10e3d21c92de95a9fd04a44) | 
`typedef `[`size_type`](#d2/db8/classalps_1_1single__qn__site__state_1a079f95cd848afe301ad9e35679604187) | 

## Members

#### `public inline  `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state_1a29f25d265d8a249e89fb2aa64c48a35b)`()` 

#### `public inline  `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state_1a0f99e2a2b81f08b2cc2e7048a7ced6b0)`(`[`representation_type`](#d8/d6f/classalps_1_1half__integer)` x)` 

#### `public template<>`  <br/>`inline  `[`single_qn_site_state`](#d2/db8/classalps_1_1single__qn__site__state_1ac178fda942e2593c24d2ad5853d35ec0)`(const std::vector< `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< J > > & x)` 

#### `public inline  `[`operator representation_type`](#d2/db8/classalps_1_1single__qn__site__state_1a60dd2eaffa7186dbfb04a27a2e6f4678)`() const` 

#### `public inline `[`representation_type`](#d8/d6f/classalps_1_1half__integer)` `[`state`](#d2/db8/classalps_1_1single__qn__site__state_1ae7a3a57c54a573ddf2ade3d7575880dd)`() const` 

#### `public inline `[`representation_type`](#d8/d6f/classalps_1_1half__integer)` & `[`state`](#d2/db8/classalps_1_1single__qn__site__state_1ad8fe38bad4aaa1efc7a412f7385fa994)`()` 

#### `typedef `[`representation_type`](#d2/db8/classalps_1_1single__qn__site__state_1a76874e477e4d7bb6eaf50b8c79872cb6) 

#### `typedef `[`quantumnumber_type`](#d2/db8/classalps_1_1single__qn__site__state_1a52211c9ba10e3d21c92de95a9fd04a44) 

#### `typedef `[`size_type`](#d2/db8/classalps_1_1single__qn__site__state_1a079f95cd848afe301ad9e35679604187) 

# class `alps::site_basis` 

```
class alps::site_basis
  : public std::vector< site_state< I > >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  `[`site_basis`](#da/d7f/classalps_1_1site__basis_1a139680d6ae0eb989a54e82f3e951a9c8)`(const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b)` | 
`public size_type `[`index`](#da/d7f/classalps_1_1site__basis_1add6e55fc6d42684d8cb44288fd1f6d57)`(const value_type & x) const` | 
`public inline const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & `[`basis`](#da/d7f/classalps_1_1site__basis_1a02c490d3e31abf82cf94983a50b81998)`() const` | 
`public bool `[`check_sort`](#da/d7f/classalps_1_1site__basis_1a4f5da16535fec5fc47ca9cdca992ba18)`() const` | 
`typedef `[`state_type`](#da/d7f/classalps_1_1site__basis_1a270aec016b858e6514caa2819cebb9f3) | 
`typedef `[`base_type`](#da/d7f/classalps_1_1site__basis_1aec683f3717f123b30c3e79d63a1156e7) | 
`typedef `[`const_iterator`](#da/d7f/classalps_1_1site__basis_1a79ab775be0840f7ffd9ba5f09bba3558) | 
`typedef `[`value_type`](#da/d7f/classalps_1_1site__basis_1a9fe686040c2acc79e29c34a6637fa106) | 
`typedef `[`size_type`](#da/d7f/classalps_1_1site__basis_1a735b0515a5f6372ba11b36602261528c) | 

## Members

#### `public  `[`site_basis`](#da/d7f/classalps_1_1site__basis_1a139680d6ae0eb989a54e82f3e951a9c8)`(const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b)` 

#### `public size_type `[`index`](#da/d7f/classalps_1_1site__basis_1add6e55fc6d42684d8cb44288fd1f6d57)`(const value_type & x) const` 

#### `public inline const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & `[`basis`](#da/d7f/classalps_1_1site__basis_1a02c490d3e31abf82cf94983a50b81998)`() const` 

#### `public bool `[`check_sort`](#da/d7f/classalps_1_1site__basis_1a4f5da16535fec5fc47ca9cdca992ba18)`() const` 

#### `typedef `[`state_type`](#da/d7f/classalps_1_1site__basis_1a270aec016b858e6514caa2819cebb9f3) 

#### `typedef `[`base_type`](#da/d7f/classalps_1_1site__basis_1aec683f3717f123b30c3e79d63a1156e7) 

#### `typedef `[`const_iterator`](#da/d7f/classalps_1_1site__basis_1a79ab775be0840f7ffd9ba5f09bba3558) 

#### `typedef `[`value_type`](#da/d7f/classalps_1_1site__basis_1a9fe686040c2acc79e29c34a6637fa106) 

#### `typedef `[`size_type`](#da/d7f/classalps_1_1site__basis_1a735b0515a5f6372ba11b36602261528c) 

# class `alps::site_basis_match` 

```
class alps::site_basis_match
  : public alps::SiteBasisDescriptor< I >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`site_basis_match`](#d0/d20/classalps_1_1site__basis__match_1ae1b6c5c6ace9a7f7419c5ee5aa0963cc)`()` | 
`public inline  `[`site_basis_match`](#d0/d20/classalps_1_1site__basis__match_1a85d90fb9e5c02a28d6fd7b6409316c18)`(const `[`super_type`](#d7/ddb/classalps_1_1_site_basis_descriptor)` & site_basis,int type)` | 
`public inline  `[`site_basis_match`](#d0/d20/classalps_1_1site__basis__match_1a1d8670f7f4a44aab7c197d87925ee9d1)`(const std::string & name,int type)` | 
`public  `[`site_basis_match`](#d0/d20/classalps_1_1site__basis__match_1a332e6307482c652200253d3df7e18d1e)`(const XMLTag &,std::istream &,const sitebasis_map_type & bases_)` | 
`public void `[`write_xml`](#d0/d20/classalps_1_1site__basis__match_1aa7d8e9dfb8f2af527be60d60e247f2a3)`(oxstream &) const` | 
`public inline bool `[`match_type`](#d0/d20/classalps_1_1site__basis__match_1a378c99ff5dd98cc171f2371c8b623e44)`(int type) const` | 
`public void `[`set_type`](#d0/d20/classalps_1_1site__basis__match_1aed5b2ff77616b6cf473a1ba7bb95dd25)`(int type,Parameters const &)` | 
`public inline int `[`type`](#d0/d20/classalps_1_1site__basis__match_1a916e1222ef10c7caa6e35287be4088f3)`() const` | 
`typedef `[`super_type`](#d0/d20/classalps_1_1site__basis__match_1ab3935c82a015dd1100fd7243c0f656c8) | 
`typedef `[`const_iterator`](#d0/d20/classalps_1_1site__basis__match_1aef8907005d973a36a8cf04cc223c8eac) | 
`typedef `[`sitebasis_map_type`](#d0/d20/classalps_1_1site__basis__match_1a3c8a7d2cbaa822b248112547f15b241b) | 

## Members

#### `public inline  `[`site_basis_match`](#d0/d20/classalps_1_1site__basis__match_1ae1b6c5c6ace9a7f7419c5ee5aa0963cc)`()` 

#### `public inline  `[`site_basis_match`](#d0/d20/classalps_1_1site__basis__match_1a85d90fb9e5c02a28d6fd7b6409316c18)`(const `[`super_type`](#d7/ddb/classalps_1_1_site_basis_descriptor)` & site_basis,int type)` 

#### `public inline  `[`site_basis_match`](#d0/d20/classalps_1_1site__basis__match_1a1d8670f7f4a44aab7c197d87925ee9d1)`(const std::string & name,int type)` 

#### `public  `[`site_basis_match`](#d0/d20/classalps_1_1site__basis__match_1a332e6307482c652200253d3df7e18d1e)`(const XMLTag &,std::istream &,const sitebasis_map_type & bases_)` 

#### `public void `[`write_xml`](#d0/d20/classalps_1_1site__basis__match_1aa7d8e9dfb8f2af527be60d60e247f2a3)`(oxstream &) const` 

#### `public inline bool `[`match_type`](#d0/d20/classalps_1_1site__basis__match_1a378c99ff5dd98cc171f2371c8b623e44)`(int type) const` 

#### `public void `[`set_type`](#d0/d20/classalps_1_1site__basis__match_1aed5b2ff77616b6cf473a1ba7bb95dd25)`(int type,Parameters const &)` 

#### `public inline int `[`type`](#d0/d20/classalps_1_1site__basis__match_1a916e1222ef10c7caa6e35287be4088f3)`() const` 

#### `typedef `[`super_type`](#d0/d20/classalps_1_1site__basis__match_1ab3935c82a015dd1100fd7243c0f656c8) 

#### `typedef `[`const_iterator`](#d0/d20/classalps_1_1site__basis__match_1aef8907005d973a36a8cf04cc223c8eac) 

#### `typedef `[`sitebasis_map_type`](#d0/d20/classalps_1_1site__basis__match_1a3c8a7d2cbaa822b248112547f15b241b) 

# class `alps::site_state` 

```
class alps::site_state
  : public std::vector< half_integer< I > >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`site_state`](#d1/da3/classalps_1_1site__state_1aff108676512a43b5f90c867348a57663)`()` | 
`public inline  `[`site_state`](#d1/da3/classalps_1_1site__state_1ae05cc9cc09f9a68a3a9043be1d958b2a)`(const std::vector< `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > > & x)` | 
`typedef `[`quantumnumber_type`](#d1/da3/classalps_1_1site__state_1a7e9c7f2d161e93e38ff31e87bd68e783) | 
`typedef `[`const_iterator`](#d1/da3/classalps_1_1site__state_1a0c2279bfce6effcb514fdb9b629710c6) | 

## Members

#### `public inline  `[`site_state`](#d1/da3/classalps_1_1site__state_1aff108676512a43b5f90c867348a57663)`()` 

#### `public inline  `[`site_state`](#d1/da3/classalps_1_1site__state_1ae05cc9cc09f9a68a3a9043be1d958b2a)`(const std::vector< `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > > & x)` 

#### `typedef `[`quantumnumber_type`](#d1/da3/classalps_1_1site__state_1a7e9c7f2d161e93e38ff31e87bd68e783) 

#### `typedef `[`const_iterator`](#d1/da3/classalps_1_1site__state_1a0c2279bfce6effcb514fdb9b629710c6) 

# class `alps::SiteBasisDescriptor` 

```
class alps::SiteBasisDescriptor
  : public std::vector< QuantumNumberDescriptor< I > >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a69ae168dd02a42cb4ed61d818478dcee)`()` | 
`public inline  `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor_1aabdc9c07cf55822f438e2d5962b02c25)`(const std::string & name,const Parameters & parms,const operator_map & ops)` | 
`public  `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a46f76f895644dfcf0573c0699454f503)`(const XMLTag &,std::istream &)` | 
`public void `[`write_xml`](#d7/ddb/classalps_1_1_site_basis_descriptor_1af22f1c16a5e8a628dbb2808c08206388)`(oxstream &) const` | 
`public inline const std::string & `[`name`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a48bc272d638ca6bc277b502e12ca7831)`() const` | 
`public bool `[`valid`](#d7/ddb/classalps_1_1_site_basis_descriptor_1aae5e9b6443eef38df805d0326e4f3f7e)`(const std::vector< `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > > &) const` | 
`public inline std::size_t `[`num_states`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a958b14a15efd5da951e35d25ee7e754e)`() const` | 
`public bool `[`set_parameters`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a33e6b4f8337ac7398e21ab5dcdb7ceaa)`(const Parameters &,bool)` | 
`public inline const Parameters & `[`get_parameters`](#d7/ddb/classalps_1_1_site_basis_descriptor_1ac549d728f5d7b54d607ca8d94787c69c)`(bool all) const` | 
`public inline const operator_map & `[`operators`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a562f4ef5d04d015daa7501fbb6d9cc8f)`() const` | 
`public inline bool `[`has_operator`](#d7/ddb/classalps_1_1_site_basis_descriptor_1ae4b685c178daf95fb8eeadfe30ae11a3)`(const std::string & name) const` | 
`public template<>`  <br/>`boost::tuple< STATE, expression::Expression< T >, bool > `[`apply`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a632c4058ad622c6caddefc03497bf2c8)`(const std::string & name,STATE state,const expression::ParameterEvaluator< T > & eval,bool) const` | 
`public bool `[`is_fermionic`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a12b27af423ab464c46208bb5558a432f)`(const std::string & name) const` | 
`typedef `[`const_iterator`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a97142f2cd7bc675d18b2cbb4c8ff278a) | 
`typedef `[`iterator`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a8a026a7fabe51808cf6889ed20b3ae9a) | 
`typedef `[`operator_map`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a099857c1ab8cebdba1254ce75e2f1671) | 
`typedef `[`operator_iterator`](#d7/ddb/classalps_1_1_site_basis_descriptor_1ad8b19b49f42c43d208a7a9928d8f4fdb) | 

## Members

#### `public inline  `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a69ae168dd02a42cb4ed61d818478dcee)`()` 

#### `public inline  `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor_1aabdc9c07cf55822f438e2d5962b02c25)`(const std::string & name,const Parameters & parms,const operator_map & ops)` 

#### `public  `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a46f76f895644dfcf0573c0699454f503)`(const XMLTag &,std::istream &)` 

#### `public void `[`write_xml`](#d7/ddb/classalps_1_1_site_basis_descriptor_1af22f1c16a5e8a628dbb2808c08206388)`(oxstream &) const` 

#### `public inline const std::string & `[`name`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a48bc272d638ca6bc277b502e12ca7831)`() const` 

#### `public bool `[`valid`](#d7/ddb/classalps_1_1_site_basis_descriptor_1aae5e9b6443eef38df805d0326e4f3f7e)`(const std::vector< `[`half_integer`](#d8/d6f/classalps_1_1half__integer)`< I > > &) const` 

#### `public inline std::size_t `[`num_states`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a958b14a15efd5da951e35d25ee7e754e)`() const` 

#### `public bool `[`set_parameters`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a33e6b4f8337ac7398e21ab5dcdb7ceaa)`(const Parameters &,bool)` 

#### `public inline const Parameters & `[`get_parameters`](#d7/ddb/classalps_1_1_site_basis_descriptor_1ac549d728f5d7b54d607ca8d94787c69c)`(bool all) const` 

#### `public inline const operator_map & `[`operators`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a562f4ef5d04d015daa7501fbb6d9cc8f)`() const` 

#### `public inline bool `[`has_operator`](#d7/ddb/classalps_1_1_site_basis_descriptor_1ae4b685c178daf95fb8eeadfe30ae11a3)`(const std::string & name) const` 

#### `public template<>`  <br/>`boost::tuple< STATE, expression::Expression< T >, bool > `[`apply`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a632c4058ad622c6caddefc03497bf2c8)`(const std::string & name,STATE state,const expression::ParameterEvaluator< T > & eval,bool) const` 

#### `public bool `[`is_fermionic`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a12b27af423ab464c46208bb5558a432f)`(const std::string & name) const` 

#### `typedef `[`const_iterator`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a97142f2cd7bc675d18b2cbb4c8ff278a) 

#### `typedef `[`iterator`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a8a026a7fabe51808cf6889ed20b3ae9a) 

#### `typedef `[`operator_map`](#d7/ddb/classalps_1_1_site_basis_descriptor_1a099857c1ab8cebdba1254ce75e2f1671) 

#### `typedef `[`operator_iterator`](#d7/ddb/classalps_1_1_site_basis_descriptor_1ad8b19b49f42c43d208a7a9928d8f4fdb) 

# class `alps::SiteOperator` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator_1ac820ccd779e24e7a2d7574f0e1c50001)`()` | 
`public inline  `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator_1ab2504cdb0875aaacc770bd1362f09b56)`(const std::string & t,const std::string & s)` | 
`public inline  `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator_1a0210ee61caa566f5a5c916690c90e809)`(`[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` const & op,std::string const & t,Parameters const & p)` | 
`public inline  `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator_1ab837059c3ec186fb114fe35473dd0936)`(const std::string & t)` | 
`public inline  `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator_1ad8245c608e59d22260e11c94a588c2a7)`(const XMLTag & tag,std::istream & is)` | 
`public void `[`read_xml`](#d7/d82/classalps_1_1_site_operator_1a0d14d5de94b0b464143147646be4bb07)`(const XMLTag & tag,std::istream & is)` | 
`public void `[`write_xml`](#d7/d82/classalps_1_1_site_operator_1ad6675c4c1a2ce361e27b2e7c51795b64)`(oxstream &) const` | 
`public inline const std::string & `[`site`](#d7/d82/classalps_1_1_site_operator_1a83217cfb38ad953a845b003ca224d5c3)`() const` | 
`public inline std::string & `[`term`](#d7/d82/classalps_1_1_site_operator_1a6d371c1b94c49e8434fb2d64b3980591)`()` | 
`public inline const std::string & `[`term`](#d7/d82/classalps_1_1_site_operator_1ac15529a16aa4c3d022706f7738ef4544)`() const` | 
`public inline const std::string & `[`name`](#d7/d82/classalps_1_1_site_operator_1a26cbefd13fb23e41e1f7a50a92b67438)`() const` | 
`public template<>`  <br/>`multi_array< std::pair< T, bool >, 2 > `[`matrix`](#d7/d82/classalps_1_1_site_operator_1a0403219071349708074496f1d10260f5)`(const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > &,const Parameters & p) const` | 
`public void `[`substitute_operators`](#d7/d82/classalps_1_1_site_operator_1a022d2251c944f198694ca4e3bd868923)`(const `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library)` & m,const Parameters & p)` | 
`public std::set< std::string > `[`operator_names`](#d7/d82/classalps_1_1_site_operator_1ac17cca7a3f52f18e93011c03a38b6baf)`() const` | 
`public template<>`  <br/>`std::vector< boost::tuple< expression::Term< T >, `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` > > `[`templated_split`](#d7/d82/classalps_1_1_site_operator_1a59919114adb79d84f4d73ae585c143fd)`(const Parameters &) const` | 
`public inline std::vector< boost::tuple< Term, `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` > > `[`split`](#d7/d82/classalps_1_1_site_operator_1a9c78b241da9a2f94e45e57f763e341ce)`(const Parameters & p) const` | 
`public inline Parameters const & `[`parms`](#d7/d82/classalps_1_1_site_operator_1a98d66cb371fb2ef284cc52391e90a6cc)`() const` | 

## Members

#### `public inline  `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator_1ac820ccd779e24e7a2d7574f0e1c50001)`()` 

#### `public inline  `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator_1ab2504cdb0875aaacc770bd1362f09b56)`(const std::string & t,const std::string & s)` 

#### `public inline  `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator_1a0210ee61caa566f5a5c916690c90e809)`(`[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` const & op,std::string const & t,Parameters const & p)` 

#### `public inline  `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator_1ab837059c3ec186fb114fe35473dd0936)`(const std::string & t)` 

#### `public inline  `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator_1ad8245c608e59d22260e11c94a588c2a7)`(const XMLTag & tag,std::istream & is)` 

#### `public void `[`read_xml`](#d7/d82/classalps_1_1_site_operator_1a0d14d5de94b0b464143147646be4bb07)`(const XMLTag & tag,std::istream & is)` 

#### `public void `[`write_xml`](#d7/d82/classalps_1_1_site_operator_1ad6675c4c1a2ce361e27b2e7c51795b64)`(oxstream &) const` 

#### `public inline const std::string & `[`site`](#d7/d82/classalps_1_1_site_operator_1a83217cfb38ad953a845b003ca224d5c3)`() const` 

#### `public inline std::string & `[`term`](#d7/d82/classalps_1_1_site_operator_1a6d371c1b94c49e8434fb2d64b3980591)`()` 

#### `public inline const std::string & `[`term`](#d7/d82/classalps_1_1_site_operator_1ac15529a16aa4c3d022706f7738ef4544)`() const` 

#### `public inline const std::string & `[`name`](#d7/d82/classalps_1_1_site_operator_1a26cbefd13fb23e41e1f7a50a92b67438)`() const` 

#### `public template<>`  <br/>`multi_array< std::pair< T, bool >, 2 > `[`matrix`](#d7/d82/classalps_1_1_site_operator_1a0403219071349708074496f1d10260f5)`(const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > &,const Parameters & p) const` 

#### `public void `[`substitute_operators`](#d7/d82/classalps_1_1_site_operator_1a022d2251c944f198694ca4e3bd868923)`(const `[`ModelLibrary`](#d8/de2/classalps_1_1_model_library)` & m,const Parameters & p)` 

#### `public std::set< std::string > `[`operator_names`](#d7/d82/classalps_1_1_site_operator_1ac17cca7a3f52f18e93011c03a38b6baf)`() const` 

#### `public template<>`  <br/>`std::vector< boost::tuple< expression::Term< T >, `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` > > `[`templated_split`](#d7/d82/classalps_1_1_site_operator_1a59919114adb79d84f4d73ae585c143fd)`(const Parameters &) const` 

#### `public inline std::vector< boost::tuple< Term, `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` > > `[`split`](#d7/d82/classalps_1_1_site_operator_1a9c78b241da9a2f94e45e57f763e341ce)`(const Parameters & p) const` 

#### `public inline Parameters const & `[`parms`](#d7/d82/classalps_1_1_site_operator_1a98d66cb371fb2ef284cc52391e90a6cc)`() const` 

# class `alps::SiteOperatorEvaluator` 

```
class alps::SiteOperatorEvaluator
  : public alps::OperatorEvaluator< T >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`SiteOperatorEvaluator`](#d7/dd9/classalps_1_1_site_operator_evaluator_1acb37121ef61e2a7bb59ac1b641ad4c5e)`(const state_type & s,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b,const Parameters & p,const std::string sit)` | 
`public bool `[`can_evaluate`](#d7/dd9/classalps_1_1_site_operator_evaluator_1a7e9cf01c23a34cdcd4513ed74fba2075)`(const std::string &,bool) const` | 
`public bool `[`can_evaluate_function`](#d7/dd9/classalps_1_1_site_operator_evaluator_1a94edca5e94d2c4ac7d1f9f3b63bc409f)`(const std::string &,const expression::Expression< T > &,bool) const` | 
`public bool `[`can_evaluate_function`](#d7/dd9/classalps_1_1_site_operator_evaluator_1a19786613de96ee3d0671b4df1990b415)`(const std::string &,const std::vector< expression::Expression< T > > &,bool) const` | 
`public expression::Expression< T > `[`partial_evaluate`](#d7/dd9/classalps_1_1_site_operator_evaluator_1a10775848f068fe9b6bdc9653b82dd3a8)`(const std::string &,bool) const` | 
`public expression::Expression< T > `[`partial_evaluate_function`](#d7/dd9/classalps_1_1_site_operator_evaluator_1a7ec5aedbf8c53b2a90ffe84b9deb7205)`(const std::string &,const expression::Expression< T > &,bool) const` | 
`public expression::Expression< T > `[`partial_evaluate_function`](#d7/dd9/classalps_1_1_site_operator_evaluator_1af1b1c70cd0ba359a2c3ca3858e18d6b9)`(const std::string &,const std::vector< expression::Expression< T > > &,bool) const` | 
`public inline const state_type & `[`state`](#d7/dd9/classalps_1_1_site_operator_evaluator_1acb2f3ef0f51c5966760bac2078954ba3)`() const` | 
`public inline bool `[`fermionic`](#d7/dd9/classalps_1_1_site_operator_evaluator_1ade0d4b3a830674ac2febd62298ff809e)`() const` | 
`public inline const std::string & `[`site`](#d7/dd9/classalps_1_1_site_operator_evaluator_1a8ead1cb5c333f2f498246e26f40ef68b)`() const` | 
`public inline bool `[`has_operator`](#d7/dd9/classalps_1_1_site_operator_evaluator_1a053c5d494cad1643a9f1a5f3f3a1f8f0)`(const std::string & n) const` | 
`typedef `[`state_type`](#d7/dd9/classalps_1_1_site_operator_evaluator_1a1d91b71e190b4ab8883a0126e30d2e01) | 

## Members

#### `public inline  `[`SiteOperatorEvaluator`](#d7/dd9/classalps_1_1_site_operator_evaluator_1acb37121ef61e2a7bb59ac1b641ad4c5e)`(const state_type & s,const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b,const Parameters & p,const std::string sit)` 

#### `public bool `[`can_evaluate`](#d7/dd9/classalps_1_1_site_operator_evaluator_1a7e9cf01c23a34cdcd4513ed74fba2075)`(const std::string &,bool) const` 

#### `public bool `[`can_evaluate_function`](#d7/dd9/classalps_1_1_site_operator_evaluator_1a94edca5e94d2c4ac7d1f9f3b63bc409f)`(const std::string &,const expression::Expression< T > &,bool) const` 

#### `public bool `[`can_evaluate_function`](#d7/dd9/classalps_1_1_site_operator_evaluator_1a19786613de96ee3d0671b4df1990b415)`(const std::string &,const std::vector< expression::Expression< T > > &,bool) const` 

#### `public expression::Expression< T > `[`partial_evaluate`](#d7/dd9/classalps_1_1_site_operator_evaluator_1a10775848f068fe9b6bdc9653b82dd3a8)`(const std::string &,bool) const` 

#### `public expression::Expression< T > `[`partial_evaluate_function`](#d7/dd9/classalps_1_1_site_operator_evaluator_1a7ec5aedbf8c53b2a90ffe84b9deb7205)`(const std::string &,const expression::Expression< T > &,bool) const` 

#### `public expression::Expression< T > `[`partial_evaluate_function`](#d7/dd9/classalps_1_1_site_operator_evaluator_1af1b1c70cd0ba359a2c3ca3858e18d6b9)`(const std::string &,const std::vector< expression::Expression< T > > &,bool) const` 

#### `public inline const state_type & `[`state`](#d7/dd9/classalps_1_1_site_operator_evaluator_1acb2f3ef0f51c5966760bac2078954ba3)`() const` 

#### `public inline bool `[`fermionic`](#d7/dd9/classalps_1_1_site_operator_evaluator_1ade0d4b3a830674ac2febd62298ff809e)`() const` 

#### `public inline const std::string & `[`site`](#d7/dd9/classalps_1_1_site_operator_evaluator_1a8ead1cb5c333f2f498246e26f40ef68b)`() const` 

#### `public inline bool `[`has_operator`](#d7/dd9/classalps_1_1_site_operator_evaluator_1a053c5d494cad1643a9f1a5f3f3a1f8f0)`(const std::string & n) const` 

#### `typedef `[`state_type`](#d7/dd9/classalps_1_1_site_operator_evaluator_1a1d91b71e190b4ab8883a0126e30d2e01) 

# class `alps::SiteOperatorSplitter` 

```
class alps::SiteOperatorSplitter
  : public alps::OperatorEvaluator< std::complex< double > >
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`SiteOperatorSplitter`](#d7/d59/classalps_1_1_site_operator_splitter_1ad324606da21be488b5a4fff415544a19)`(const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b,const std::string & site,const Parameters & p)` | 
`public bool `[`can_evaluate_function`](#d7/d59/classalps_1_1_site_operator_splitter_1a21b1c53f48d331d745fe0565fa3d0b8a)`(const std::string & name,const expression::Expression< T > & argument,bool) const` | 
`public expression::Expression< T > `[`partial_evaluate_function`](#d7/d59/classalps_1_1_site_operator_splitter_1a1b126edf9ca6b87ec31afa21c71323f0)`(const std::string & name,const expression::Expression< T > & argument,bool) const` | 
`public inline const expression::Term< T > & `[`site_operators`](#d7/d59/classalps_1_1_site_operator_splitter_1a3ca50d56eabc216dd96093f0234b90b7)`() const` | 
`public inline bool `[`has_operator`](#d7/d59/classalps_1_1_site_operator_splitter_1ab5ed81e219ac67740fde0e5e0f999a70)`(const std::string & name,const expression::Expression< T > & arg) const` | 
`public inline expression::ParameterEvaluator< T >::Direction `[`direction`](#d7/d59/classalps_1_1_site_operator_splitter_1a3120273804758bff058179dcb22d9f66)`() const` | 

## Members

#### `public inline  `[`SiteOperatorSplitter`](#d7/d59/classalps_1_1_site_operator_splitter_1ad324606da21be488b5a4fff415544a19)`(const `[`SiteBasisDescriptor`](#d7/ddb/classalps_1_1_site_basis_descriptor)`< I > & b,const std::string & site,const Parameters & p)` 

#### `public bool `[`can_evaluate_function`](#d7/d59/classalps_1_1_site_operator_splitter_1a21b1c53f48d331d745fe0565fa3d0b8a)`(const std::string & name,const expression::Expression< T > & argument,bool) const` 

#### `public expression::Expression< T > `[`partial_evaluate_function`](#d7/d59/classalps_1_1_site_operator_splitter_1a1b126edf9ca6b87ec31afa21c71323f0)`(const std::string & name,const expression::Expression< T > & argument,bool) const` 

#### `public inline const expression::Term< T > & `[`site_operators`](#d7/d59/classalps_1_1_site_operator_splitter_1a3ca50d56eabc216dd96093f0234b90b7)`() const` 

#### `public inline bool `[`has_operator`](#d7/d59/classalps_1_1_site_operator_splitter_1ab5ed81e219ac67740fde0e5e0f999a70)`(const std::string & name,const expression::Expression< T > & arg) const` 

#### `public inline expression::ParameterEvaluator< T >::Direction `[`direction`](#d7/d59/classalps_1_1_site_operator_splitter_1a3120273804758bff058179dcb22d9f66)`() const` 

# class `alps::SiteTermDescriptor` 

```
class alps::SiteTermDescriptor
  : public alps::SiteOperator
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`SiteTermDescriptor`](#de/dbc/classalps_1_1_site_term_descriptor_1a8a1855d15a5c79d0ec053072c1fbae23)`()` | 
`public inline  `[`SiteTermDescriptor`](#de/dbc/classalps_1_1_site_term_descriptor_1a126da53cff11821be94d2e2c1f971385)`(const std::string & t,const std::string & s)` | 
`public  `[`SiteTermDescriptor`](#de/dbc/classalps_1_1_site_term_descriptor_1a417772e1751df362a5b5f2f2be8ec03a)`(const XMLTag &,std::istream &)` | 
`public inline  `[`SiteTermDescriptor`](#de/dbc/classalps_1_1_site_term_descriptor_1afe1e45827071f30c818236969f51a482)`(`[`SiteTermDescriptor`](#de/dbc/classalps_1_1_site_term_descriptor)` const & t,std::string const & term,Parameters const & p,unsigned int type)` | 
`public void `[`write_xml`](#de/dbc/classalps_1_1_site_term_descriptor_1a9032307239c578bfbb2a8f33a756961e)`(oxstream &) const` | 
`public inline const `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & `[`site_operator`](#de/dbc/classalps_1_1_site_term_descriptor_1af469dde30ef4863121f648c7ce30c4c9)`() const` | 
`public inline bool `[`match_type`](#de/dbc/classalps_1_1_site_term_descriptor_1a29c491a5d395925ec83babc6e89e418a)`(int type) const` | 
`typedef `[`super_type`](#de/dbc/classalps_1_1_site_term_descriptor_1ae15f9c1dfdf422b6f224835cbe773c8b) | 

## Members

#### `public inline  `[`SiteTermDescriptor`](#de/dbc/classalps_1_1_site_term_descriptor_1a8a1855d15a5c79d0ec053072c1fbae23)`()` 

#### `public inline  `[`SiteTermDescriptor`](#de/dbc/classalps_1_1_site_term_descriptor_1a126da53cff11821be94d2e2c1f971385)`(const std::string & t,const std::string & s)` 

#### `public  `[`SiteTermDescriptor`](#de/dbc/classalps_1_1_site_term_descriptor_1a417772e1751df362a5b5f2f2be8ec03a)`(const XMLTag &,std::istream &)` 

#### `public inline  `[`SiteTermDescriptor`](#de/dbc/classalps_1_1_site_term_descriptor_1afe1e45827071f30c818236969f51a482)`(`[`SiteTermDescriptor`](#de/dbc/classalps_1_1_site_term_descriptor)` const & t,std::string const & term,Parameters const & p,unsigned int type)` 

#### `public void `[`write_xml`](#de/dbc/classalps_1_1_site_term_descriptor_1a9032307239c578bfbb2a8f33a756961e)`(oxstream &) const` 

#### `public inline const `[`SiteOperator`](#d7/d82/classalps_1_1_site_operator)` & `[`site_operator`](#de/dbc/classalps_1_1_site_term_descriptor_1af469dde30ef4863121f648c7ce30c4c9)`() const` 

#### `public inline bool `[`match_type`](#de/dbc/classalps_1_1_site_term_descriptor_1a29c491a5d395925ec83babc6e89e418a)`(int type) const` 

#### `typedef `[`super_type`](#de/dbc/classalps_1_1_site_term_descriptor_1ae15f9c1dfdf422b6f224835cbe773c8b) 

# struct `alps::nonzero_edge_weight` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public EdgeWeightMap `[`m_weight`](#d6/d87/structalps_1_1nonzero__edge__weight_1a351e17f461857f19a704d22119f3b74e) | 
`public inline  `[`nonzero_edge_weight`](#d6/d87/structalps_1_1nonzero__edge__weight_1a00431a2b6c1ed1292e629f3209c7dafc)`()` | 
`public inline  `[`nonzero_edge_weight`](#d6/d87/structalps_1_1nonzero__edge__weight_1a9d7c9d924b50d4284d61e7e09834b137)`(EdgeWeightMap weight)` | 
`public template<>`  <br/>`inline bool `[`operator()`](#d6/d87/structalps_1_1nonzero__edge__weight_1a02c4bee338eaf7ed47b3e758e6b2f991)`(const Edge & e) const` | 

## Members

#### `public EdgeWeightMap `[`m_weight`](#d6/d87/structalps_1_1nonzero__edge__weight_1a351e17f461857f19a704d22119f3b74e) 

#### `public inline  `[`nonzero_edge_weight`](#d6/d87/structalps_1_1nonzero__edge__weight_1a00431a2b6c1ed1292e629f3209c7dafc)`()` 

#### `public inline  `[`nonzero_edge_weight`](#d6/d87/structalps_1_1nonzero__edge__weight_1a9d7c9d924b50d4284d61e7e09834b137)`(EdgeWeightMap weight)` 

#### `public template<>`  <br/>`inline bool `[`operator()`](#d6/d87/structalps_1_1nonzero__edge__weight_1a02c4bee338eaf7ed47b3e758e6b2f991)`(const Edge & e) const` 

# namespace `alps::detail` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public template<>`  <br/>`Matrix `[`initialized_matrix`](#de/d40/hamiltonian__matrix_8hpp_1aa76e50716ad80a6708d409a34bba472d)`(Matrix const &,std::size_t const rows,std::size_t const cols)`            | 
`public template<>`  <br/>[`alps::numeric::matrix`](#dd/d21/classalps_1_1numeric_1_1matrix)`< T, MemoryBlock > `[`initialized_matrix`](#de/d40/hamiltonian__matrix_8hpp_1a3bcd872aae367ffd9ee9966a898d1276)`(`[`alps::numeric::matrix`](#dd/d21/classalps_1_1numeric_1_1matrix)`< T, MemoryBlock > const &,std::size_t const rows,std::size_t const cols)`            | 
`public template<>`  <br/>[`BondSignVisitor`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor)`< Graph, PropertyMap, BondPropertyMap > `[`make_sign_visitor`](#d3/dcd/sign_8h_1ac9a0b9000397dede18e236cc02a673ef)`(const Graph &,PropertyMap & map,bool * check,BondPropertyMap bond_sign)`            | 
`public template<>`  <br/>[`BondSiteSignVisitor`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor)`< Graph, PropertyMap, BondPropertyMap, SitePropertyMap > `[`make_sign_visitor`](#d3/dcd/sign_8h_1a142e077bc3152f9141758248a12f3ee8)`(const Graph &,PropertyMap & map,bool * check,BondPropertyMap bond_sign,SitePropertyMap site_sign)`            | 
`class `[`alps::detail::BondMap`](#dc/d4d/classalps_1_1detail_1_1_bond_map) | 
`class `[`alps::detail::BondSignVisitor`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor) | 
`class `[`alps::detail::BondSiteSignVisitor`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor) | 
`class `[`alps::detail::SiteMap`](#db/d0c/classalps_1_1detail_1_1_site_map) | 

## Members

#### `public template<>`  <br/>`Matrix `[`initialized_matrix`](#de/d40/hamiltonian__matrix_8hpp_1aa76e50716ad80a6708d409a34bba472d)`(Matrix const &,std::size_t const rows,std::size_t const cols)` 

#### `public template<>`  <br/>[`alps::numeric::matrix`](#dd/d21/classalps_1_1numeric_1_1matrix)`< T, MemoryBlock > `[`initialized_matrix`](#de/d40/hamiltonian__matrix_8hpp_1a3bcd872aae367ffd9ee9966a898d1276)`(`[`alps::numeric::matrix`](#dd/d21/classalps_1_1numeric_1_1matrix)`< T, MemoryBlock > const &,std::size_t const rows,std::size_t const cols)` 

#### `public template<>`  <br/>[`BondSignVisitor`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor)`< Graph, PropertyMap, BondPropertyMap > `[`make_sign_visitor`](#d3/dcd/sign_8h_1ac9a0b9000397dede18e236cc02a673ef)`(const Graph &,PropertyMap & map,bool * check,BondPropertyMap bond_sign)` 

#### `public template<>`  <br/>[`BondSiteSignVisitor`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor)`< Graph, PropertyMap, BondPropertyMap, SitePropertyMap > `[`make_sign_visitor`](#d3/dcd/sign_8h_1a142e077bc3152f9141758248a12f3ee8)`(const Graph &,PropertyMap & map,bool * check,BondPropertyMap bond_sign,SitePropertyMap site_sign)` 

# class `alps::detail::BondMap` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`BondMap`](#dc/d4d/classalps_1_1detail_1_1_bond_map_1a92d26f19d9d35faedccd78e1abc433e0)`()` | 
`public inline  `[`BondMap`](#dc/d4d/classalps_1_1detail_1_1_bond_map_1a12a0ec51b80ba73f536a4a8883cfcfb2)`(const map_type & map,const graph_type & graph)` | 
`public template<>`  <br/>`inline int `[`operator[]`](#dc/d4d/classalps_1_1detail_1_1_bond_map_1a7884a44a09b9df45c92cb8e372937719)`(const E & e) const` | 
`typedef `[`graph_type`](#dc/d4d/classalps_1_1detail_1_1_bond_map_1adab8ba110c83e380ce07bfe0b3a2994b) | 
`typedef `[`map_type`](#dc/d4d/classalps_1_1detail_1_1_bond_map_1ac95a7699d76b5baea50e401bb153362c) | 

## Members

#### `public inline  `[`BondMap`](#dc/d4d/classalps_1_1detail_1_1_bond_map_1a92d26f19d9d35faedccd78e1abc433e0)`()` 

#### `public inline  `[`BondMap`](#dc/d4d/classalps_1_1detail_1_1_bond_map_1a12a0ec51b80ba73f536a4a8883cfcfb2)`(const map_type & map,const graph_type & graph)` 

#### `public template<>`  <br/>`inline int `[`operator[]`](#dc/d4d/classalps_1_1detail_1_1_bond_map_1a7884a44a09b9df45c92cb8e372937719)`(const E & e) const` 

#### `typedef `[`graph_type`](#dc/d4d/classalps_1_1detail_1_1_bond_map_1adab8ba110c83e380ce07bfe0b3a2994b) 

#### `typedef `[`map_type`](#dc/d4d/classalps_1_1detail_1_1_bond_map_1ac95a7699d76b5baea50e401bb153362c) 

# class `alps::detail::BondSignVisitor` 

```
class alps::detail::BondSignVisitor
  : public boost::dfs_visitor<>
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`BondSignVisitor`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor_1ac8c235ec316fc6d0cbe426254c24e1a1)`()` | 
`public inline  `[`BondSignVisitor`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor_1ab77a00a15f00009bbf4343ff9f1a8501)`(PropertyMap & map,bool * check,BondPropertyMap bond_sign)` | 
`public inline void `[`initialize_vertex`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor_1a2152be42155293a9c97532a687accad2)`(vertex_descriptor s,const Graph &)` | 
`public inline void `[`start_vertex`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor_1a15727f371d7449ed0a5bb897cd3b37a6)`(vertex_descriptor s,const Graph &)` | 
`public inline void `[`tree_edge`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor_1acd04d304898e0657c36ef81329310379)`(edge_descriptor e,const Graph & g)` | 
`public inline void `[`back_edge`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor_1af3f55b228391750d1e13347ebfbc5746)`(edge_descriptor e,const Graph & g)` | 
`typedef `[`vertex_descriptor`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor_1a08e26eb1f20afbc6d798e688246aafdb) | 
`typedef `[`edge_descriptor`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor_1a721cd1cb41fe7527642d334b4d94702c) | 

## Members

#### `public inline  `[`BondSignVisitor`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor_1ac8c235ec316fc6d0cbe426254c24e1a1)`()` 

#### `public inline  `[`BondSignVisitor`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor_1ab77a00a15f00009bbf4343ff9f1a8501)`(PropertyMap & map,bool * check,BondPropertyMap bond_sign)` 

#### `public inline void `[`initialize_vertex`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor_1a2152be42155293a9c97532a687accad2)`(vertex_descriptor s,const Graph &)` 

#### `public inline void `[`start_vertex`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor_1a15727f371d7449ed0a5bb897cd3b37a6)`(vertex_descriptor s,const Graph &)` 

#### `public inline void `[`tree_edge`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor_1acd04d304898e0657c36ef81329310379)`(edge_descriptor e,const Graph & g)` 

#### `public inline void `[`back_edge`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor_1af3f55b228391750d1e13347ebfbc5746)`(edge_descriptor e,const Graph & g)` 

#### `typedef `[`vertex_descriptor`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor_1a08e26eb1f20afbc6d798e688246aafdb) 

#### `typedef `[`edge_descriptor`](#d3/d99/classalps_1_1detail_1_1_bond_sign_visitor_1a721cd1cb41fe7527642d334b4d94702c) 

# class `alps::detail::BondSiteSignVisitor` 

```
class alps::detail::BondSiteSignVisitor
  : public boost::dfs_visitor<>
```  

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`BondSiteSignVisitor`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor_1a6c72f288ce8b8f7eecfe3366aa357657)`()` | 
`public inline  `[`BondSiteSignVisitor`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor_1a03268c946976429fd95ef970e7e97d77)`(PropertyMap & map,bool * check,BondPropertyMap bond_sign,SitePropertyMap site_sign)` | 
`public inline void `[`initialize_vertex`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor_1a507f63c6e74847144fc349bf9dd90ba0)`(vertex_descriptor s,const Graph &)` | 
`public inline void `[`start_vertex`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor_1a8a352ecb1a855c697b9af1dd4070e24f)`(vertex_descriptor s,const Graph &)` | 
`public inline void `[`tree_edge`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor_1a1cac3533dd05ba1c88398103bab2ba5f)`(edge_descriptor e,const Graph & g)` | 
`public inline void `[`back_edge`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor_1ac7f9cb23bfcd9d31355eed19763620ea)`(edge_descriptor e,const Graph & g)` | 
`typedef `[`vertex_descriptor`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor_1a5e42a60e6023d621c2a0e0adb5c25a67) | 
`typedef `[`edge_descriptor`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor_1a4e9323c714e5e4c670dba1f780841261) | 

## Members

#### `public inline  `[`BondSiteSignVisitor`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor_1a6c72f288ce8b8f7eecfe3366aa357657)`()` 

#### `public inline  `[`BondSiteSignVisitor`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor_1a03268c946976429fd95ef970e7e97d77)`(PropertyMap & map,bool * check,BondPropertyMap bond_sign,SitePropertyMap site_sign)` 

#### `public inline void `[`initialize_vertex`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor_1a507f63c6e74847144fc349bf9dd90ba0)`(vertex_descriptor s,const Graph &)` 

#### `public inline void `[`start_vertex`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor_1a8a352ecb1a855c697b9af1dd4070e24f)`(vertex_descriptor s,const Graph &)` 

#### `public inline void `[`tree_edge`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor_1a1cac3533dd05ba1c88398103bab2ba5f)`(edge_descriptor e,const Graph & g)` 

#### `public inline void `[`back_edge`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor_1ac7f9cb23bfcd9d31355eed19763620ea)`(edge_descriptor e,const Graph & g)` 

#### `typedef `[`vertex_descriptor`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor_1a5e42a60e6023d621c2a0e0adb5c25a67) 

#### `typedef `[`edge_descriptor`](#d3/d19/classalps_1_1detail_1_1_bond_site_sign_visitor_1a4e9323c714e5e4c670dba1f780841261) 

# class `alps::detail::SiteMap` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`SiteMap`](#db/d0c/classalps_1_1detail_1_1_site_map_1af688182dbb1d615889fe320b7f3a794a)`()` | 
`public inline  `[`SiteMap`](#db/d0c/classalps_1_1detail_1_1_site_map_1a8f8701c9e45960443783e6857fdd976a)`(const map_type & map,const graph_type & graph)` | 
`public template<>`  <br/>`inline int `[`operator[]`](#db/d0c/classalps_1_1detail_1_1_site_map_1a1a8850ce35a5b9f8673ea184112c1dab)`(const V & v) const` | 
`typedef `[`graph_type`](#db/d0c/classalps_1_1detail_1_1_site_map_1a495aa95215a48da13cde71ad5f1c673d) | 
`typedef `[`map_type`](#db/d0c/classalps_1_1detail_1_1_site_map_1a1b54ff095f837186d4f998e1ad4e0a68) | 

## Members

#### `public inline  `[`SiteMap`](#db/d0c/classalps_1_1detail_1_1_site_map_1af688182dbb1d615889fe320b7f3a794a)`()` 

#### `public inline  `[`SiteMap`](#db/d0c/classalps_1_1detail_1_1_site_map_1a8f8701c9e45960443783e6857fdd976a)`(const map_type & map,const graph_type & graph)` 

#### `public template<>`  <br/>`inline int `[`operator[]`](#db/d0c/classalps_1_1detail_1_1_site_map_1a1a8850ce35a5b9f8673ea184112c1dab)`(const V & v) const` 

#### `typedef `[`graph_type`](#db/d0c/classalps_1_1detail_1_1_site_map_1a495aa95215a48da13cde71ad5f1c673d) 

#### `typedef `[`map_type`](#db/d0c/classalps_1_1detail_1_1_site_map_1a1b54ff095f837186d4f998e1ad4e0a68) 

# namespace `alps::numeric` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`class `[`alps::numeric::matrix`](#dd/d21/classalps_1_1numeric_1_1matrix) | 

# class `alps::numeric::matrix` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------

## Members

# class `alps::integer_state::reference` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`reference`](#d1/da3/classalps_1_1integer__state_1_1reference_1ace409c44602646c1cc43a1d35d47af8c)`(I & s,int i)` | 
`public inline  `[`operator int`](#d1/da3/classalps_1_1integer__state_1_1reference_1a9e4b9cea3d7c18f8b1dd7c1f21e63e67)`() const` | 
`public template<>`  <br/>`inline `[`reference`](#d1/da3/classalps_1_1integer__state_1_1reference)` & `[`operator=`](#d1/da3/classalps_1_1integer__state_1_1reference_1a8987d9735ce3050a45fcea87a05dc0e7)`(T x)` | 

## Members

#### `public inline  `[`reference`](#d1/da3/classalps_1_1integer__state_1_1reference_1ace409c44602646c1cc43a1d35d47af8c)`(I & s,int i)` 

#### `public inline  `[`operator int`](#d1/da3/classalps_1_1integer__state_1_1reference_1a9e4b9cea3d7c18f8b1dd7c1f21e63e67)`() const` 

#### `public template<>`  <br/>`inline `[`reference`](#d1/da3/classalps_1_1integer__state_1_1reference)` & `[`operator=`](#d1/da3/classalps_1_1integer__state_1_1reference_1a8987d9735ce3050a45fcea87a05dc0e7)`(T x)` 

# class `alps::integer_state< I, 1 >::reference` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  `[`reference`](#d4/d7a/classalps_1_1integer__state_3_01_i_00_011_01_4_1_1reference_1abf26df928675f6a1808a1b143e93e3bc)`(I & s,int i)` | 
`public inline  `[`operator int`](#d4/d7a/classalps_1_1integer__state_3_01_i_00_011_01_4_1_1reference_1a256156eeb38a97fb12503b7a83269350)`() const` | 
`public template<>`  <br/>`inline `[`reference`](#d4/d7a/classalps_1_1integer__state_3_01_i_00_011_01_4_1_1reference)` & `[`operator=`](#d4/d7a/classalps_1_1integer__state_3_01_i_00_011_01_4_1_1reference_1a3b6a15b264870c7ff7b1038bc28f33cd)`(T x)` | 

## Members

#### `public inline  `[`reference`](#d4/d7a/classalps_1_1integer__state_3_01_i_00_011_01_4_1_1reference_1abf26df928675f6a1808a1b143e93e3bc)`(I & s,int i)` 

#### `public inline  `[`operator int`](#d4/d7a/classalps_1_1integer__state_3_01_i_00_011_01_4_1_1reference_1a256156eeb38a97fb12503b7a83269350)`() const` 

#### `public template<>`  <br/>`inline `[`reference`](#d4/d7a/classalps_1_1integer__state_3_01_i_00_011_01_4_1_1reference)` & `[`operator=`](#d4/d7a/classalps_1_1integer__state_3_01_i_00_011_01_4_1_1reference_1a3b6a15b264870c7ff7b1038bc28f33cd)`(T x)` 

# struct `alps::half_integer::to_distinguish` 

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------

## Members

Generated by [Moxygen](https://sourcey.com/moxygen)
