
---
title: Medición Personalizada de ALPS
toc: true
weight: 6
---

## Definición de sus mediciones personalizadas

En caso de que las mediciones predeterminadas realizadas por su código de ALPS favorito no sean suficientes para su problema, puede definir sus mediciones personalizadas en el archivo de parámetros. La sintaxis general es la siguiente:

    MEASURE_LOCAL[Name]=Op
    MEASURE_AVERAGE[Name]=Op

Aquí "Name" es el nombre bajo el cual aparecerán sus mediciones en la salida xml, y "Op" es el operador de medición, que debe estar definido en el archivo `models.xml`. MEASURE_AVERAGE mide el valor esperado mecánico-cuántico y (para simulaciones a temperatura finita) termodinámico del operador Op. MEASURE_LOCAL mide los valores esperados del operador Op para cada sitio de la red. El operador debe ser local, es decir, solo puede tener términos de sitio.

    MEASURE_CORRELATIONS[Name]="Op1:Op2"
    MEASURE_CORRELATIONS[Name]=Op    

MEASURE_CORRELATIONS mide las correlaciones de los operadores Op1 y Op2 para todos los pares de sitios no equivalentes de la red. La segunda forma anterior, MEASURE_CORRELATIONS[Name]=Op, es equivalente a MEASURE_CORRELATIONS[Name]="Op:Op". Actualmente, solo se pueden calcular funciones de correlación de dos sitios. Es decir, tanto Op1 como Op2 deben ser operadores de sitio.

    MEASURE_STRUCTURE_FACTOR[Name]=Op

Esto mide el factor de estructura para el operador Op utilizando los autoestados de momento de la red de simulación.

Tenga en cuenta que no todos los códigos de ALPS admiten todas las instrucciones anteriores. Varios códigos tienen facilidades adicionales para definir mediciones. Consulte las páginas del tutorial correspondientes a su código favorito.

## Trucos y soluciones adicionales

Medir cantidades fuera de la diagonal en códigos QMC es en general no trivial y difícil de implementar de forma genérica. Si su programa QMC favorito se niega a realizar su medición favorita, es posible que deba modificar el código fuente.
Sin embargo, en ciertos casos se pueden usar varios trucos. Un truco útil es ampliar la base de sitio de su modelo. Considere el siguiente ejemplo: usando el código worm para simular el modelo de Bose Hubbard en una red no homogénea, medir el segundo momento de la distribución de densidad local $\langle n_i^2\rangle$. Dado que el código worm no funciona en la base de sitio, no realizará mediciones para tal operador. Una posible solución sería parchear la base de sitio "boson" que utiliza el hamiltoniano de Bose Hubbard:

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
    <OPERATOR name="n2" matrixelement="N*N"/>   <--!  added -->
    </SITEBASIS> 
 
 Con este parche, se pueden definir las mediciones correspondientes de la manera habitual, por ejemplo
 
    MEASURE_LOCAL[Local density squared]="n2"
    MEASURE_CORRELATIONS[Density squared, correlations]="n2:n2"




