
---
title: alps/config.h
description: "Biblioteca General de ALPS"
weight: 2
---

La cabecera `alps/config.h` contiene opciones de configuración determinadas por el script de configuración de ALPS. Además, consulte las macros de configuración de [Boost]().

Tenga en cuenta que este archivo de cabecera debe incluirse *antes* que cualquier archivo de cabecera de Boost.

## Macros

**Tabla 2.1. macros definidas/no definidas en `alps/config.h`**


| **Nombre** | **Descripción** |
| :------- | :-------------- |
| ALPS_WITHOUT_XML | definida si ALPS fue compilado sin la biblioteca ALPS/xml |
| ALPS_WITHOUT_OSIRIS | definida si ALPS fue compilado sin la biblioteca ALPS/osiris |
| ALPS_WITHOUT_ALEA | definida si ALPS fue compilado sin la biblioteca ALPS/alea |
| ALPS_WITHOUT_LATTICE | definida si ALPS fue compilado sin la biblioteca ALPS/lattice |
| ALPS_WITHOUT_SCHEDULER | definida si ALPS fue compilado sin la biblioteca ALPS/scheduler |
| ALPS_HAVE_UNISTD_H | definida si existe la cabecera <unistd.h> |
| ALPS_HAVE_SYS_SYSTEMINFO_H | definida si existe la cabecera <sys/systeminfo.h> |
| ALPS_HAVE_SYS_TIME_H |definida si existe la cabecera <sys/time.h> |
| ALPS_HAVE_SYS_TYPES_H | definida si existe la cabecera <sys/types.h> |
| ALPS_HAVE_INTTYPES_H | definida si existe la cabecera <inttypes.h> |
| ALPS_HAVE_BIND_BITYPES_H | definida si existe la cabecera <bind/bitypes.h>
| ALPS_HAVE_SYS_INT_TYPES_H | definida si existe la cabecera <sys/int_types.h> |
| ALPS_HAS_INT64 | definida si existen tipos enteros de 64 bits |
| ALPS_HAVE_VALARRAY | definida si existe la clase std::valarray |
| ALPS_HAVE_MPI | definida si existe una biblioteca MPI y fue especificada en el paso de configuración.|
| ALPS_HAVE_HDF5 | definida si existe la biblioteca HDF5 y fue especificada en el paso de configuración.|
| ALPS_HAVE_PTHREAD | definida si existe la biblioteca pthread y fue especificada en el paso de configuración. |
| ALPS_HAVE_EXPAT | definida si existe el analizador XML expat y fue especificado en el paso de configuración. |
| ALPS_HAVE_XERCES | definida si existe el analizador XML Xerces y fue especificado en el paso de configuración. |


## Tipos

La cabecera debe incluir las cabeceras del sistema que definen los tipos

- `int8_t`
- `uint8_t`
- `int16_t`
- `uint16_t`
- `int32_t`
- `uint32_t`

Además, si ALPS_NO_INT64 no está definida también debe incluir definiciones para los tipos

- `int64_t`
- ==`uint64_t`=
