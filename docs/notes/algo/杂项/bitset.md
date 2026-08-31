# bitset

## 介绍

std::bitset是标准库中一个存储0/1的大小不可变容器

> > The C++ standard library provides some special container classes, the so-called container adapters (stack, queue, priority queue). In addition, a few classes provide a container-like interface (for example, strings, bitsets, and valarrays). All these classes are covered separately.1 Container adapters and bitsets are covered in Chapter 12.
> >
> > The C++ standard library provides not only the containers for the STL framework but also some containers that fit some special needs and provide simple, almost self-explanatory, interfaces. You can group these containers into either the so-called container adapters, which adapt standard STL containers to fit special needs, or a bitset, which is a containers for bits or Boolean values. There are three standard container adapters: stacks, queues, and priority queues. In priority queues, the elements are sorted automatically according to a sorting criterion. Thus, the "next" element of a priority queue is the element with the "highest" value. A bitset is a bitfield with an arbitrary but fixed number of bits. Note that the C++ standard library also provides a special container with a variable size for Boolean values: vector.
>
> ——摘自《The C++ Standard Library 2nd Edition》

由此看来，bitset并不属于STL，而是一种标准库中的“Special Container"，事实上，它作为一种容器，并不满足STL容器的要求，说它是适配器，它也不依赖其他STL容器作为底层实现

## 优势

由于内存地址是按照byte寻址，而非bit，一个bool类型的变量，虽然只能表示0/1，但是也占了1byte的内存

bitset就是通过固定的优化，使得一个字节的八个bit能分别存储8位的0/1

对于一个4字节的int变量，在只存0/1的意义下，bitset占用空间只是其1/32，计算一些信息时，所需时间也是1/32，也就是优化了效率

## 正题

### 头文件

#include&lt;bitset&gt;

### 指定大小

std::bitset&lt;1000&gt;bs;

bitset()每一位初始为0

### 成员函数

count()：返回1的数量

size()：返回bitset的大小

test(pos)：越界检查

any()：若存在某一位是1返回1，否则返回0

none()：若所有位都是0返回1，否则返回0

all()：若所有位都是1则返回1，否则返回0

a.set()：将整个bitset设置为1

b.set(pos,val=1)：将某一位设置为1/0

a.reset()：将整个bitset设置为0

b.reset(pos)：将某一位设置为0

a.flip()：翻转每一位

## 例题

### 一

[简单瞎搞题](https://ac.nowcoder.com/acm/problem/17193)

#### 题目大意

<img src="/images/image-20260314145209597.png" alt="image-20260314145209597" style="zoom:80%;" />

#### 分析

其实这道题跟砝码称重那道题很像，都是问种类数，以后遇到这种题，想到用bitset优化，因为本来就是涉及0/1的问题，状态转移使用|，因为0|1=1|0=1|1=1，0|0=0，也就是说只要前面的状态得到了更新，那么由他推出的状态也一样可以凑出来！

#### 代码

```c++
#include<iostream>
#include<cstring>
#include<bitset>
using namespace std;
const int N=1e6+5;
bitset<N>f[200];
int main(){
    int n,l[200],r[200];
    std::cin>>n;
    for(int i=1;i<=n;i++) std::cin>>l[i]>>r[i];
    f[0].set(0);
    for(int i=1;i<=n;i++) {
        for(int j=l[i];j<=r[i];j++){
            f[i]|=(f[i-1]<<(j*j));
        }
    }
    std::cout<<f[n].count();
    return 0;
}
```

可以把这道题的种类数当做1的出现位置，比如说25当成第25位是1，以此类推。。。

---

### 二

#### 题目大意

大概题意是给你n个集合（n&lt;=1000）每个集合最多10000个数，每个数最大为10000，最多2e5次查询，询问是否存在x，y是否在同一个集合中。

#### 分析

这道题其实很经典，用bitset卡过去，因为bitset能将时间缩减为1/32，能正好卡住时间复杂度！

#### 代码

```c++
#include <cstdio>
#include <cstring>
#include <bitset>
#define RE(i,a,b) for(int i = a; i <= b; ++i)
using namespace std;
const int N = 1e4 + 10;
int n, q;
bitset<N> f[1010];
signed main()
{
    scanf("%d", &n);
    RE(i, 1, n)
    {
        int m, x;
        scanf("%d", &m);
        RE(j, 1, m)
        {
            scanf("%d", &x);
            f[i][x] = 1;
        }
    }
    int l, r;
    scanf("%d", &q);
    while(q-- && scanf("%d %d", &l, &r))
    {
        int tag = 0;
        RE(i, 1, n)
        {
            if(f[i][l] && f[i][r])
            {
                tag = 1;
                break;
            }
        }
        printf("%s\n", tag ? "Yes" : "No");
    }
    return 0;
}
```

---

### 三

> 提高题
>
> [Problem - 7140](https://acm.hdu.edu.cn/showproblem.php?pid=7140)

#### 题目大意

<img src="/images/image-20260314151359985.png" alt="image-20260314151359985" style="zoom:80%;" />

#### 分析

其实就是背包问题的变种，要求的是保证背包装满的前提使每个价值异或和最大

基本处理：使用三维dp去状态转移，dp[i] [j] [k]表示前i个物品，异或和为j的前提，能否达到k的容积，但如果我们真的使用三维，肯定超时。。因此，需要优化

第三维当做bitset去优化，把前两维当做一个状态，然后将容积当成是第几位赋值1，直接bitset优化，同时，第一维处理上，使用0和1去模拟前一次和当前次，使用i&1即可，因为奇数就是0，偶数为1，因为这里是限制了的，要求异或和作为一维出现，也就是说不一定就能达到这个异或和，所以第一维不能省略，具体解释如下：

> 当状态转移方程只涉及到上一行的元素时，可以使用一**维DP**数组。 这样能够降低空间复杂度，使算法更为简洁。 如果问题中只需要考虑当前状态和前一个状态之间的关系，而不需要考虑更远的状态，可以选择使用一**维DP**数组。 当状态转移方程涉及到上一行和当前行的元素时，通常需要使用**二维DP**数组。

#### 代码

```c++
#include <bits/stdc++.h>  
using namespace std;  
  
const int N = 1030;  
  
int n, m;  
bitset<N> f[2][N]; // f(i, j)表示前i个物品，组成异或值为j时，所有可能的体积状态  
  
void solve () {  
    scanf("%d%d", &n, &m);  
    for (int i = 0; i < 1024; i ++ ) f[0][i].reset();  
    f[0][0].set(0);  
    for (int i = 1; i <= n; i ++ ) {  
        int v, w; scanf("%d%d", &v, &w);  
        for (int j = 0; j < 1024; j ++ ) {  
            f[i&1][j] = f[(i&1)^1][j] | (f[(i&1)^1][j^w] << v);  
        }  
    }  
    for (int i = 1023; i >= 0; i -- )  
        if (f[n&1][i][m]) return printf("%d\n", i), void();  
    printf("-1\n");  
}  
  
int main () {  
//    cin.tie(nullptr); ios::sync_with_stdio(false);  
    int ts; scanf("%d", &ts); while(ts -- ) solve();  
    return 0;  
}
```

