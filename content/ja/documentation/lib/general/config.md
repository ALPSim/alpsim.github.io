
---
title: alps/config.h
description: "ALPS General Library"
weight: 2
---

Header `alps/config.h` contains configuration options determined by the ALPS configure script. In addition please see the [Boost]() configuration macros.

Note that this header file should be included *before* any Boost header files.

## Macros

**Table 2.1. macros defined/undefined in `alps/config.h`**


| **Name** | **Description** |
| :------- | :-------------- |
| ALPS_WITHOUT_XML | defined if ALPS was build without ALPS/xml library |
| ALPS_WITHOUT_OSIRIS | defined if ALPS was build without ALPS/osiris library |
| ALPS_WITHOUT_ALEA | defined if ALPS was build without ALPS/alea library |
| ALPS_WITHOUT_LATTICE | defined if ALPS was build without ALPS/lattice library |
| ALPS_WITHOUT_SCHEDULER | defined if ALPS was build without ALPS/scheduler library |
| ALPS_HAVE_UNISTD_H | defined if the header <unistd.h> exists |
| ALPS_HAVE_SYS_SYSTEMINFO_H | defined if the header <sys/systeminfo.h> exists |
| ALPS_HAVE_SYS_TIME_H |defined if the header <sys/time.h> exists |
| ALPS_HAVE_SYS_TYPES_H | defined if the header <sys/types.h> exists |
| ALPS_HAVE_INTTYPES_H | defined if the header <inttypes.h> exists |
| ALPS_HAVE_BIND_BITYPES_H | defined if the header <bind/bitypes.h> exists
| ALPS_HAVE_SYS_INT_TYPES_H | defined if the header <sys/int_types.h> exists |
| ALPS_HAS_INT64 | defined if 64 bit integer types exist |
| ALPS_HAVE_VALARRAY | defined if the std::valarray class exists |
| ALPS_HAVE_MPI | defined if an MPI library exists and was specified in the configuration step.|
| ALPS_HAVE_HDF5 | defined if the HDF5 library exists and was specified in the configuration step.|
| ALPS_HAVE_PTHREAD | defined if the pthread library exists and was specified in the configuration step. |
| ALPS_HAVE_EXPAT | defined if the expat XML parser exists and was specified in the configuration step. |
| ALPS_HAVE_XERCES | defined if the Xerces XML parser exists and was specified in the configuration step. |


## Types

The header has to include the system headers defining the types

- `int8_t`
- `uint8_t`
- `int16_t`
- `uint16_t`
- `int32_t`
- `uint32_t`

In addition, if ALPS_NO_INT64 is not defined it also has to include definitions for the types

- `int64_t`
- ==`uint64_t`=
