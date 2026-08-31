# 求k倍连续区间数量

题目：[P8649 [蓝桥杯 2017 省 B\] k 倍区间 - 洛谷](https://www.luogu.com.cn/problem/P8649)

## 分析

这道题乍一看，第一眼肯定会想着暴力，先前缀和算一下，然后暴力枚举，开个两重for，然后去遍历就完事了，但是实则不然

![image-20260410234338820](/images/image-20260410234338820.png)

看到这个，然后再看看N的取值范围

![image-20260411000807842](/images/image-20260411000807842.png)

这显然说明，肯定不能O(n^2)啊，因为2s最多跑2*1e8，这样绝对TLE。。。

![image-20260411000917292](/images/image-20260411000917292.png)

就像这样。。。

## 正解

利用同余的性质去计算区间数量

例如 k=3的时候，对于序列 1 3 1 2

1 3 1 2 前缀和分别为

1 4 5 7  可以发现4和7对3取模都是1，也就是同余，很自然的发现，直接dj-di，剩下的区间就是1+2=3，自然就满足了k的倍数！

所以说只需要用map记录一下余数分别是0,1,2,...的对应前缀和的区间的个数，然后排列组合，只要在这些同余数的前缀和里边任取两个，也就能得到一个区间，公式
$$
C_{x}^{2}=\frac{x(x-1)}{2}
$$
但这里要注意，余数为0的情况需要特殊考虑，因为余数为0肯定包含一个数的情况，最后的结果要多加个x，也就是x会相对原先加1，所以我们直接mp[0]=1就可以了

也可以这么理解，我将0这个位置的前缀和设为0，这样对k取模之后也是0，然后我后面处理一个数的情况也同样把这个数和第0个数组合，正常套用公式，这就是让mp[0]=1的妙处所在！

## 代码

```c++
#include<iostream>
#include<cstdio>
#include<cstring>
#include<cmath>
#include<vector>
#include<map>
#include<algorithm>
#include<climits>
#define int long long
using namespace std;
const int N=1e5+2;
signed main(){
	map<int,int>mp;
	mp[0]=1;
	int n,k,t;
	int ans=0,sum=0;
	std::cin>>n>>k;
	for(int i=1;i<=n;i++) {
		std::cin>>t;
		sum+=(t%k);
		mp[sum%k]++;
		sum%=k;
	}
	for(int i=0;i<k;i++){
		ans+=(mp[i]*(mp[i]-1))/2;
	}
	std::cout<<ans;
	return 0;
}
// 1 3 1 2   3
   //4 5 7
```

