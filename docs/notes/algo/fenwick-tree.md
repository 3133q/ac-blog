# 树状数组

## 简介

树状数组是一种支持单点修改，区间查询的代码量小的数据结构，也是众多OIer心中最简洁优美的数据结构之一

- **[单点修改](https://zhida.zhihu.com/search?content_id=108973091&content_type=Article&match_order=1&q=单点修改&zhida_source=entity)**：更改数组中一个元素的值
- **[区间查询](https://zhida.zhihu.com/search?content_id=108973091&content_type=Article&match_order=1&q=区间查询&zhida_source=entity)**：查询一个区间内所有元素的和

对于树状数组，单点修改应该大差不差，但有些题在区间查询上可能会降低难度，比如求出某个点的数值，而非某个区间，这里的函数编写可能会有些不同，下面我来详细讲述

## 模板题

[P3374 【模板】树状数组 1 - 洛谷](https://www.luogu.com.cn/problem/P3374)

题目描述大致是：已知一个数列，需要进行两种操作

1. 将某一个数加上 *x*；
2. 求出某区间每一个数的和。

看到这个，很明显该使用树状数组了（当然也可以使用线段树），从单点查询开始讲起

## 思路

引入：对于普通数组来说，单点修改的时间复杂度为O(1)，但区间求和的时间复杂度为O(n)

![img](https://pic3.zhimg.com/v2-5652a46124eaa79fafae0558253e6a80_1440w.jpg)

当然，对于区间和的查询，可以使用前缀和的方法，这样时间复杂度降低到O(1)，但是单点修改后又得重新修改，可麻烦了。。。

对于区间求和，我们前缀和的思路是没有问题的，实际求个前n项和就行了，关于数组的维护，有个自然的想法：可以用C数组维护若干个小区间，单点修改时，只更新包含这一元素的区间；求n项和时，通过将区间进行组合，得到1-n的区间，然后对所有用到的区间求和（哈哈哈 这其实就是树状数组呀）

树状数组本质上就是二进制存值（实际上，树状数组的英文名BIT，直译就是二进制下标树）。；例如11，二进制就是（1011），如果我们要求前11项和，可以分别查询((0000),(1000)) ((1000),(1010)),((1010),(1011))的和再相加，这三个数其实就是不断去1的过程

![img](https://pic2.zhimg.com/v2-a53a897f22763ef04a728f8263f06547_1440w.jpg)

### lowbit 的概念

**这里，引入一个定义lowbit，定义为二进制最右边一个1，连带着它之后的0为lowbit(x)，**![img](https://pic3.zhimg.com/v2-df001651925903a86ab640482b78c2d6_1440w.jpg)

看这幅图可能会难以理解，看下面先理解理解。

![img](https://oi-wiki.org/ds/images/fenwick.svg)

本质上就是爬树的过程，C数组每个值都存着a数组某区间的和，这样一层一层地往上找，直到求出解！

### 查询过程

𝑐![c](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 数组就是用来储存原始数组 𝑎![a](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 某段区间的和的，也就是说，这些区间的信息是已知的，我们的目标就是把查询前缀拆成这些小区间．

例如，从图中可以看出：

- 𝑐2![c_2](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 管辖的是 𝑎[1…2]![a[1 \ldots 2]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)；
- 𝑐4![c_4](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 管辖的是 𝑎[1…4]![a[1 \ldots 4]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)；
- 𝑐6![c_6](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 管辖的是 𝑎[5…6]![a[5 \ldots 6]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)；
- 𝑐8![c_8](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 管辖的是 𝑎[1…8]![a[1 \ldots 8]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)；
- 剩下的 𝑐[𝑥]![c[x]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 管辖的都是 𝑎[𝑥]![a[x]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 自己（可以看做 𝑎[𝑥…𝑥]![a[x \ldots x]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 的长度为 1![1](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 的小区间）．

不难发现，𝑐[𝑥]![c[x]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 管辖的一定是一段右边界是 𝑥![x](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 的区间总信息．我们先不关心左边界，先来感受一下树状数组是如何查询的．

举例：计算 𝑎[1…7]![a[1 \ldots 7]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 的和．

过程：从 𝑐7![c_{7}](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 开始往前跳，发现 𝑐7![c_{7}](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 只管辖 𝑎7![a_{7}](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 这个元素；然后找 𝑐6![c_{6}](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)，发现 𝑐6![c_{6}](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 管辖的是 𝑎[5…6]![a[5 \ldots 6]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)，然后跳到 𝑐4![c_{4}](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)，发现 𝑐4![c_{4}](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 管辖的是 𝑎[1…4]![a[1 \ldots 4]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 这些元素，然后再试图跳到 𝑐0![c_0](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)，但事实上 𝑐0![c_0](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 不存在，不跳了．

我们刚刚找到的 𝑐![c](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 是 𝑐7,𝑐6,𝑐4![c_7, c_6, c_4](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)，事实上这就是 𝑎[1…7]![a[1 \ldots 7]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 拆分出的三个小区间，合并得到答案是 𝑐7 +𝑐6 +𝑐4![c_7 + c_6 + c_4](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)．

举例：计算 𝑎[4…7]![a[4 \ldots 7]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 的和．

我们还是从 𝑐7![c_7](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 开始跳，跳到 𝑐6![c_6](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 再跳到 𝑐4![c_4](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)．此时我们发现它管理了 𝑎[1…4]![a[1 \ldots 4]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 的和，但是我们不想要 𝑎[1…3]![a[1 \ldots 3]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 这一部分，怎么办呢？很简单，减去 𝑎[1…3]![a[1 \ldots 3]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 的和就行了。。那不妨考虑最开始，就将查询 𝑎[4…7]![a[4 \ldots 7]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 的和转化为查询 𝑎[1…7]![a[1 \ldots 7]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 的和，以及查询 𝑎[1…3]![a[1 \ldots 3]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 的和，最终将两个结果作差．

### 管辖区间

管辖区间：要想顺利地一步步跳，就得知道相应的管辖区间，以及a数组每个区间的和

树状数组中，规定c[x]管辖的区间长度是2^k，其中，k代表二进制表示中最低位1所在的位数，所以2^k也表示二级制数最低位1以及后面所有0.

举个例子，c[88]，88=01011000，其二进制最低位1以及后边的0组成1000，表示8，所以它管辖8个a数组中的元素，所以，c[88]代表a[81....88]的区间信息。其实也就是88-（1000）+1

## 算法核心

首先解决lowbit如何计算的问题，这里采取位运算and，运用反码补码的原理



![img](https://pic3.zhimg.com/v2-fd4b485006b55bfd45c13f4348e1e1ee_1440w.jpg)

我们可以知道，一个数取负数会先反码，然后加一以补码的形式表示，这样正好可以定位最末尾一个1，然后后面全部补0，代码表示：   x&-x

### 单点修改

```cpp
int tree[MAXN];
inline void update(int i, int x)
{
    for (int pos = i; pos < MAXN; pos += lowbit(pos))
        tree[pos] += x;
}
```

注意，这里从i（要进行修改的位置）出发，然后一直累加值直到maxn（满的状态），之所以要加到顶是为了后面处理前n项和的问题，本质上采用了前缀和思想，需要将该点往后都加上要求数，最后相减求区间和

### 求前n项和

```cpp
inline int add(int n)
{
    int ans = 0;
    for (int pos = n; pos; pos -= lowbit(pos))
        ans += tree[pos];
    return ans;
}
```

这里很好理解，就是求前n项和，从n开始，往前递推，直到0为止但不能取到0，每次都以lowbit(i)递减，一步步累加到ans里面，然后前缀和思路求和即可

### 区间查询

```cpp
inline int query(int a, int b)
{
    return query(b) - query(a - 1);
}
```

## 完整代码

讲述完毕，下面给出模版一的代码：

```cpp
#include<bits/stdc++.h>
using namespace std;
const int maxn=1e6+2;
int n,m;
int tree[maxn+4],x[maxn+3];
int lowbit(int x){
	return x&-x;
}
inline void update(int i,int x){
	for(int pos=i;pos<maxn;pos+=lowbit(pos)){
		tree[pos]+=x;
	}
}
int add(int x){
	int ans=0;
	for(int pos=x;pos!=0;pos-=lowbit(pos)){
		ans+=tree[pos];
	}
	return ans;
}
int query(int a,int b){
	return add(b)-add(a-1);
}
int main(){
	std::cin>>n>>m;
	for(int i=1;i<=n;i++){
		std::cin>>x[i];
		update(i,x[i]);
	}
	int a,xx,yy,k,xxx,yyy;
	for(int i=1;i<=m;i++){
		std::cin>>a;
		if(a==1){
			std::cin>>xx>>k;
			update(xx,k);
		}
		else if(a==2){
			std::cin>>xxx>>yyy;
			std::cout<<query(xxx,yyy)<<'\n';
		}
	}
	return 0;
}
```
