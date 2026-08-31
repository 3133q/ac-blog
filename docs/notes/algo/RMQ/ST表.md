ST表

ST表通常用来解决可重复贡献问题，**可重复贡献问题**是指在某些运算中，区间的重叠部分不会影响最终结果。例如，区间最大值和最小值查询属于此类问题，因为对于这些运算，满足 *x op x = x* 的性质。常见的数据结构如 **ST 表（Sparse Table）** 可以高效解决这类问题，不仅如此，最大值有 max(𝑥,𝑥) =𝑥![\max(x,x)=x](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)，gcd 有 gcd⁡(𝑥,𝑥) =𝑥![\operatorname{gcd}(x,x)=x](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)，所以 RMQ 和区间 GCD 就是一个可重复贡献问题。像区间和就不具有这个性质，如果求区间和的时候采用的预处理区间重叠了，则会导致重叠部分被计算两次，这是我们所不愿意看到的。另外，opt![\operatorname{opt}](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 还必须满足结合律才能使用 ST 表求解。

ST 表基于 [倍增](https://oi-wiki.org/basic/binary-lifting/) 思想，可以做到 Θ(𝑛log⁡𝑛)![\Theta(n\log n)](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 预处理，Θ(1)![\Theta(1)](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 回答每个询问。但是不支持修改操作。

基于倍增思想，我们考虑如何求出区间最大值。可以发现，如果按照一般的倍增流程，每次跳 2𝑖![2^i](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 步的话，询问时的复杂度仍旧是 Θ(log⁡𝑛)![\Theta(\log n)](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)，并没有比线段树更优，反而预处理一步还比线段树慢。

我们发现 max(𝑥,𝑥) =𝑥![\max(x,x)=x](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)，也就是说，区间最大值是一个具有「可重复贡献」性质的问题。即使用来求解的预处理区间有重叠部分，只要这些区间的并是所求的区间，最终计算出的答案就是正确的。

如果手动模拟一下，可以发现我们能使用至j多两个预处理过的区间来覆盖询问区间，也就是说询问时的时间复杂度可以被降至 Θ(1)![\Theta(1)](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)，在处理有大量询问的题目时十分有效。

具体实现如下：

令 𝑓(𝑖,𝑗)![f(i,j)](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 表示区间 [𝑖,𝑖 +2𝑗   −1]![[i,i+2^j-1]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 的最大值。（2j是2的j次方)

显然 𝑓(𝑖,0) =𝑎𝑖![f(i,0)=a_i](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)。

根据定义式，第二维就相当于倍增的时候「跳了 2𝑗   −1![2^j-1](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 步」，依据倍增的思路，写出状态转移方程：𝑓(𝑖,𝑗) =max(𝑓(𝑖,𝑗 −1),𝑓(𝑖 +2𝑗−1,𝑗 −1))![f(i,j)=\max(f(i,j-1),f(i+2^{j-1},j-1))](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)。

![img](https://oi-wiki.org/ds/images/st-preprocess-lift.svg)

以上就是预处理部分。而对于查询，可以简单实现如下：

对于每个询问 [𝑙,𝑟]![[l,r]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)，我们把它分成两部分：[𝑙,𝑙 +2𝑠 −1]![[l,l+2^s-1]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7) 与 [𝑟 −2𝑠 +1,𝑟]![[r-2^s+1,r]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)，其中 𝑠 =⌊log2⁡(𝑟−𝑙+1)⌋![s=\left\lfloor\log_2(r-l+1)\right\rfloor](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)。两部分的结果的最大值就是回答。

![ST 表的查询过程](https://oi-wiki.org/ds/images/st-query.svg)

根据上面对于「可重复贡献问题」的论证，由于最大值是「可重复贡献问题」，重叠并不会对区间最大值产生影响。又因为这两个区间完全覆盖了 [𝑙,𝑟]![[l,r]](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)，可以保证答案的正确性。

模板题：[P3865 【模板】ST 表 & RMQ 问题 - 洛谷](https://www.luogu.com.cn/problem/P3865)

```c++
#include <algorithm>
#include <iostream>
using namespace std;
const int N=1e5+6;
int f[20][N],logn[N];
inline int read()
{
	int x=0,f=1;char ch=getchar();
	while (ch<'0'||ch>'9'){if (ch=='-') f=-1;ch=getchar();}
	while (ch>='0'&&ch<='9'){x=x*10+ch-48;ch=getchar();}
	return x*f;
}
void pre(){
	logn[2]=1;
	for(int i=3;i<N;i++){
		logn[i]=logn[i/2]+1;
	}
}
int main(){
	ios::sync_with_stdio(0);
	cout.tie(0);
	int n,m,l,r;
	pre();
	n=read(),m=read();
	for(int i=1;i<=n;i++) f[0][i]=read();
	for(int j=1;j<=20;j++){
		for(int i=1;i+(1<<j)-1<=n;i++){
			f[j][i]=max(f[j-1][i],f[j-1][i+(1<<(j-1))]);
		}
	}
	for(int i=1;i<=m;i++){
		l=read(),r=read();
		int s=logn[r-l+1];
		std::cout<<max(f[s][l],f[s][r-(1<<s)+1])<<'\n';
	}
	return 0;
}
```

read函数是快读模板

注意：std::endl是个坑，它读入的速度比较慢，对于该题输入数据多的，会导致超时

改为'\n'即可

倍增法的例题--

给出一个长度为 n 的环和一个常数 k，每次可以从第 i 个点跳到第 (i + k) mod (n+1) 个点，总共跳 m 次。第 i 个点的权值为 a[i]，求 m 次跳跃的起点的权值之和 mod 1e9 + 7 
数据范围：1≤n≤106,1≤m≤1018,1≤k≤n,0≤a[i]≤109

**问题分析**
这里显然不能暴力模拟跳 m 次。因为 最大可到 1e18 级别，如果暴力模拟的话，时间承受不住。
所以就需要进行一些预处理，提前整合一些信息，以便于在查询的时候更快得出结果。如果记录下来每一个可能的跳跃次数的结果的话，不论是时间还是空间都难以承受。
倍增思想：每个数都可以表示成二进制的形式， 对于从每个点开始的 2i 步，记录一个 go[i][x] 表示第 x 个点跳 2i 步之后的终点，而 sum[i] [x] 表示第 x 个点跳 2i 步之后能获得的点权和。对于跳 2i 步的信息，预处理的时候可以看作是先跳了 2i−1 步,再跳了 2i−1 步。
即有 sum[i] [x]=sum[i−1] [x]+sum[i−1] [go[i−1] [x]]，且go[i] [x]=go[i−1] [go[i−1] [x]] 。
例如，从1到14的整个跳跃过程由 23+22+20 三步组成。也就是说，对于环上这 n 个位置，预处理出每一个位置向前跳 1, 2, 4, ... 次的位置，则必然能够到达 m。

参考代码

```c++
#include <bits/stdc++.h>
using namespace std;
const int mod = 1000000007;
int modadd(int a, int b) {
  if (a + b >= mod) return a + b - mod;  // 减法代替取模，加快运算
  return a + b;
}
int vi[1000005];
int go[75][1000005];  // 将数组稍微开大以避免越界，小的一维尽量定义在前面
int sum[75][1000005];
int main() {
  int n, k;
  scanf("%d%d", &n, &k);
  for (int i = 1; i <= n; ++i) {
    scanf("%d", vi + i);
  }
  for (int i = 1; i <= n; ++i) {
    go[0][i] = (i + k) % n + 1;
    sum[0][i] = vi[i];
  }

//int logn = 31 - __builtin_clz(n);  // 一个快捷的取对数的方法
  int logn = 65;
  for (int i = 1; i <= logn; ++i) {
    for (int j = 1; j <= n; ++j) {
      go[i][j] = go[i - 1][go[i - 1][j]];
      sum[i][j] = modadd(sum[i - 1][j], sum[i - 1][go[i - 1][j]]);
    }
  }

  long long m;
  scanf("%lld", &m);
  int ans = 0;
  int curx = 1;
  for (int i = 0; m; ++i) {
    if (m & (1 << i)) {  // 参见位运算的相关内容，意为 m 的第 i 位是否为 1
      ans = modadd(ans, sum[i][curx]);
      curx = go[i][curx];
      m ^= 1ll << i;  // 将第 i 位置零
    }
  }
  printf("%d\n", ans);
}

```

总结： 这就是倍增预处理出以二的整数次幂为单位的信息：
*在递推中，如果状态空间很大，可以通过成倍增长的方式，只递推出状态空间在2的整数次幂的值作为代表。
*每个数都可以表示成二进制的形式，可用之前的求出的代表值拼成所需的值。
*要求这个递推问题的状态空间关于2的次幂具有可划分性。
注意：为了保证统计的时候不重不漏，一般预处理出左闭右开的点权和。