map容器

map是c++标准模板库（STL）的一部分，它提供了一种容器，用于存储键值对，map容器里的元素是按键的顺序自动排序的，使得它在快速查找和有序数据的要求下显得突出。

**定义与特性**

- **键值对**：`map` 存储的是键值对，其中每个键都是唯一的。
- **排序**：`map` 中的元素按照键的顺序自动排序，通常是升序。
- **唯一性**：每个键在 `map` 中只能出现一次。
- **双向迭代器**：`map` 提供了双向迭代器，可以向前和向后遍历元素。

头文件   #include&lt;map&gt;

声明map容器   std::map&lt;key_type,value_type&gt;Map；

- `key_type` 是键的类型。
- `value_type` 是值的类型。

例如： Map[key]=value；

遍历时可采用for循环     for(auto &p:m)  std::cout&lt;&lt;p.first&lt;&lt;" "&lt;&lt;p.second;

其实map本质上存储键值对，理解这个键值对可以想象为一个数组，键就是数组的下标，值就是元素

函数：

检查键是否存在     if(Map.find(key)!=Map.end())  存在

删除     Map.erase(key)

清空     Map.clear()

获取大小     size_t size=Map.size()

```c++
myMap.empty();      // 是否为空
myMap.count("Bob"); // key 是否存在（返回 0 或 1）
std::map<int, std::string, std::greater<int>> m;  // 降序
```
