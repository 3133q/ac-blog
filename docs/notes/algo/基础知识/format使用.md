# format使用

## 优点

std:format与旧方法相比：

相比std::cout    它需要多次流操作，比如要输出 std::cout &lt;&lt; "Hello, " &lt;&lt; name &lt;&lt; "!" ，性能太低

对比format，一次性生成字符串，更高效且易读。

相比sprintf    它不安全（无类型检查，缓冲区溢出风险）

对比format，类型自动识别转换，避免上述问题。

## 介绍

std::format是一个函数模板，位于&lt;format&gt;头文件中，用于将参数格式化为字符串，比起c++其他输出方式（std::cout  std::stringstream）更安全高效。

## 模板

```c++
cpp std::string std::format(const std::string_view fmt, Args&&... args);
```

- fmt 是一个格式字符串（通常是字符串字面量），包含占位符 {}。
- args 是要插入到占位符中的参数。
- 返回值是一个格式化后的 std::string。

## 例子

### 一

```cpp
#include <format>
#include <iostream>

int main() {
    std::string s = std::format("Hello, {}! You are {} years old.", "Alice", 25);
    std::cout << s << "\n"; // 输出: Hello, Alice! You are 25 years old.
}
```

- {} 是占位符，按顺序匹配后面的参数。
- 参数可以是多种类型（整数、浮点数、字符串等），std::format 会自动处理类型转换

### 二

(1) **位置占位符**

你可以显式指定参数的位置：

```cpp
std::string s = std::format("Order: {1}, {0}", "first", "second");
std::cout << s << "\n"; // 输出: Order: second, first
```

- {0} 引用第一个参数，{1} 引用第二个参数。

(2) **[格式说明符](https://zhida.zhihu.com/search?content_id=256631158&content_type=Article&match_order=1&q=格式说明符&zhida_source=entity)**

占位符可以包含格式说明符（类似 printf 的语法），用冒号 : 分隔。例如：

```cpp
std::string s = std::format("Value: {:6d}", 42); // 6个字符宽度的十进制整数
std::cout << s << "\n"; // 输出: Value:     42 (前面有4个空格)
```

- d 表示十进制整数。
- 6 指定宽度。

(3) **浮点数格式**

支持多种浮点数格式：

cpp

```cpp
double pi = 3.14159;
std::cout << std::format("Pi: {:.2f}", pi) << "\n"; // 输出: Pi: 3.14 (2位小数)
std::cout << std::format("Pi: {:e}", pi) << "\n";  // 输出: Pi: 3.141590e+00 (科学计数法)
```

(4) **自定义类型支持**

如果你的类型定义了格式化支持（通过特化 std::formatter），也可以使用 std::format：

cpp

```cpp
struct Person {
    std::string name;
    int age;
};

template <>
struct std::formatter<Person> {
    constexpr auto parse(std::format_parse_context& ctx) { return ctx.begin(); }
    auto format(const Person& p, std::format_context& ctx) const {
        return std::format_to(ctx.out(), "Name: {}, Age: {}", p.name, p.age);
    }
};

int main() {
    Person p{"Bob", 30};
    std::cout << std::format("Person: {}", p) << "\n"; // 输出: Person: Name: Bob, Age: 30
}
```

(5) **[动态宽度和精度](https://zhida.zhihu.com/search?content_id=256631158&content_type=Article&match_order=1&q=动态宽度和精度&zhida_source=entity)**

C++23 扩展了 std::format，支持动态宽度和精度：

cpp

```cpp
int width = 8;
std::cout << std::format("{:*^{}}", "center", width) << "\n"; // 输出: **center** (居中，宽度8)
```

- {:*^{}} 表示用 * 填充，宽度由参数 width 提供。

## 更高端的应用

[【C++】C++20：std::format（格式化输出）-CSDN博客](https://blog.csdn.net/weixin_43510208/article/details/148313945)

参考这个博客。。。
