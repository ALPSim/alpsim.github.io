
---
title: Ejemplos
description: "Ejemplos de Uso de la Biblioteca hdf5"
weight: 2
---

### escribir un escalar en hdf5

    alps::hdf5::oarchive ar("data.h5");
    ar << alps::make_pvp("/value", 42);

### leer un escalar desde hdf5

    alps::hdf5::iarchive ar("data.h5");
    int i;
    ar >> alps::make_pvp("/value", i);

### leer un escalar como cadena

    alps::hdf5::iarchive ar("bela.h5");
    std::string s;
    ar >> alps::make_pvp("/value", s);

### escribir un std::vector en hdf5

    alps::hdf5::oarchive ar("data.h5");
    std::vector<double> vec(5, 42);
    ar << alps::make_pvp("/path/2/vec", vec);

### leer un std::vector desde hdf5

    std::vector<double> vec;
    // fill the vector
    alps::hdf5::iarchive ar("data.h5");
    ar >> alps::make_pvp("/path/2/vec", vec);

### escribir una cadena en hdf5

    std::string str("foobar");
    alps::hdf5::oarchive ar("data.h5");
    h5ar << alps::make_pvp("/foo/bar", str);

### leer una cadena desde hdf5

    alps::hdf5::iarchive ar("data.h5");
    std::string str;
    ar >> alps::make_pvp("/foo/bar", s);

### escribir un arreglo de C en hdf5

    long \*d = new int[17];
    // fill the array
    alps::hdf5::oarchive ar("data.h5");
    ar << alps::make_pvp("/c/array", d, 17);
    delete[] d;

### leer un arreglo de C desde hdf5

    alps::hdf5::iarchive ar("data.h5");
    std::size_t size = ar.extends("/c/array")[0];
    long \*d = new long[size];
    ar >> alps::make_pvp("/c/array", d, size);
    delete[] d;

### escribir / leer una clase hacia / desde hdf5 (si la ruta dentro de una clase no comienza con "/", se toma como una ruta relativa. p. ej. d se guardará en "/my/class/value")

    class my_class {
        public:
            my_class(double v = 0): d(v) {}
            double get_value() { return d; }
            void serialize(hdf5::iarchive & ar) { ar >> make_pvp("value", d); }
            void serialize(hdf5::oarchive & ar) const { ar << make_pvp("value", d); }
        private:
            double d;
        };
    main(...) {
        {
            my_class c(42);
            alps::hdf5::oarchive ar("data.h5");
            ar << alps::make_pvp("/my/class", c);
        }
        {
            my_class c();
            alps::hdf5::iarchive ar("data.h5");
            ar >> alps::make_pvp("/my/class", c);
        }
        
### escribir / leer un tipo personalizado hacia / desde hdf5

        typedef enum { A = 13, B = 23 } enum_type;
        namespace alps {
            namespace hdf5 {
                template <> oarchive & serialize(oarchive & ar, std::string const & p, enum_type const & v) {
                    ar << alps::make_pvp(p, int(v));
                    return ar;
            }
            template <> iarchive & serialize(iarchive & ar, std::string const & p, enum_type & v) {
                int tmp;
                ar >> alps::make_pvp(p, tmp);
                switch (tmp) {
                    case 13: v = A; break;
                    case 23: v = B; break;
                }
                return ar;
            }
        }
    }
    int main() {
        {
            enum_type e = A;
            alps::hdf5::oarchive ar("data.h5");
            ar << alps::make_pvp("/my/enum", e);
        }
        {
        alps::hdf5::iarchive ar("data.h5");
            enum_type e;
            ar >> alps::make_pvp("/my/enum", e);
        }
    }

### escribir un atributo en hdf5 (un atributo solo puede ser de tipo escalar o cadena)

    alps::hdf5::oarchive ar("data.h5");
    // the parent of an attribute must exist
    ar.serialize("/foo");
    ar << alps::make_pvp("/foo/@bar", std::string("hello"));

### leer un atributo desde hdf5

    alps::hdf5::iarchive ar("data.h5");
    std::string s;
    ar >> alps::make_pvp("/foo/@bar", s);
