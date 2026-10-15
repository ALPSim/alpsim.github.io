
---
title: Code-03 蒙特卡洛编程指南
math: true
toc: true
weight: 4
---

## 简介

虽然 ALPS 应用程序中已经提供了若干蒙特卡洛（MC）程序，但 ALPS 的主要目的是帮助开发者以尽可能简单、快捷的方式编写自己的 MC 程序。所有 MC 算法都要执行一些共同的任务，而这些任务无需每次都重新编写。本文的目的是让你相信 ALPS 库为此提供了一个简单的框架，并通过示例演示如何使用它们。这既包括经典蒙特卡洛算法，也包括量子蒙特卡洛算法。
ALPS 源代码中的 `example/scheduler` 目录包含一个针对伊辛模型的示例模拟代码，你可以根据自己的需要对其进行修改。下面我们将讨论这些示例。

### 在开发新的 MC 应用程序时，ALPS 库相比自己编写的工具有哪些优势？

- 自动计算误差棒和自相关时间
- 自动并行化
- 自动输出结果（XML 格式），并附带相应的提取工具
- 自动处理符号（用于存在符号问题的量子蒙特卡洛模拟）
- 便捷的检查点保存与模拟重启
- 便捷的输入参数管理
- 便捷地添加新的测量
- 便捷的随机数管理
- （可选）便捷的晶格管理
- （可选）便捷的量子哈密顿量管理（用于量子蒙特卡洛）
- ...

所有这些只需要少量的编程/修改即可获得，下面我们就来介绍。

## 开始编写你自己的 ALPS MC 程序

**正在编写中……本教程既未完成也未经校对……欢迎就本页提出任何意见/建议**

首先，使用 ALPS 库意味着你要使用 C++ 作为编程语言。从现在起，我们假设你想编写一个新的 MC 应用程序，并且已经知道自己将使用什么样的内部数据结构，以及单个蒙特卡洛步所采用的算法。
要使用 ALPS 库，你需要创建自己的 C++ 类，它派生自 ALPS 的一个内部类。我们将这个类称为 `MyMonteCarlo`，并创建一个头文件 `MyMonteCarlo.hpp`。

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

下面我们来看这些代码行的含义。
- 首先，你需要包含几个 ALPS 头文件（如需使用 ALPS 的其他功能，还会在这里加入更多头文件）。
- 然后，我们通过从一个 ALPS 类派生来定义 `MyMonteCarlo` 类。上面的头文件意味着你将使用 `MCRun` 这个 ALPS 类，它是最简单的一个。如果你想使用 ALPS 的晶格功能，请将类定义行替换为：

    class MyMonteCarlo : public alps::scheduler::LatticeMCRun<>{

并在头文件中加入

    #include <alps/lattice.h>
    
如果你还想使用模型库（对晶格量子模型很有用），则改用：

    class MyMonteCarlo : public alps::scheduler::LatticeModelMCRun<>{

- 在 public 部分中，`MyMonteCarlo(const alps::ProcessList&,const alps::Parameters&,int)` 是你的类的构造函数，用于初始化所有参数。
- `print_copyright(std::ostream&)` 是一个简单的函数，用于在每次模拟开始时输出你希望输出的任何有用信息。
- save 和 load 函数非常有用，你将在其中描述在每个检查点需要保存到磁盘（从磁盘加载）哪些内容，以便重启模拟
- dostep 函数是你的 MC 主函数：每个 MC 步都会执行这个函数。
- `is_thermalized` 函数会告诉 ALPS 库模拟的热化部分何时结束（即测量序列何时可以开始）
- `work_done` 函数会告诉 ALPS 库模拟已经完成的百分比。

剩下的工作就是将这些函数与你的程序正确对接。这将在一个名为（比如）`MyMonteCarlo.cpp` 的文件中完成

## 构建你自己的 ALPS MC 程序

### 版权函数

我们从文件 `MyMonteCarlo.cpp` 中最简单的函数 `print_copyright()` 开始

    #include "MyMonteCarlo.hpp";
    /************************************ ALPS functions **********************************************/
    // Copyright statement
    void MyMonteCarlo::print_copyright(std::ostream & out)
    {
        out << "My own ALPS Monte Carlo program v. 0.1\n"
            << "  copyright (c) 2006 by Myself,\n"
            << "  available from the author on request\n\n";
    }

### 蒙特卡洛步的管理

现在我们集中讨论 MC 步的管理。一种典型的情形是：先执行固定步数用于热化，再执行固定步数用于测量部分。很多时候，人们还希望在每两次测量之间执行一定数量的蒙特卡洛步。因此，在内部数据结构中（在 `MyMonteCarlo.hpp` 中）定义以下变量可能会很有用：

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
    
这里 `Nb_Thermalisation_Steps` 是你要求的热化步数，`Nb_Steps` 是你要求的热化之后的步数。`Each_Measurement` 是每两次测量之间的步数。这三个数将在稍后的构造函数中初始化。`Steps_Done_Total` 存储当前已完成的 MC 步数（包括热化步）。最后，`Measurements_Done` 存储两次测量之间已完成的中间步数。`do_update()` 和 `do_measurements()` 函数（需要你自己定义）分别执行单个 MC 步和一组测量。
根据所有这些定义，可以在 `MyMonteCarlo.cpp` 中简单地定义类的成员函数如下

    bool MyMonteCarlo::is_thermalized() const
    {  return (Steps_Done_Total >= Nb_Thermalisation_Steps); }

如果当前 MC 步数大于所要求的热化总步数，该函数返回 1，否则返回 0。第二个函数

    double MyMonteCarlo::work_done() const
    { return (is_thermalized() ? (Steps_Done_Total-Nb_Thermalisation_Steps)/double(Nb_Steps) :0.); }

在模拟尚未热化时返回 0，否则返回一个介于 0 和 1 之间的数，对应于所要求的测量步中已完成的百分比。最后，`dostep()` 函数如下所示

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
    
当然，在某个时候你必须定义程序在一个 MC 步中真正要做的事情，这将在 `do_update()` 函数中完成。这一点我无法帮你！在我们的示例中，测量被归入 `do_measurements()` 函数，下面将对其进行介绍。

### save 和 load 函数

ALPS 使得将内部数据以检查点形式保存到磁盘变得十分容易。假设在你的内部数据结构中，需要为几个整数和一个 double 数组设置检查点，以便能够重启模拟

    private :
        // the rest of your own internal data here ...
        int Number_of_Spins; 
        int MyOwnVariable;
        std::vector<double> SpinArray;
        ...
    };
    
这可以非常简单地通过如下代码实现

    void MyMonteCarlo::save(alps::ODump& dump) const
        { dump <<  Number_of_Spins << MyOwnVariable << SpinArray;}

而 load 函数不难猜到是

    void MyMonteCarlo::load(alps::IDump& dump) const
        { dump >>  Number_of_Spins >> MyOwnVariable >> SpinArray;}
        
注意，大多数常用类型（int、double、bool 等）都可以用这种方式转储，大多数标准容器（例如 vector 或 set）也同样适用。
现在假设你定义了自己的一个小型内部结构，

    struct Vertex
        { int vertex_type;
        std::vector<double> coordinates;
        int SomeOtherVariable; }
        
并且你想在蒙特卡洛类中保存它的一个实例。

    private :
        // the rest of your own internal data here ...
        Vertex MyVertex; 
        ...
    };
    
那么，你只需告诉 ALPS 在你的结构中需要保存和加载哪些内容

    alps::ODump& operator<<(alps::ODump& dump, const Vertex& v)
    { return dump << v.vertex_type << v.coordinates; }

    alps::IDump& operator>>(alps::IDump& dump, Vertex& v)
    { return dump >> v.vertex_type >> v.coordinates;}
    
之后就可以轻松地将 MyVertex 加入 ALPS 主 save 和 load 函数中：

    void MyMonteCarlo::save(alps::ODump& dump) const
    { dump <<  Number_of_Spins << MyOwnVariable << SpinArray << MyVertex;}

如果你使用了上面介绍的蒙特卡洛步管理方式，还需要在 save/load 函数中加入以下内容：

    void MyMonteCarlo::save(alps::ODump& dump) const
    { dump <<  Number_of_Spins << MyOwnVariable << SpinArray << MyVertex;
        dump <<  Nb_Steps << Measurements_Done; }

### `do_measurements()` 函数

在这个函数中，你将执行测量，并将测量结果交给 ALPS 处理。这非常简单。

    void MyMonteCarlo::do_measurements()
    { double Energy; std::valarray<double> Correl(L);
     // do the measurements in your code (update the Energy and Correl variable) ...
     ...
     // give them to ALPS
     measurements["Energy"] << Energy;
     measurements["Spin Correlations"] << Correl;
   }
   
就这样？现在你可能会问：ALPS 怎么知道 "Energy" 或 "Spin Correlations" 是什么？它又如何区分标量测量（例如这里的 Energy）和矢量测量（例如 Correl）？这两个问题将在下面类的构造函数部分中解答。
另一个问题可能是：为什么矢量观测量使用的是 `std::valarray` 而不是 `std::vector`？这是出于 ALPS 内部的原因，但请记住，对于矢量观测量，ALPS 要求每次测量中的矢量**始终**具有相同的大小（在本例中，如果 Correl 对象的大小不总是相同——这里为 L——measurements["Spin Correlations"] 将会失败）。

### 构造函数

在构造函数中，基本上需要完成三件事：
- 从给定的参数中读取并初始化模拟所需的参数
- 初始化其他内部变量，例如自旋构型
- 定义上面 do_measurements() 函数中用到的观测量

构造函数如下所示

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

可以看到，从 `params` 对象中读取参数有多种方式。定义观测量只需提供其类型和标签即可。
注意，包含 `alps/scheduler/montecarlo.h` 之后，你还可以使用 ALPS 提供的

    random_int(int a, int b);         //from [a,b]
    random_int(int n);                //from [0,n)
    random_real(double a, double b);  //from (a,b)
    random_real();                    //from (0,1)

随机数函数。

## 运行你的 ALPS 代码

为了运行你的代码，最好在 `MyMonteCarlo.h` 中加入以下 typedef：

    typedef alps::scheduler::SimpleMCFactory<MyMonteCarlo> MyMonteCarloFactory;

在一个简单的 `main.C` 中（例如 `.../alps/example/scheduler/main.C`），现在可以调用

    int main(int argc, char** argv)
    {
        // ...
        return alps::scheduler::start(argc,argv,MyMonteCarloFactory());
        // ...
    }
    
编译和链接之后，使用 `./MyMonteCarlo parm.in.xml` 启动模拟，就这么简单。

## 使用 ALPS 的晶格功能

如果你不仅希望 ALPS 替你完成调度和测量处理，还希望它负责晶格操作，可以使用 `LatticeMCRun` 类。按如下方式定义你的蒙特卡洛代码：

    typedef alps::scheduler::LatticeMCRun<>::graph_type graph_type;
    class MyLatticeMonteCarlo : public alps::scheduler::LatticeMCRun<graph_type> { ... }
    
在执行模拟时，你需要通过参数文件告诉你的类要使用哪种晶格，例如

    LATTICE = "square lattice"
    
或

    LATTICE = "honeycomb lattice"
    
ALPS 预定义了许多晶格，你可以在 `/alps/2.x.x/lib/xml/lattices.xml` 中找到它们。如何定义你自己的晶格，请参见[此处](../../intro/latticehowtos/intro)。

### 简介

基本上，ALPS 会创建一个表示晶格的 `boost::graph` 对象。这一强大的数据结构可以方便而高效地在图的顶点和边之间移动。注意，在 ALPS 的术语中，我们称之为格点（site）、键（bond）、近邻（neighbor），而不是 Boost 中的 vertex、edge、adjacent_vertex。要访问某个特定格点，该数据结构使用 site_descriptor 数据类型。除非你另行定义，晶格的 site_descriptor 为 int 类型（更确切地说，是 `alps::uint32_t` 类型）。这使你可以将 site_descriptor 用作存储系统构型的（私有）数组（或 vector 等）的索引。换言之，晶格中数据的内容（自旋值、占据数等）需要你自己负责！ALPS 的晶格功能负责的是方便地提供某个格点的近邻的 site_descriptor，或其出射键的 bond_descriptor。
此外，它们还允许借助所谓的 site_iterator 遍历格点、键和近邻。site_iterator 只是一个列表元素，它带有一个指向 site_descriptor 的指针和一个指向下一个 site_iterator 的指针。bond_iterator 的工作方式与之相同。因此，所有格点的全体可以表示为一个 `std::pair<site_iterator, site_iterator>`，由指向所有格点列表中第一个和最后一个元素的指针组成。这正是 `sites()` 的返回值。

### 一个综合示例

本节给出一个代码示例，它应当涵盖了大部分重要功能。这是对伊辛自旋系统能量测量的多种实现，分别为
遍历所有键
遍历所有格点，再遍历每个格点的近邻
遍历所有格点，再遍历每个格点的出射边
在构造函数中，自旋矢量的初始化可以写成
 `std::vector<int> spins(num_sites())`;
 
    site_iterator s_iter;
    for (s_iter = sites().first; s_iter!=sites().second; ++s_iter)
        spins[*s_iter]=random_int(0,1);

这里可以看到 `LatticeMCRun` 类的两个函数：`num_sites()`（返回格点数）和 `sites()`（返回由 site_iterator 组成的 `std::pair`）。我们可以将 iter 所指向的 site_descriptor 用作自旋矢量的索引。
作为 `do_step()` 函数一部分的能量测量可以写成

    double E = 0.0;
    int index1, index2;
    for (bond_iterator b_iter=bonds().first; b_iter!=bonds().second; ++b_iter) {
        index1 = source(*b_iter);
        index2 = target(*b_iter);
        E += (spins[index1]==spins[index2])? J : -J ;            // where J is the coupling constant
    }
    //...
    measurements["Energy"] << E/num_sites();
    
在这个版本中，我们类似于遍历格点那样遍历所有键，并可以通过 source(bond_descriptor b) 和 target(bond_descriptor b) 访问键两端的两个格点，它们返回一个 site_descriptor。

另一种包含近邻处理的方式是：

    double E = 0.0;
    for (site_iterator s_iter=sites().first; s_iter!=sites().second; ++s_iter) {
        neighbor_iterator n_iter;
        for (n_iter=neighbors(*s_iter).first; n_iter!=neighbors(*s_iter).second; ++n_iter) {
            E += (spins[*s_iter]==spins[*n_iter])? 0.5*J : -0.5*J ;            // where J is the coupling constant, factor 1/2 because of double-counting
        }
    }

第三种方式遍历格点的出射键：

    double E = 0.0;
    for (site_iterator s_iter=sites().first; s_iter!=sites().second; ++s_iter) {
        neighbor_bond_iterator nb_iter;
        for (nb_iter=neighbor_bonds(*s_iter).first; nb_iter!=neighbor_bonds(*s_iter).second; ++nb_iter) {
            E += (spins[source(*nb_iter)]==spins[target(*nb_iter)])? 0.5*J : -0.5*J ;
        }
    }
    
最后，如果你想访问一个随机格点或随机键，可以使用 site(int site_no) 和 bond(int bond_no)：

    site_descriptor randomsite = site(random_int(num_sites() ) );
    bond_descriptor randombond = bond(random_int(num_bonds() ) );
