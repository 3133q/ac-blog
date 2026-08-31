归纳总结，c++的所有头文件

**#include&lt;cstdlib&gt;**

内存管理：malloc，free，calloc，realloc

进程控制：exit，system，abort

随机数生成：rand，srand       

```c++
         srand(time(NULL));
         int a=rand()%(99-0+1);
```

字符串转换：atoi（字符串转换为整型，C语言多一些），atof，atol，strtol，strtod，strtol，

stoi（字符串转换为整型，c++适用），stol，stof

排序函数：qsort（C语言多一些）

```c++
         int arr[]={};
         int n=sizeof(arr)/sizeof(arr[0]);
         qsort(arr,n,sizeof(int),cmp);
```



**#include&lt;execution&gt;**

**#include&lt;cfloat&gt;**

提供了浮点相关常量

\1. **浮点数范围**

- `FLT_MIN`：`float` 类型的最小正数。
- `FLT_MAX`：`float` 类型的最大正数。
- `DBL_MIN`：`double` 类型的最小正数。
- `DBL_MAX`：`double` 类型的最大正数。
- `LDBL_MIN`：`long double` 类型的最小正数。
- `LDBL_MAX`：`long double` 类型的最大正数。

\2. **浮点数精度**

- `FLT_DIG`：`float` 类型的有效位数。
- `DBL_DIG`：`double` 类型的有效位数。
- `LDBL_DIG`：`long double` 类型的有效位数。

\3. **最小负数指数**

- `FLT_MIN_EXP`：`float` 类型的最小负数指数。
- `DBL_MIN_EXP`：`double` 类型的最小负数指数。
- `LDBL_MIN_EXP`：`long double` 类型的最小负数指数。

\4. **最大正数指数**

- `FLT_MAX_EXP`：`float` 类型的最大正数指数。
- `DBL_MAX_EXP`：`double` 类型的最大正数指数。
- `LDBL_MAX_EXP`：`long double` 类型的最大正数指数。

\5. **机器 epsilon**

- `FLT_EPSILON`：`float` 类型的机器 epsilon，表示能够区分1.0和比1.0大的最小浮点数。

- `DBL_EPSILON`：`double` 类型的机器 epsilon。

- `LDBL_EPSILON`：`long double` 类型的机器 epsilon。

  示例：

  ```c++
  float:
  Min: 1.17549e-38
  Max: 3.40282e+38
  Epsilon: 1.19209e-07
  Digits: 6
  
  double:
  Min: 2.22507e-308
  Max: 1.79769e+308
  Epsilon: 2.22045e-16
  Digits: 15
  
  long double:
  Min: 2.22507e-308
  Max: 1.79769e+308
  Epsilon: 2.22045e-16
  Digits: 15
  ```

**#include&lt;cmath&gt;**

数学函数：abs，fabs（对于浮点数），fmod（计算余数），fmax，fmin，exp（计算e开方），

hypot（计算sqrt(x * x + y * y))，log，pow，cbrt（计算立方根），sqrt，sin，cos，tan，asin

（反正弦值），sinh（双曲正弦），cosh，tanh，ceil（向上取整），floor（向下取整），trunc

（去除小数部分），round（四舍五入），

浮点数检查：isfinite（检查是否是有限值），isinf（检查是否是无穷大），isnan（检查是否是NAN，即为未定义或无法表示的数，如0.0/0.0），signbit（检查是否是负数）

**#include&lt;iostream&gt;**

标准输入输出流，适用std::cin，std::cout，std::cerr，std::clog

**#include&lt;iomanip&gt;**

进行格式化，例如：设置宽度，精度，对齐

```c++
#include <iostream>
#include <iomanip>

int main() {
    double pi = 3.14159;

    // 设置输出精度
    std::cout << std::setprecision(3) << pi << std::endl;  //保留三位小数

    // 设置输出宽度和对齐方式
    std::cout << std::setw(10) << std::left << pi << std::endl; //设置字段宽度
    std::cout << std::setw(10) << std::right << pi << std::endl;

    return 0;
}
```

**#include&lt;string&gt;**

声明字符串变量     std::string s;

初始化字符串     std::string s="     ";

使用"+"连接字符串     std::string s1=" "   std::string s2="   "    string str=s1+s2;

成员函数：size，empty，operator，substr（字符串截取，s.substr(0,3)，可指定长度，或者全

截），find（一般形式s.find()，若要用变量接受，使用size_t，未找到返回string::npos），replace

（ s=s.replace(s.find("a"),2," * "  从第一次找到"a"的位置的两个字符替换为" * "，也可以

s=s.replace(s.begin(),s.begin()+5,"#)从开始位置的五个字符替换为"#")

| 函数名                | 描述                                           | 示例代码                                       |
| :-------------------- | :--------------------------------------------- | :--------------------------------------------- |
| `size()`              | 返回字符串的长度（字符数）。                   | `std::cout << str.size();`                     |
| `length()`            | 与 `size()` 相同，返回字符串的长度。           | `std::cout << str.length();`                   |
| `empty()`             | 判断字符串是否为空。                           | `std::cout << (str.empty() ? "Yes" : "No");`   |
| `operator[]`          | 访问字符串中指定位置的字符。                   | `std::cout << str[0];`                         |
| `at()`                | 访问字符串中指定位置的字符（带边界检查）。     | `std::cout << str.at(0);`                      |
| `substr()`            | 返回从指定位置开始的子字符串。                 | `std::string sub = str.substr(0, 5);`          |
| `find()`              | 查找子字符串在字符串中的位置。                 | `std::cout << str.find("sub") << std::endl;`   |
| `rfind()`             | 从字符串末尾开始查找子字符串的位置。           | `std::cout << str.rfind("sub") << std::endl;`  |
| `replace()`           | 替换字符串中的部分内容。                       | `str.replace(pos, length, "new_substring");`   |
| `append()`            | 在字符串末尾添加内容。                         | `str.append(" more");`                         |
| `insert()`            | 在指定位置插入内容。                           | `str.insert(pos, "inserted");`                 |
| `erase()`             | 删除指定位置的字符或子字符串。                 | `str.erase(pos, length);`                      |
| `clear()`             | 清空字符串。                                   | `str.clear();`                                 |
| `c_str()`             | 返回 C 风格的字符串（以 null 结尾）。          | `const char* cstr = str.c_str();`              |
| `data()`              | 返回指向字符数据的指针（C++11 及之后的版本）。 | `const char* data = str.data();`               |
| `compare()`           | 比较两个字符串。                               | `int result = str.compare("other");`           |
| `find_first_of()`     | 查找第一个匹配任意字符的位置。                 | `size_t pos = str.find_first_of("aeiou");`     |
| `find_last_of()`      | 查找最后一个匹配任意字符的位置。               | `size_t pos = str.find_last_of("aeiou");`      |
| `find_first_not_of()` | 查找第一个不匹配任意字符的位置。               | `size_t pos = str.find_first_not_of("aeiou");` |
| `find_last_not_of()`  | 查找最后一个不匹配任意字符的位置。             | `size_t pos = str.find_last_not_of("aeiou");`  |

**#include&lt;array&gt;**

定义一个固定大小的数组

std::array&lt;int,5&gt; a;

| `at(size_t pos)`       | 返回指定位置的元素，带边界检查   |
| ---------------------- | -------------------------------- |
| `operator[]`           | 返回指定位置的元素，不带边界检查 |
| `front()`              | 返回数组的第一个元素             |
| `back()`               | 返回数组的最后一个元素           |
| `data()`               | 返回指向数组数据的指针           |
| `size()`               | 返回数组大小（固定不变）         |
| `fill(const T& value)` | 将数组所有元素设置为指定值       |
| `swap(array& other)`   | 交换两个数组的内容               |
| `begin()` / `end()`    | 返回数组的起始/结束迭代器        |

**#include&lt;vector&gt;**

`<vector>` 是一个序列容器，它允许用户在容器的末尾快速地添加或删除元素。与数组相比，`<vector>` 提供了更多的功能，如自动调整大小、随机访问等。

基本操作：

a.push_back，a[0]，a.size()，a.clear()

初始化方法---

```c++
#include <iostream>
#include <vector>

int main() {
    std::vector<int> vec1;                  // 空的vector
    std::vector<int> vec2(5);               // 长度为5的vector，元素默认初始化
    std::vector<int> vec3(5, 10);           // 长度为5的vector，元素值为10
    std::vector<int> vec4 = {1, 2, 3, 4};   // 使用初始化列表初始化

    return 0;
}
```

| `push_back(const T& val)`   | 在末尾添加元素                   |
| --------------------------- | -------------------------------- |
| `pop_back()`                | 删除末尾元素                     |
| `at(size_t pos)`            | 返回指定位置的元素，带边界检查   |
| `operator[]`                | 返回指定位置的元素，不带边界检查 |
| `front()`                   | 返回第一个元素                   |
| `back()`                    | 返回最后一个元素                 |
| `data()`                    | 返回指向底层数组的指针           |
| `size()`                    | 返回当前元素数量                 |
| `capacity()`                | 返回当前分配的容量               |
| `reserve(size_t n)`         | 预留至少 `n` 个元素的存储空间    |
| `resize(size_t n)`          | 将元素数量调整为 `n`             |
| `clear()`                   | 清空所有元素                     |
| `insert(iterator pos, val)` | 在指定位置插入元素               |
| `erase(iterator pos)`       | 删除指定位置的元素               |
| `begin()` / `end()`         | 返回起始/结束迭代器              |

#include&lt;functional&gt;

C++ 标准库中的 `<functional>` 头文件提供了一组函数模板，这些模板允许我们使用函数对象（function objects）作为参数传递给算法，或者作为算法的返回值。函数对象是那些重载了 `operator()` 的对象，它们可以像普通函数一样被调用。

在 C++ 中，函数对象是一种特殊的类，它重载了 `operator()` 来允许对象像函数一样被调用。这使得我们可以将行为作为对象传递，增加了代码的灵活性和可重用性。

`<functional>` 头文件中定义了一些常用的函数对象，包括：

- `std::function`：一个通用的多态函数封装器。
- `std::bind`：用于绑定函数的参数。
- `std::plus`、`std::minus`、`std::multiplies`、`std::divides`、`std::modulus`：基本的算术操作。
- `std::equal_to`、`std::not_equal_to`、`std::greater`、`std::less`、`std::greater_equal`、`std::less_equal`：比较操作。
- `std::unary_negate`、`std::binary_negate`：逻辑否定操作。
- `std::logical_and`、`std::logical_or`、`std::logical_not`：逻辑操作。

更多还是用在调用函数上，例如--

```c++
#include <iostream>
#include <functional>

void greet() {
    std::cout << "Hello, World!" << std::endl;
}

int main() {
    std::function<void()> f = greet; // 使用函数
    f(); // 输出: Hello, World!

    std::function<void()> lambda = []() {
        std::cout << "Hello, Lambda!" << std::endl;
    };
    lambda(); // 输出: Hello, Lambda!

    return 0;
}
```

```c++
#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>

bool compare(int a, int b) {
    return a < b;
}

int main() {
    std::vector<int> v = {5, 3, 9, 1, 4};
    std::sort(v.begin(), v.end(), compare); // 使用自定义比较函数
    for (int i : v) {
        std::cout << i << " "; // 输出: 1 3 4 5 9
    }

    std::sort(v.begin(), v.end(), std::less<int>()); // 使用标准库比较函数对象
    //拓展，less<T>变成升序（从左到右遍历下标时，数组元素是从小到大） greater<T>变成降序（从左到右遍历下标时，数组元素是从大到小）
    for (int i : v) {
        std::cout << i << " "; // 输出: 1 3 4 5 9
    }

    return 0;
}
```

**#include&lt;numeric&gt;**

C++ 标准库中的 `<numeric>` 头文件提供了一组用于数值计算的函数模板，这些函数可以对容器中的元素进行各种数值操作，如求和、乘积、最小值、最大值等。这些函数模板非常强大，可以应用于任何类型的容器，包括数组、向量、列表等。

常用函数：accumulate（ accumulate(a,begin(),a.end(),0)，以0为初始值累加  ），inner_product（计算两个容器对应元素乘积之和，std::inner_product(v1.begin(), v1.end(), v2.begin(), 0) ），

adjacent_difference（计算容器相邻元素的差值，即为差分，std::adjacent_difference(v.begin(), v.end(), result.begin()) ），gcd（计算最大公约数），lcm（计算最小公倍数），min_element，max_element（查找最大，小值，一般适用于容器内）

#include&lt;complex&gt;

C++ 标准库提供了 `<complex>` 头文件，让你可以像处理普通数字一样轻松操作复数。

一个复数由实部（real part）和虚部（imaginary part）构成，形式：

```c++
z = a + bi
```

应用举例：

```c++
#include <iostream>
#include <complex>  // 复数头文件

int main() {
    std::complex<double> z1(3.0, 4.0); // 3 + 4i
    std::complex<double> z2(1.0, -2.0); // 1 - 2i

    std::cout << "z1 = " << z1 << std::endl;
    std::cout << "z2 = " << z2 << std::endl;
}
```

### 创建复数

```c++
std::complex<double> c(5.0, 3.0); // 创建一个复数 5 + 3i
```

### 访问实部和虚部

```c++
double realPart = c.real(); // 获取实部
double imagPart = c.imag(); // 获取虚部
```

常规运用：

```c++
#include <iostream>
#include <complex>

int main() {
    // 创建两个复数
    std::complex<double> c1(5.0, 3.0);   // 5 + 3i
    std::complex<double> c2(2.0, -4.0);  // 2 - 4i

    // 输出复数
    std::cout << "c1: " << c1 << std::endl;  // (5,3)
    std::cout << "c2: " << c2 << std::endl;  // (2,-4)

    // 复数加法
    std::complex<double> sum = c1 + c2;
    std::cout << "Sum: " << sum << std::endl;  // 7 - i

    // 复数减法
    std::complex<double> diff = c1 - c2;
    std::cout << "Difference: " << diff << std::endl;  // 3 + 7i

    // 复数乘法
    std::complex<double> product = c1 * c2;
    std::cout << "Product: " << product << std::endl;  // 22 - 14i

    // 复数除法
    std::complex<double> quotient = c1 / c2;
    std::cout << "Quotient: " << quotient << std::endl;  // -0.1 + 1.3i

    // 复数的共轭
    std::complex<double> conjugate = std::conj(c1);
    std::cout << "Conjugate of c1: " << conjugate << std::endl;  // 5 - 3i

    // 复数的模
    double modulus = std::abs(c1);
    std::cout << "Modulus of c1: " << modulus << std::endl;  // sqrt(34) ≈ 5.83095

    // 复数的辐角（弧度制）
    double argument = std::arg(c1);
    std::cout << "Argument of c1: " << argument << std::endl;  // atan(3/5) ≈ 0.54042 rad

    return 0;
}
```

**#include&lt;algorithm&gt;**

C++ 标准库中的 `<algorithm>` 头文件提供了一组用于操作容器（如数组、向量、列表等）的算法。这些算法包括排序、搜索、复制、比较等，它们是编写高效、可重用代码的重要工具。

函数：sort，partial_sort（部分区间排序 partial_sort(a.begin(),a.begin()+3,a.end())  )，stable_sort（稳定排序，保留相对位置），find（ auto it=find(a.begin(),a.end(),value) 存的是位置，若没找到，则为a.end() ），std::binary_search（二分查找，得先排序），find_if（查找第一个满足条件的元素），copy（ std::copy(a.begin(),a.end(),d) ，复制到d数组），equal（比较两个容器内元素是否相等，bool result = equal(first1, last1, first2, compare_function)），reverse（反转区间内的元素），fill（将制定区间内的元素赋值为某个值，fill(a.begin(),a.end(),0)），replace（将指定区间的元素替换为一个值），copy（将区间内的元素复制到另一个区间 vector&lt;int&gt;a;  copy(b.begin(),b.end(),a.begin())）

### 排列算法

**std::next_permutation**: 生成字典序的下一个排列，如果没有下一个排列则返回 false。

```c++
std::vector<int> vec = {1, 2, 3};
do {
    for (int n : vec) std::cout << n << " ";
    std::cout << std::endl;
} while (std::next_permutation(vec.begin(), vec.end()));
```

**std::prev_permutation**: 生成字典序的上一个排列。

```c++
std::prev_permutation(vec.begin(), vec.end());
```

### 归并算法

**std::merge**: 将两个有序区间合并到一个有序区间。

```c++
std::vector<int> vec1 = {1, 3, 5};
std::vector<int> vec2 = {2, 4, 6};
std::vector<int> result(6);
std::merge(vec1.begin(), vec1.end(), vec2.begin(), vec2.end(), result.begin());
```

**std::inplace_merge**: 在单个区间中合并两个有序子区间。

```c++
std::inplace_merge(vec.begin(), middle, vec.end());
```

###  集合算法

**std::set_union**: 计算两个有序集合的并集。

```c++
std::vector<int> result(10);
auto it = std::set_union(vec1.begin(), vec1.end(), vec2.begin(), vec2.end(), result.begin());
result.resize(it - result.begin());
```

**std::set_intersection**: 计算两个有序集合的交集。

```c++
auto it = std::set_intersection(vec1.begin(), vec1.end(), vec2.begin(), vec2.end(), result.begin());
result.resize(it - result.begin());
```

**std::set_difference**: 计算集合的差集。

```c++
auto it = std::set_difference(vec1.begin(), vec1.end(), vec2.begin(), vec2.end(), result.begin());
result.resize(it - result.begin());
```

### 其他有用算法

***\*std::accumulate\**（需要 &lt;numeric&gt; 库）**：计算范围内元素的累计和。

```c++
#include <numeric>
int sum = std::accumulate(vec.begin(), vec.end(), 0);
```

**std::for_each**: 对区间内的每个元素执行操作。

```c++
std::for_each(vec.begin(), vec.end(), [](int& x) { x += 1; });
```

**std::min_element** 和 **std::max_element**: 查找区间内的最小值和最大值。

```c++
auto min_it = std::min_element(vec.begin(), vec.end());
auto max_it = std::max_element(vec.begin(), vec.end());
```

#include&lt;iterator&gt;

迭代器是一个对象，它提供了一种方法来遍历容器中的元素。迭代器可以被视为指向容器中元素的指针，但它比指针更加灵活和强大。迭代器可以用于访问、修改容器中的元素，并且可以与 STL 算法一起使用。

示例使用----

```c++
#include <iostream>
#include <vector>
#include <iterator>

int main() {
    // 创建一个 vector 容器并初始化
    std::vector<int> vec = {1, 2, 3, 4, 5};

    // 使用迭代器遍历 vector
    for (std::vector<int>::iterator it = vec.begin(); it != vec.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << std::endl;

    // 使用 auto 关键字简化迭代器类型
    for (auto it = vec.begin(); it != vec.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << std::endl;

    // 使用 C++11 范围 for 循环
    for (int elem : vec) {
        std::cout << elem << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

**#include&lt;valarray&gt;**

C++ 的 `<valarray>` 库是一个用于数值计算的库，它提供了一种高效的方式来处理数值数组。`<valarray>` 库中的 `valarray` 类模板允许程序员对数组进行元素级的数学运算，包括加法、减法、乘法、除法等。此外，它还支持更高级的数学函数，如指数、对数、正弦、余弦等。

**#include&lt;chrono&gt;**

C++11 引入了 `<chrono>` 库，这是一个用于处理时间和日期的库。它提供了一套丰富的工具来测量时间间隔、执行时间点的计算以及处理日期和时间。`<chrono>` 库是 C++ 标准库中处理时间相关操作的核心部分。

### 使用时间点

```c++
auto now = std::chrono::system_clock::now();
```

### 使用持续时间

```c++
auto duration = std::chrono::seconds(5);
```

### 计算时间点

```c++
auto future_time = now + duration;
```

`<chrono>` 库也可以用来处理日期和时间。下面是一个使用 `std::chrono::system_clock` 和 `std::chrono::time_point` 来获取当前日期和时间的示例：

```c++
#include <iostream>
#include <chrono>
#include <ctime>

int main() {
    auto now = std::chrono::system_clock::now();
    std::time_t now_c = std::chrono::system_clock::to_time_t(now);

    std::cout << "Current date and time: " << std::ctime(&now_c);

    return 0;
}
```

**#include&lt;stack&gt;**

**#include&lt;list&gt;**

**#include&lt;set&gt;**

**#include&lt;cstdio&gt;**

`<cstdio>` 是 C++ 标准库中的一个头文件，它包含了 C 语言标准 I/O 库的 C++ 封装，主要用于文件的输入和输出操作。

`<cstdio>` 库定义了一组用于执行输入和输出操作的函数，这些函数可以用于读写文件和控制台。

`<cstdio>` 库中包含了许多用于文件 I/O 的函数，以下是一些常用的函数：

- `fopen`：打开文件。
- `fclose`：关闭文件。
- `fread`：从文件中读取数据。
- `fwrite`：向文件中写入数据。
- `fprintf`：向文件写入格式化输出。
- `fscanf`：从文件中读取格式化输入。
- `fgetc`：从文件中读取一个字符。
- `fputc`：向文件写入一个字符。
- `fgets`：从文件中读取一行。
- `fputs`：向文件写入一行。

**#include&lt;cstring&gt;**

包含的函数：memset（ memset(str,'@',6)，第一个是起始位置指针，是一种特殊用法），strcpy，strncpy，strcat，strncat（数字都放后面）strcmp（相等返回0,1&lt;2返回小于0的数，1&gt;2返回大于0的数），strchr（寻找某个字符第一次出现的位置），strstr（在一个字符数组查找另一个字符数组第一次出现的位置）

示例：

```c++
int main () {
    char str[] = "This is a sample string";
    char * pch;
    printf ("Looking for the 's' character in \"%s\"...\n", str);
    pch = strchr(str, 's');
    while (pch ! =NULL) {
        printf ("found at %d\n", pch - str + 1);
        pch = strchr(pch + 1, 's');
    }
    return 0;
}
//Looking for the ‘s’ character in “This is a sample string”…
//found at 4
//found at 7
//found at 11
//found at 18
```

```c++
int main () {
    char str[] = "This is a simple string";
    char * pch;
    pch = strstr (str, "simple");
    strncpy (pch, "sample", 6);
    puts (str);
    return 0;
}
```

#include&lt;climits&gt;

包含INT_MAX，INT_MIN，CHAR_MAX，ULONG_MAX（unsigned long类型最大值）

具体请参考：[C++ 标准库 | 菜鸟教程](https://www.runoob.com/cplusplus/cpp-standard-library.html)

[C++ 标准库头文件 - cppreference.cn - C++参考手册](https://cppreference.cn/w/cpp/header)
