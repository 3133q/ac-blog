lower_bound函数，upper_bound函数----（非迭代器版，对于普通数组）

首先，得对于一个升序的数列，这个数列是（非严格）单调递增的，至于下标开始的位置，可以是0或是1，但在后面其实位置考虑+0或+1

lower_bound(a+1,a+1+n,x) 会返回 a[1..n] 中所有 ≥x 的元素里面最小的那个数的地址，也就是说，如果 a[p−1]&lt;x≤a[p]≤a[p+1]≤... ，则 lower_bound 函数会返回 a[p] 的地址，不存在则会返回end。

因为 a[p] 的地址可以表示为 a+p，而 a （a=a+0）表示的是 a[0] 的地址，所以

```c++
int p = lower_bound(a+1, a+n+1, x) - a;
```

就能够获得 a[p] 的下标 p 了。p 对应的是所有 ≥x 的元素的下标的最小值。

也就是说：此时下标 p 对应的 a[p] 是最靠前的 ≥x 的那个数。

特殊地，如果 a[1..n] 范围内的所有数都 &lt;x，则 p 对应 n+1（查找的范围是 a[1..n] 后一个位置的数）。

对于 upper_bound( a,a+n,x)： 从数组的begin位置到end-1位置二分查找第一个**大于x**的数字，找到返回该数字的地址，不存在则返回end。通过返回的地址减去起始地址begin,得到找到数字在数组中的下标。



- lower_bound：≥x

- upper_bound：&gt;x

  

具体参考    [C++数组中lower_bound和upper_bound函数的用法 - quanjun - 博客园](https://www.cnblogs.com/quanjun/p/18311661)

[lower_bound()和upper_bound()在数组中的使用(非迭代器版)_lower bound怎么在上升的数组中使用-CSDN博客](https://blog.csdn.net/qq_33437973/article/details/94954864)



lower_bound函数，upper_bound函数----（迭代器版，对于stl库的使用）

大概内容与上述相似，只是多了vector动态数组的begin(),end()的使用

参考学习  [C++ STL: lower_bound 和 upper_bound 的用法及区别 - 知乎](https://zhuanlan.zhihu.com/p/20828283597)

