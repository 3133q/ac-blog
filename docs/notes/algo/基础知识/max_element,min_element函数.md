max_element函数

在c++中，std::max_element是一个标准库算法，定义在&lt;algorithm&gt;算法库里，用于在指定范围内查找最大元素的迭代器，时间复杂度O(n)

取数组中元素最大值的下标

```c++
vector<int> a;
int maxvalue_index = max_element(a.begin(), a.end()) - a.begin();
int b[N]; // 设长度为n
int maxvalue_index = max_element(b, b + n) - b;
```

取数组在区间[l,r)最大值下标

```c++
vector<int> nums;
int maxvalue_index = max_element(nums.begin() + l, nums.begin() + r) - nums.begin();
```

注意：在取数组下标时，一定记得减去数组首下标！！！！

取数组中元素的最大值，则只要前面加*即可

```c++
vector<int> a;
int max_value = *max_element(a.begin(), a.end());
int b[N]; // 设长度为n
int max_value = *max_element(b, b + n);
```

取元素就无需减去了，因为迭代器找到的位置就是元素所在位置。

对于min_element也是一样，只不过他是求最小元素罢了。。。
