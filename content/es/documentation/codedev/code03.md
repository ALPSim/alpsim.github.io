
---
title: Code-03 MonteCarloHOWTO
math: true
toc: true
weight: 4
---

## Introducción

Aunque ya hay disponibles varios programas Monte Carlo (MC) en las aplicaciones de ALPS, el propósito principal de ALPS es ayudar a los desarrolladores a programar su propio programa MC de la manera más fácil y rápida posible. Hay varias tareas comunes que realizan todos los algoritmos MC y que no necesitan reprogramarse cada vez. El objetivo de este artículo es demostrar que las bibliotecas de ALPS proponen un marco sencillo para hacerlo, y mostrar con ejemplos cómo usarlas. Esto incluye tanto Monte Carlo clásico como algoritmos de Monte Carlo cuántico.
El directorio `example/scheduler` en las fuentes de ALPS contiene un código de simulación de ejemplo para el modelo de Ising que puede adaptarse a tus necesidades. A continuación analizaremos estos ejemplos.

### ¿Cuáles son las ventajas de las bibliotecas de ALPS frente a herramientas propias para desarrollar una nueva aplicación MC?

- Cálculo automático de barras de error y tiempos de autocorrelación
- Paralelización automática
- Salida automática de resultados (en XML) con las herramientas de extracción correspondientes
- Gestión automática del signo (para simulaciones de Monte Carlo cuántico con problema de signo)
- Fácil creación de puntos de control (checkpointing) y fácil reinicio de simulaciones
- Fácil gestión de parámetros de entrada
- Forma sencilla de añadir nuevas mediciones
- Fácil gestión de números aleatorios
- (Opcional) Fácil gestión de redes (lattices)
- (Opcional) Fácil gestión de hamiltonianos cuánticos (para Monte Carlo cuántico)
- ...

Todo esto se logra con solo una pequeña cantidad de programación/modificación, que describimos a continuación.

## Iniciando tu propio programa MC de ALPS

**Trabajo en progreso... El tutorial no está terminado ni corregido... Por favor, envíame cualquier comentario/sugerencia sobre esta página**

Ante todo, usar las bibliotecas de ALPS implica que uses C++ como lenguaje de programación. A partir de ahora, supongamos que quieres programar una nueva aplicación MC y que ya sabes cuál será tu estructura de datos interna y el algoritmo que usarás para un único paso de Monte Carlo.
Para usar las bibliotecas de ALPS, necesitarás crear tu propia clase C++, derivada de una clase interna de ALPS. Llamemos a esta clase `MyMonteCarlo` y creemos un archivo de cabecera `MyMonteCarlo.hpp`.

    #ifndef MYMC_HPP
    #define MYMC_HPP
    #include <alps/scheduler.h>
    #include <alps/alea.h>
    #include <alps/scheduler/montecarlo.h>
    #include <alps/osiris.h>
    #include <alps/osiris/dump.h>
    #include <alps/expression.h>
    using namespace std;
    class MyMonteCarlo : public alps::scheduler::MCRun{
    public :
        MyMonteCarlo(const alps::ProcessList &,const alps::Parameters &,int);
        static void print_copyright(std::ostream &);
        void save(alps::ODump &) const;
        void load(alps::IDump &);
        void dostep();
        bool is_thermalized() const;
        double work_done() const;
    private :
        // your own internal data here ...
    };
    #endif

Veamos ahora qué significan todas estas líneas.
- Ante todo, necesitas incluir algunas cabeceras de ALPS (más adelante se añadirán algunas más para otras funcionalidades de ALPS).
- Luego definiremos nuestra clase `MyMonteCarlo` derivándola de una clase de ALPS. El archivo de cabecera anterior implica que usarás la clase de ALPS `MCRun`, que es la más simple. Si quieres disfrutar de las funcionalidades de red (lattice) de ALPS, reemplaza la línea de definición de clase por:

    class MyMonteCarlo : public alps::scheduler::LatticeMCRun<>{

y añade en las cabeceras

    #include <alps/lattice.h>
    
Si además quieres usar la biblioteca Model (útil para modelos cuánticos de red), usa en su lugar:

    class MyMonteCarlo : public alps::scheduler::LatticeModelMCRun<>{

- En la parte pública, `MyMonteCarlo(const alps::ProcessList&,const alps::Parameters&,int)` es el constructor de tu clase, y será necesario para inicializar todos los parámetros.
- `print_copyright(std::ostream&)` es una función simple para mostrar cualquier información útil que quieras que se muestre al comienzo de cada simulación.
- Las funciones save y load son funciones muy útiles en las que describirás lo que se necesita guardar (cargar) en disco para reiniciar las simulaciones después de cada punto de control.
- La función dostep es tu función MC principal: es la función que se ejecutará en cada paso de MC.
- La función `is_thermalized` indicará a las bibliotecas de ALPS cuándo ha terminado la parte de termalización de tu simulación (es decir, cuándo puede comenzar la serie de mediciones).
- La función `work_done` indicará a las bibliotecas de ALPS qué porcentaje de las simulaciones ya se ha completado.

El resto del trabajo consiste ahora en interconectar correctamente estas funciones con tu programa. Esto se hará en un archivo llamado, por ejemplo, `MyMonteCarlo.cpp`

## Construyendo tu propio programa MC de ALPS

### La función de copyright

Comenzamos con la función más sencilla, `print_copyright()`, en el archivo `MyMonteCarlo.cpp`

    #include "MyMonteCarlo.hpp";
    /************************************ ALPS functions **********************************************/
    // Copyright statement
    void MyMonteCarlo::print_copyright(std::ostream & out)
    {
        out << "My own ALPS Monte Carlo program v. 0.1\n"
            << "  copyright (c) 2006 by Myself,\n"
            << "  available from the author on request\n\n";
    }

### Gestión de pasos de Monte Carlo

Centrémonos ahora en la gestión de los pasos MC. Una situación típica es la siguiente: uno quisiera realizar un número fijo de pasos de termalización, luego un número fijo de pasos para la parte de medición. Muy a menudo, uno también quisiera realizar cierta cantidad de pasos de Monte Carlo entre cada medición. Por lo tanto, podría ser útil definir en tu estructura de datos interna las siguientes variables (en `MyMonteCarlo.hpp`):

    private :
        // your own internal data here ...
        int Nb_Steps; 
        int Nb_Thermalisation_Steps; 
        int Each_Measurement;
        int Steps_Done_Total; 
        int Measurements_Done;
        void do_update();
        void do_measurements();
        // the rest of your own internal data here ...
    };
    
Aquí `Nb_Thermalisation_Steps` será el número de pasos de termalización que solicites y `Nb_Steps` el número de pasos después de la termalización que solicites. `Each_Measurement` será el número de pasos entre cada medición. Estos tres números se inicializarán más adelante en el constructor. `Steps_Done_Total` almacenará el número actual de pasos MC finalizados (incluidos los de termalización). Finalmente, `Measurements_Done` almacenará el número intermedio de pasos realizados entre cada medición. Las funciones `do_update()` y `do_measurements()` (que tendrás que definir tú mismo) realizarán, respectivamente, un único paso MC y una serie de mediciones.
Todas estas definiciones conducen a las siguientes definiciones simples de las funciones miembro de tu clase en `MyMonteCarlo.cpp`

    bool MyMonteCarlo::is_thermalized() const
    {  return (Steps_Done_Total >= Nb_Thermalisation_Steps); }

Esta función devolverá efectivamente 1 si el número actual de pasos MC es superior al número total de pasos de termalización solicitados, y 0 en caso contrario. La segunda función

    double MyMonteCarlo::work_done() const
    { return (is_thermalized() ? (Steps_Done_Total-Nb_Thermalisation_Steps)/double(Nb_Steps) :0.); }

devolverá 0 si la simulación no está termalizada, y un número entre 0 y 1 correspondiente al porcentaje de pasos de medición solicitados que ya se han realizado. Finalmente, la función `dostep()` tendrá este aspecto

    void MyMonteCarlo::dostep()
    { do_update(); // you'll have to define what this function does later
      ++Steps_Done_Total; // increment the number of steps done
      if (is_thermalized()) // do measurements only if simulation thermalized
        { if (++Measurements_Done==Each_Measurement) // do a measurement every Each_Measurement
            { Measurements_Done=0;
            do_measurements(); // you'll have to define what this function does later
            }
        }
    }
    
En algún momento, por supuesto, tienes que definir qué hace realmente tu programa durante un paso MC, y esto se hará en la función `do_update()`. ¡No puedo ayudarte con eso! Las mediciones se han agrupado en nuestro ejemplo en la función `do_measurements()`, que se describirá a continuación.

### Las funciones save y load

ALPS permite un tratamiento sencillo de los datos internos que se deben guardar como punto de control en disco. Imaginemos que en tu estructura de datos interna necesitas guardar como punto de control algunos enteros y un arreglo de doubles para poder reiniciar tus simulaciones

    private :
        // the rest of your own internal data here ...
        int Number_of_Spins; 
        int MyOwnVariable;
        std::vector<double> SpinArray;
        ...
    };
    
Esto se puede lograr muy fácilmente escribiendo

    void MyMonteCarlo::save(alps::ODump& dump) const
        { dump <<  Number_of_Spins << MyOwnVariable << SpinArray;}

y la función load se adivina fácilmente que es

    void MyMonteCarlo::load(alps::IDump& dump) const
        { dump >>  Number_of_Spins >> MyOwnVariable >> SpinArray;}
        
Ten en cuenta que puedes volcar (dump) de esta manera la mayoría de los tipos habituales (int, double, bool, etc.) y también están disponibles la mayoría de los contenedores estándar (como vector o set).
Ahora imagina que has creado tu propia pequeña estructura interna,

    struct Vertex
        { int vertex_type;
        std::vector<double> coordinates;
        int SomeOtherVariable; }
        
y quieres guardar una instancia de ella en tu clase Monte Carlo.

    private :
        // the rest of your own internal data here ...
        Vertex MyVertex; 
        ...
    };
    
Bueno, solo tienes que enseñarle a ALPS qué guardar y cargar en tu estructura

    alps::ODump& operator<<(alps::ODump& dump, const Vertex& v)
    { return dump << v.vertex_type << v.coordinates; }

    alps::IDump& operator>>(alps::IDump& dump, Vertex& v)
    { return dump >> v.vertex_type >> v.coordinates;}
    
y luego podrás añadir fácilmente MyVertex a las funciones principales save y load de ALPS:

    void MyMonteCarlo::save(alps::ODump& dump) const
    { dump <<  Number_of_Spins << MyOwnVariable << SpinArray << MyVertex;}

Si has usado la gestión de pasos de Monte Carlo descrita anteriormente, también querrás añadir esto en tus funciones save/load:

    void MyMonteCarlo::save(alps::ODump& dump) const
    { dump <<  Number_of_Spins << MyOwnVariable << SpinArray << MyVertex;
        dump <<  Nb_Steps << Measurements_Done; }

### La función `do_measurements()`

En esta función realizarás tus mediciones y se las darás a ALPS para que las procese. Esto es bastante sencillo.

    void MyMonteCarlo::do_measurements()
    { double Energy; std::valarray<double> Correl(L);
     // do the measurements in your code (update the Energy and Correl variable) ...
     ...
     // give them to ALPS
     measurements["Energy"] << Energy;
     measurements["Spin Correlations"] << Correl;
   }
   
¿Y eso es todo? Ahora podrías preguntarte: ¿cómo sabe ALPS qué es "Energy" o "Spin Correlations"? ¿Cómo distingue entre mediciones escalares (como Energy aquí) y mediciones vectoriales (como Correl)? Estas dos preguntas se abordarán a continuación, en el constructor de tu clase.
Otra pregunta podría ser: ¿por qué usaste un `std::valarray` y no un `std::vector` para el observable vectorial? Esto es por razones internas de ALPS, pero simplemente recuerda que, para observables vectoriales, ALPS necesita que los vectores sean **siempre** del mismo tamaño para cada medición diferente (en este ejemplo, measurements["Spin Correlations"] fallará si el objeto Correl no tiene siempre el mismo tamaño — L aquí).

### El constructor

Hay básicamente tres cosas que tienes que hacer en tu constructor:
- Inicializar los parámetros de tu simulación leyéndolos de los parámetros proporcionados
- Inicializar otras variables internas, por ejemplo la configuración de espines
- Definir los observables que se usan en la función do_measurements() anterior

El constructor tiene este aspecto

    MyMonteCarlo::MyMonteCarlo(const alps::ProcessList& where,const alps::Parameters& params,int node) : alps::scheduler::MCRun(where,params,node),
    Nb_Steps(params.value_or_default("SWEEPS",1000)),
    Nb_Thermalisation_Steps(static_cast<alps::uint32_t>(params["THERMALIZATION"])),
    Number_of_Spins(alps::evaluate<alps::uint32_t>(params["L"],params)),
    T(params.defined("T") ? static_cast<double>(params["T"]) : 1./static_cast<double>(params["beta"])),
    Steps_Done_Total(0),
    SpinArray(Number_of_Spins,0),    //Initialize the std::vector with size Number_of_Spins and set all values to 0
    //...
    {
    for (std::vector<int>::iterator iter=SpinArray.begin(); iter!=SpinArray.end(); ++iter)
        *iter=random_int(-1,1);
    //...    
   
    measurements << alps::RealObservable("Energy");               //With binning
    measurements << alps::SimpleRealObservable("Magnetization");  //Without binning
   
    alps::RealVectorObservable::label_type correlationlabels;
    // set correlationlabels using push_back() ...
    measurements << alps::RealVectorObservable("Spin Correlations",correlationlabels);
    }

Como ves, hay varias formas de leer los parámetros del objeto `params`. Definir los observables se hace simplemente proporcionando su tipo y su etiqueta.
Nótese que, al incluir `alps/scheduler/montecarlo.h`, también puedes usar las funciones de números aleatorios

    random_int(int a, int b);         //from [a,b]
    random_int(int n);                //from [0,n)
    random_real(double a, double b);  //from (a,b)
    random_real();                    //from (0,1)

proporcionadas por ALPS.

## Ejecutando tu código de ALPS

Para ejecutar tu código es útil añadir el siguiente typedef en tu `MyMonteCarlo.h`:

    typedef alps::scheduler::SimpleMCFactory<MyMonteCarlo> MyMonteCarloFactory;

En un `main.C` simple, como por ejemplo `.../alps/example/scheduler/main.C`, ahora puedes llamar a

    int main(int argc, char** argv)
    {
        // ...
        return alps::scheduler::start(argc,argv,MyMonteCarloFactory());
        // ...
    }
    
Después de compilar y enlazar, inicias tu simulación usando `./MyMonteCarlo parm.in.xml` y eso es todo.

## Uso de las funcionalidades de red (lattice) de ALPS

Si quieres que ALPS no solo se encargue de la planificación y la gestión de mediciones por ti, sino que también se ocupe de las operaciones de red, puedes usar la clase `LatticeMCRun`. Define tu código Monte Carlo de la siguiente manera:

    typedef alps::scheduler::LatticeMCRun<>::graph_type graph_type;
    class MyLatticeMonteCarlo : public alps::scheduler::LatticeMCRun<graph_type> { ... }
    
Al ejecutar tu simulación tendrás que indicar a tu clase, mediante tu archivo de parámetros, qué tipo de red quieres usar, por ejemplo

    LATTICE = "square lattice"
    
o

    LATTICE = "honeycomb lattice"
    
Hay muchas redes predefinidas, que puedes encontrar en tu `/alps/2.x.x/lib/xml/lattices.xml`. Cómo definir tu propia red se explica [aquí](../../intro/latticehowtos/intro).

### Introducción

Básicamente, ALPS crea un objeto de un `boost::graph` que representa la red. Esta potente estructura de datos permite un movimiento fácil y eficiente a través de los vértices y aristas de un grafo. Nótese que, en el lenguaje de ALPS, hablamos de sitios (sites), enlaces (bonds) y vecinos (neighbors) en lugar de los vértices (vertices), aristas (edges) y vértices adyacentes (adjacent_vertices) de Boost. Para acceder a un sitio en particular, la estructura de datos trabaja con el tipo de dato site_descriptor. A menos que definas algo distinto, el site_descriptor de tu red será de tipo int (más precisamente, el tipo `alps::uint32_t`). Esto te permite usar el site_descriptor como el índice de tu arreglo (privado) de almacenamiento (o vector, etc.) de la configuración de tu sistema. En otras palabras, ¡tú mismo debes encargarte del contenido de los datos en tu red (valores de espín, número de ocupación, etc.)! Las funcionalidades de red de ALPS hacen el trabajo de proporcionar fácilmente el site_descriptor de los vecinos o el bond_descriptor de los enlaces salientes de un sitio.
Además, permiten iterar sobre sitios, enlaces y vecinos con el llamado site_iterator. Un site_iterator es simplemente un elemento de lista que tiene un puntero a un site_descriptor y un puntero al siguiente site_iterator. Un bond_iterator funciona de la misma manera. Así, la totalidad de todos los sitios puede representarse como un `std::pair<site_iterator, site_iterator>` compuesto por el puntero al primer y al último elemento en una lista de todos los sitios. Esto es precisamente lo que devuelve `sites()`.

### Un ejemplo completo (todo en uno)

Esta sección ofrece un ejemplo de código que debería incluir la mayoría de las características importantes. Será una implementación doble de la medición de energía de un sistema de espines de Ising, respectivamente como
iteración sobre todos los enlaces
iteración sobre todos los sitios seguida de una iteración sobre los vecinos del sitio
iteración sobre todos los sitios seguida de una iteración sobre las aristas salientes del sitio
En tu constructor, una inicialización de tu vector de espines podría verse así
 `std::vector<int> spins(num_sites())`;
 
    site_iterator s_iter;
    for (s_iter = sites().first; s_iter!=sites().second; ++s_iter)
        spins[*s_iter]=random_int(0,1);

Así puedes ver las dos funciones de la clase `LatticeMCRun`, `num_sites()` (devuelve el número de sitios) y `sites()` (devuelve un `std::pair` de site_iterators). Podemos usar el site_descriptor al que apunta iter como el índice de nuestro vector de espines.
La medición de la energía como parte de la función `do_step()` podría verse así

    double E = 0.0;
    int index1, index2;
    for (bond_iterator b_iter=bonds().first; b_iter!=bonds().second; ++b_iter) {
        index1 = source(*b_iter);
        index2 = target(*b_iter);
        E += (spins[index1]==spins[index2])? J : -J ;            // where J is the coupling constant
    }
    //...
    measurements["Energy"] << E/num_sites();
    
En esta versión, iteramos sobre todos los enlaces, de forma análoga a la iteración sobre sitios, y podemos acceder a los dos sitios en los extremos del enlace mediante source(bond_descriptor b) y target(bond_descriptor b), que devuelven un site_descriptor.

La alternativa, incluyendo el manejo de vecinos, es:

    double E = 0.0;
    for (site_iterator s_iter=sites().first; s_iter!=sites().second; ++s_iter) {
        neighbor_iterator n_iter;
        for (n_iter=neighbors(*s_iter).first; n_iter!=neighbors(*s_iter).second; ++n_iter) {
            E += (spins[*s_iter]==spins[*n_iter])? 0.5*J : -0.5*J ;            // where J is the coupling constant, factor 1/2 because of double-counting
        }
    }

La tercera posibilidad recorre los enlaces salientes de un sitio:

    double E = 0.0;
    for (site_iterator s_iter=sites().first; s_iter!=sites().second; ++s_iter) {
        neighbor_bond_iterator nb_iter;
        for (nb_iter=neighbor_bonds(*s_iter).first; nb_iter!=neighbor_bonds(*s_iter).second; ++nb_iter) {
            E += (spins[source(*nb_iter)]==spins[target(*nb_iter)])? 0.5*J : -0.5*J ;
        }
    }
    
Finalmente, si quieres acceder a un sitio o enlace aleatorio, puedes usar site(int site_no) y bond(int bond_no):

    site_descriptor randomsite = site(random_int(num_sites() ) );
    bond_descriptor randombond = bond(random_int(num_bonds() ) );
