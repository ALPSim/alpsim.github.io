
---
title: Definiciones de Modelos de ALPS
toc: true
weight: 5
---

Como parte del proyecto ALPS, necesitamos describir modelos cuánticos de red en un formato común. Las descripciones de red que utilizan el esquema de red están asociadas con descripciones de base y de hamiltoniano para cada sitio y enlace de la red.

## El archivo de biblioteca de modelos predeterminado

El archivo de biblioteca de modelos define el espacio de Hilbert y el hamiltoniano del problema. La biblioteca de modelos predeterminada se encuentra en $ALPSPATH/lib/xml/models.xml, y contiene muchos de los modelos de uso común, como el "t-J", el "Bose Hubbard", el "spin 1/2", y muchos otros.

Lista de modelos definidos en el archivo de biblioteca de modelos predeterminado:
| **nombre del modelo** | **lista de parámetros disponibles** |
| :------------- | :------------------------------- |
| spin | J Jz Jxy J0 Jz0 Jxy0 J1 Jz1 Jxy1 h Gamma D K K0 K1 |
| boson Hubbard | mu t V U t0 t1 V0 V1 |
| hardcore boson | igual que el anterior |
| fermion Hubbard | igual que el anterior |
| spinless fermions | mu t V t0 t1 V0 V1 |
| Kondo lattice | mu t J |
| t-J | mu t J V J t0 t1 t2 V0 V1 V2 J0 J1 J2 |

## Estructura general de un archivo de biblioteca de modelos 

La estructura típica de una biblioteca de modelos es la siguiente: 

    <MODEL>
    <SITEBASIS Name=...> ... </SITEBASIS>
    <BASIS Name=...> ... </BASIS>
    <HAMILTONIAN Name=...> ... </HAMILTONIAN>
    </MODEL>

El comando `<SITEBASIS>` define el espacio de Hilbert (base) de un único sitio, el comando `<BASIS>` define el espacio de Hilbert de toda la red, y el `<HAMILTONIAN>` define el hamiltoniano.

### La base de un único sitio

Los estados de base de un único sitio se describen mediante uno o más números cuánticos, como en:

    <SITEBASIS name="hardcore boson">
    <QUANTUMNUMBER name="N" min="0" max="1"/> 
    </SITEBASIS>
 
    <SITEBASIS name="spin-1/2">
    <QUANTUMNUMBER name="S" min="1/2" max="1/2"/>
    <QUANTUMNUMBER name="Sz" min="-1/2" max="1/2"/>
    </SITEBASIS>
 
    <SITEBASIS name="fermion">
    <QUANTUMNUMBER name="Nup" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="Ndown" min="0" max="1" type="fermionic"/>
    </SITEBASIS>
 
 ¡No olvide el número cuántico de espín total S para los espines, ya que esto será necesario en la definición de los elementos de matriz de los operadores de espín!
El `<SITEBASIS>` toma un atributo name mediante el cual puede referenciarse posteriormente.
Los elementos `<QUANTUMNUMBER>` toman cada uno un nombre, y valores mínimo y máximo en los atributos min y max. Los números cuánticos pueden tomar valores entre min, min+1, min+2 ... hasta max. Opcionalmente, se puede establecer un atributo type como bosonic (el predeterminado) o fermionic. Debe establecerse como fermionic cuando el número cuántico es un operador de número fermiónico. Esta información se utilizará al determinar las relaciones de conmutación entre operadores en diferentes sitios.
El rango de los números cuánticos puede parametrizarse mediante parámetros de entrada, y se puede especificar `default` como en
 
    <SITEBASIS name="boson">
    <PARAMETER name="Nmax" default="infinity"/>
    <QUANTUMNUMBER name="N" min="0" max="Nmax"/>
    </SITEBASIS>
 
 Para modelos más complicados, como un modelo t-J, a veces son posibles varias opciones. Podemos etiquetar los estados ya sea por el número de partículas y el espín, o por el número de espines arriba y abajo:

    <SITEBASIS name="t-J">
    <QUANTUMNUMBER name="N" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="S" min="N/2" max="N/2"/>
    <QUANTUMNUMBER name="Sz" min="-S" max="S"/>
    </SITEBASIS>
 
    <SITEBASIS name="alternative t-J">
    <QUANTUMNUMBER name="Nup" min="0" max="1" type="fermionic"/>
    <QUANTUMNUMBER name="Ndown" min="0" max="1-Nup" type="fermionic"/>
    </SITEBASIS>

## La base del modelo de red completo

El conjunto de base de un modelo de red se especifica dando la base para cada tipo de sitio (vértice) en la red. Si solo hay un tipo de sitio, solo es necesario dar una base de sitio, como en:

    <BASIS name="spin">
    <SITEBASIS ref="spin"/>
    </BASIS>
 
    <BASIS name="spin">
    <SITEBASIS name="spin-1">
        <QUANTUMNUMBER name="S" min="1" max="1"/>
        <QUANTUMNUMBER name="Sz" min="-1" max="1"/>
    </SITEBASIS>
    </BASIS>
 
 La base nuevamente toma un atributo name y contiene un elemento `<SITEBASIS>` que se usa como predeterminado para todos los sitios. El <SITEBASIS> puede referenciar uno definido previamente mediante un atributo ref o simplemente declarar la base de sitio completa como arriba.
 
### Redes con más de un sitio por celda unitaria

Si la red contiene más de un sitio por celda unitaria, el comando `<BASIS>` debe contener una entrada `<SITEBASIS>` para cada sitio de la celda unitaria. Cada entrada debe tener un Type diferente, correspondiente a las definiciones dadas en el archivo de biblioteca de redes (ver documentación).
La siguiente base ofrece un ejemplo válido del espacio de Hilbert en una red bipartita:

    <BASIS name="Kondo lattice">
    <SITEBASIS type="0" ref="fermion"/>
    <SITEBASIS type="1" ref="spin-1/2"/>
    </BASIS>
 
 En algunos modelos de espín podríamos tener la misma base de sitio local pero la magnitud del espín podría cambiar, y queremos, por ejemplo, especificar el valor del espín en sitios de tipo 0 y 1 mediante los parámetros `local_S0` y `local_S1`, así como proporcionar valores predeterminados adecuados:
 
    <BASIS name="spin">
    <SITEBASIS type="0" ref="spin">
        <PARAMETER name="local_spin" value="local_S0"/>
        <PARAMETER name="local_S0" value="local_S"/>
        <PARAMETER name="local_S" value="1/2"/>
    </SITEBASIS>
    <SITEBASIS type="1" ref="spin">
        <PARAMETER name="local_spin" value="local_S1"/>
        <PARAMETER name="local_S1" value="local_S"/>
        <PARAMETER name="local_S" value="1/2"/>
    </SITEBASIS>
    </BASIS>
 
 Al agregar más tipos de sitio esto puede volverse engorroso, y el formato de ALPS permite un atajo. Si no se especifica ningún `type`, el SITEBASIS coincide con cualquier sitio, y el carácter comodín "#" en cualquier nombre de parámetro se reemplaza por el tipo de sitio. De esa manera, el ejemplo anterior puede extenderse a un número infinito de tipos de sitio y escribirse de forma más compacta como:

    <BASIS name="spin">
    <SITEBASIS ref="spin">
        <PARAMETER name="local_spin" value="local_S#"/>
        <PARAMETER name="local_S#" value="local_S"/>
        <PARAMETER name="local_S" value="1/2"/>
    </SITEBASIS>
    </BASIS>
 
 ### Restricciones
 
 Finalmente, la base puede restringirse especificando una restricción sobre las sumas de ciertos números cuánticos. Por ejemplo, para especificar una base para un modelo de espín con valor total de espín Sz_total, se puede agregar un elemento `<CONSTRAINT>`:

    <BASIS name="spin">
    <SITEBASIS ref="spin"/>
    <CONSTRAINT quantumnumber="Sz" value="Sz_total"/>
    </BASIS>
 
 ## Operadores cuánticos
 
 ### Operadores de sitio simples
 
 Los operadores cuánticos básicos a partir de los cuales se construirán los operadores hamiltonianos se especifican mediante un nombre, un elemento de matriz y, opcionalmente, los cambios que el operador causa en los números cuánticos. Estos operadores se definen junto con la base de sitio. Ejemplos son:
 
    <SITEBASIS name="spin">
    <PARAMETER name="local_spin" default="1/2"/>
    <QUANTUMNUMBER name="S" min="local_spin" max="local_spin"/>
    <QUANTUMNUMBER name="Sz" min="-S" max="S"/>
 
    <OPERATOR name="Splus" matrixelement="sqrt(S*(S+1)-Sz*(Sz+1))">
        <CHANGE quantumnumber="Sz" change="1"/>
    </OPERATOR>
 
    <OPERATOR name="Sminus" matrixelement="sqrt(S*(S+1)-Sz*(Sz-1))">
        <CHANGE quantumnumber="Sz" change="-1"/>
    </OPERATOR>
 
    <OPERATOR name="Sz" matrixelement="Sz"/>  
    </SITEBASIS>
 
 
 
    <SITEBASIS name="boson">
    <PARAMETER name="Nmax" default="infinity"/>
    <QUANTUMNUMBER name="N" min="0" max="Nmax"/>
 
    <OPERATOR name="bdag" matrixelement="sqrt(N+1)">
        <CHANGE quantumnumber="N" change="1"/>
    </OPERATOR>
   
    <OPERATOR name="b" matrixelement="sqrt(N)">
        <CHANGE quantumnumber="N" change="-1"/>
    </OPERATOR>
   
    <OPERATOR name="n" matrixelement="N"/>
    </SITEBASIS>
 
 En la especificación del elemento de matriz, se puede hacer referencia al valor de los números cuánticos del estado a través del nombre del número cuántico (Sz en estos ejemplos)
 
 ### Operadores de sitio complejos
 
 Además de los operadores de sitio simples que cambian un número cuántico de manera única, se pueden construir operadores de sitio más complejos, como el operador de espín Sx
 
    <SITEOPERATOR name="Sx" site="i">
    1/2*(Splus(i)+Sminus(i))
    </SITEOPERATOR>
 
 o un operador de doble ocupación para un modelo bosónico
 
    <SITEOPERATOR name="double_occupancy" site="x">
    n(x)*(n(x)-1)/2
    </SITEOPERATOR>
 
 Estas definiciones de operadores pueden usar cualquier otro operador de sitio simple o complejo. El argumento dado al operador entre paréntesis es el nombre simbólico del sitio, que se especifica mediante el atributo site en el elemento SITEOPERATOR.
 
 ### Operadores de enlace complejos
 
 De manera similar al operador de sitio complejo, también podemos definir operadores de dos sitios o "enlace"
 
    <BONDOPERATOR name="exchange" source="x" target="y">
    Sz(x)*Sz(y)+1/2*(Splus(x)*Sminus(y)+Sminus(x)*Splus(y))
    </BONDOPERATOR>
 
    <BONDOPERATOR name="fermion_hop" source="x" target="y">
    cdag_up(x)*c_up(y)+cdag_up(y)*c_up(x)+cdag_down(x)*c_down(y)+cdag_down(y)*c_down(x)
    </BONDOPERATOR>
 
donde ahora tenemos dos sitios, etiquetados `source` y `target`. Estos operadores pueden usarse nuevamente en especificaciones de hamiltoniano y de medición.

## Descripciones del hamiltoniano

Con estos elementos ahora podemos describir el hamiltoniano de un modelo. Un modelo simple de bosones de núcleo duro (hardcore boson) podría ser:

    <HAMILTONIAN name="hardcore boson">
    <PARAMETER name="mu" default="0"/>
    <PARAMETER name="t" default="1"/>
    <PARAMETER name="t'" default="1"/>
    <BASIS ref="hardcore boson"/>
    <SITETERM type="0">
        -mu*n
    </SITETERM> 
    <BONDTERM type="0" source="i" target="j">
        -t*(bdag(i)*b(j)+bdag(j)*b(i)))
    </BONDTERM>
    <BONDTERM type="1" source="i" target="j">
        -t'*(bdag(i)*b(j)+bdag(j)*b(i)))
    </BONDTERM>
    </HAMILTONIAN>
 
 Primero, se pueden especificar valores predeterminados para parámetros tales como constantes de acoplamiento usando elementos `<PARAMETER>`.
A continuación, un elemento `<BASIS>` especifica la base utilizada para el modelo, ya sea totalmente especificada en línea o mediante una referencia (usando el atributo `ref`).
Los términos del hamiltoniano se especifican a continuación mediante términos de sitio, asociados con los sitios de la red, y términos de enlace, asociados con los enlaces. Cada uno de los elementos `<SITETERM>` y `<BONDTERM>` puede tomar opcionalmente un atributo type. Este atributo type especifica a qué tipo de sitio (enlace) se aplicará el término. Estos son los mismos tipos especificados en la descripción de la red. Omitir el atributo type aplica el término a todos los sitios o enlaces para los cuales no se especifica explícitamente ningún otro término.
Los elementos `<SITETERM>` contienen términos del hamiltoniano asociados con un único sitio. En el ejemplo anterior, el término mu se refiere al parámetro mu, mientras que el término n se refiere al operador n descrito anteriormente.
En los elementos `<BONDTERM>`, es necesario especificar operadores que se refieran a dos sitios diferentes. Esto se hace agregando el índice de sitio entre paréntesis después del operador, por ejemplo, como en n(i) para actuar sobre el sitio i. Los atributos source y target especifican qué variables usar para especificar los sitios (i y j en el ejemplo).
Para simplificar la escritura de los hamiltonianos, se pueden usar los operadores de sitio y enlace predefinidos anteriores. Por ejemplo, para un modelo de espín con campo transversal podemos usar los operadores Sx y `exchange` definidos anteriormente:

    <HAMILTONIAN name="spin">
    <PARAMETER name="J" default="1"/>
    <PARAMETER name="h" default="0"/>
    <PARAMETER name="Gamma" default="0"/>
    <BASIS ref="spin"/>
    <SITETERM site="i">
        -h*Sz(i)-Gamma*Sx(i))
    </SITETERM> 
    <BONDTERM source="i" target="j">
        J*exchange(i,j)
    </BONDTERM>
    </HAMILTONIAN>
 
 Los términos de acoplamiento dependientes del tipo de sitio pueden especificarse ya sea como en el primer ejemplo, dando un atributo type que restringe la aplicabilidad del término de sitio o enlace, o nuevamente usando el carácter comodín # en el nombre de las constantes de acoplamiento, que será reemplazado por el tipo del sitio, como en:
 
    <HAMILTONIAN name="spin">
    <PARAMETER name="J" default="1"/>
    <PARAMETER name="h" default="0"/>
    <PARAMETER name="Gamma" default="0"/>
    <BASIS ref="spin"/>
    <SITETERM site="i">
            <PARAMETER name="h#" default="h"/>
        <PARAMETER name="Gamma#" default="Gamma"/>
        -h#*Sz(i)-Gamma#*Sx(i))
    </SITETERM> 
    <BONDTERM source="i" target="j">
        <PARAMETER name="J#" default="J"/>
        J#*exchange(i,j)
    </BONDTERM>
    </HAMILTONIAN>
 
 Ahora podemos especificar acoplamientos `J0`, `h0` y `Gamma0` en enlaces de tipo 0, `J1`, `h1` y `Gamma1` en enlaces de tipo 1, y así sucesivamente...
 
Las extensiones a términos más complejos, como términos de 3 y 4 sitios, están en preparación y se incluirán aquí tan pronto como las bibliotecas de ALPS admitan dichos términos.


