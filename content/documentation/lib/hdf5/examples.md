
---
title: Examples
description: "Examples of Using hdf5 Library"
weight: 2
---

### write a scalar to hdf5

    alps::hdf5::oarchive ar("data.h5");
    ar << alps::make_pvp("/value", 42);

### read a scalar from hdf5

    alps::hdf5::iarchive ar("data.h5");
    int i;
    ar >> alps::make_pvp("/value", i);

### read a scalar as string

    alps::hdf5::iarchive ar("bela.h5");
    std::string s;
    ar >> alps::make_pvp("/value", s);

### write a std::vector to hdf5

    alps::hdf5::oarchive ar("data.h5");
    std::vector<double> vec(5, 42);
    ar << alps::make_pvp("/path/2/vec", vec);

### read a std::vector from hdf5

    std::vector<double> vec;
    // fill the vector
    alps::hdf5::iarchive ar("data.h5");
    ar >> alps::make_pvp("/path/2/vec", vec);

### write a string to hdf5

    std::string str("foobar");
    alps::hdf5::oarchive ar("data.h5");
    h5ar << alps::make_pvp("/foo/bar", str);

### read a string form hdf5

    alps::hdf5::iarchive ar("data.h5");
    std::string str;
    ar >> alps::make_pvp("/foo/bar", s);

### write a c-array to hdf5

    long \*d = new int[17];
    // fill the array
    alps::hdf5::oarchive ar("data.h5");
    ar << alps::make_pvp("/c/array", d, 17);
    delete[] d;

### read a c-array from hdf5

    alps::hdf5::iarchive ar("data.h5");
    std::size_t size = ar.extends("/c/array")[0];
    long \*d = new long[size];
    ar >> alps::make_pvp("/c/array", d, size);
    delete[] d;

### write / read a class to / from hdf5 (if the path inside a class does not start with "/", it is taken as a relative path. e.g d will be saved to "/my/class/value")

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
        
### write / read an custom type to / from hdf5

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

### write an attribute to hdf5 (an attributes can only be scalar type or string)

    alps::hdf5::oarchive ar("data.h5");
    // the parent of an attribute must exist
    ar.serialize("/foo");
    ar << alps::make_pvp("/foo/@bar", std::string("hello"));

### read an attribute from hdf5

    alps::hdf5::iarchive ar("data.h5");
    std::string s;
    ar >> alps::make_pvp("/foo/@bar", s);
