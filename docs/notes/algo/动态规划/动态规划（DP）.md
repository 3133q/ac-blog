# 动态规划（DP）

> 小插曲：想必在学习完搜索后（深度优先搜索，广度优先搜索）之后，你肯定有此想法吧：搜索对于迷宫或者专项题可以完美AC，但是对于一般的题目却总是超时。。 这其实是正常滴，尤其是深搜，得递归调用，递归是超时概率最高的，这时，我们便可以拿出法宝--DP！学完你可以知道，绝大多数搜索都能够转换为DP。。

## 引入

### 介绍

简单来说，动态规划相当于一种动态的过程，是一种通过把原问题分成相对简单的一个个子问题来解决的方法，怎么理解动态呢？其实可以这么想，从一次次的状态转移方程式中，我们可以不断更新原有的值，进而得到最终的结果。

### 基础

接下来先打好动态规划（简称动规）的基础，从例题中不断熟悉写状态转移方程式的方法

#### 例题

[P1216 [IOI 1994 / USACO1.5\] 数字三角形 Number Triangles - 洛谷](https://www.luogu.com.cn/problem/P1216)

第一道题，dp很常规的一道题（与第二届CACC第二题类似，都是找到值最大的一条路径，不过那题撒了随机种子，但我还是一遍就过了😁），下面我们来看看题。

![img](https://cdn.luogu.com.cn/upload/image_hosting/95pzs0ne.png)

有这样一个数字三角形，从上往下走，每次可以选择左下或者右下的一个数字，然后一直到最底层结束，要找出一条路径中所有数字之和最大的一条，并输出最大值。

对于输入还算友好，没有说是按原图，但其实就算是按原图，最后存到数组里的数字位置也是一样的，出题人肯定也觉得没这个必要。

```
5
7
3 8
8 1 0
2 7 4 4
4 5 2 6 5 
```

就拿这个样例说说吧。。

从最上面7开始

如果到3 储存7+3=10   如果到8 储存7+8=15

如果从3开始 到8 10+8=18 到1 10+1=11   如果从8开始 到1 15+1=16 到0 15+0=15

......

这样一直下去，直到最后一层，结束。

通过分析可以知道如果我要一步步写下去的话，会很复杂，尤其是一行如果有几十个数，那我得一个个枚举，太麻烦了，这里就可以使用动规记录过程量，然后方便递推。

我把dp[i] [j] 定义为第i行第j列数字目前能储存到的最大值，然后正常输入数据到a数组

状态转移方程式：

```c++
dp[i][j]=max(dp[i-1][j-1],dp[i-1][j])+a[i][j];
```

##### 代码部分

下面我们来看看代码：

```c++
#include<bits/stdc++.h>
using namespace std;
int a[2001][2001],dp[2001][2001];
int maxx=-1e5+2;
int main(){
	int r;
	std::cin>>r;
	for(int i=1;i<=r;i++)
	 for(int j=1;j<=i;j++)
	std::cin>>a[i][j];
	dp[1][1]=a[1][1];
	for(int i=2;i<=r;i++){
		for(int j=1;j<=i;j++){
			dp[i][j]=max(dp[i-1][j-1],dp[i-1][j])+a[i][j];
			maxx=max(maxx,dp[i][j]);
		}
	}
	std::cout<<maxx;
	return 0;
}
```

---

## 正题

> 引入部分作为一道开胃菜，想必让你已经有了一丢丢的动规思路，下面我们来进入正题吧！

### 什么是动态规划？

动态规划（Dynamic programming，简称DP），是一种在数学，管理科学，计算机科学，经济学与生物信息学中使用的，通过把原问题分解为相对简单的子问题的方式求解复杂问题的方法，动态规划常常适用于有重叠子问题和最优子结构性质的问题。

> ★ dynamic programming is a method for solving a complex problem by breaking it down into a collection of simpler subproblems.”

这是动态规划的官方定义，具体理解的话：

> 子问题都可以通过函数关系式递推出来，动态规划就就致力于解决每个子问题一次，减少重复计算，比如斐波那契数列这种就可以当做入门dp

#### 核心思想

拆分子问题，记住过往，减少重复计算（后面会介绍记忆化搜索）

#### 直观的理解

> A：1+1+1+1+1=？   上面的等式是多少
>
> B：5
>
> A：那我如果在左侧加个1呢？
>
> B：6
>
> A：你为啥这么快能算出结果？
>
> B：很简单呀，原基础上加个1不就行了。

简单且有趣的对话，让我们悟出来动规的底层思想。

### 走进DP

#### 例题一

[P1255 数楼梯 - 洛谷](https://www.luogu.com.cn/problem/P1255)

题目描述很简单。。

![image-20260131164710671](/images/image-20260131164710671.png)

这种题一看就知道是递推了吧（可以除非刚开始学哈哈哈），某一阶楼梯可以由上一阶或者上两阶走上来，其实仔细想想，这不就是斐波那契数列吗！
$$
F[i]=F[i-1]+F[i-2]
$$
但这道题比较恶心，它把数据范围控到了5000，太大了，单纯long long也存不下，得套用高精度了。。

具体高精度模板从这跳转 [高精度算法.md](D:\C语言\算法笔记\高精度算法.md) 

##### 代码

```c++
#include<iostream>
#include<cstring>
#include<vector>
#include<algorithm>
using namespace std;
string str1,str,s,str2;
void add(string s1,string s2){
	str1="";
	str="";
	int a[5001],b[5001],total=0;
	memset(a,0,sizeof(a));
	memset(b,0,sizeof(b));
	for(int i=s1.size()-1;i>=0;i--) a[total++]=s1[i]-'0';
	total=0;
	for(int i=s2.size()-1;i>=0;i--) b[total++]=s2[i]-'0';
	int cnt=max(s1.size(),s2.size());
	for(int i=0;i<cnt;i++){
		a[i]+=b[i];
		if(i==cnt-1&&a[i]>=10) break;
		a[i+1]+=a[i]/10;
		a[i]%=10;
	}
	for(int i=cnt-1;i>=0;i--){
		str1=to_string(a[i]);
		str+=str1;
	}
}
int main(){
	int n;
	std::cin>>n;
	if(n==0){
		std::cout<<0;
		return 0;
	}
	if(n==1){
		std::cout<<1;
		return 0;
	}
	if(n==2){
		std::cout<<2;
		return 0;
	}
	string s1="1";
	string s2="2";
	for(int i=3;i<=n;i++){
		add(s1,s2);
		s1=s2;
		s2=str;
	}
	std::cout<<str;
	return 0;
}
```

#### 小插曲

引用关于动态规划讲解的文章中对递归和递推的对比，与记忆化搜索相应的应用。

> ![img](https://pic3.zhimg.com/v2-2dc11311d9321f61c7bb8a3d9058c636_1440w.jpg)
>
> - 要计算原问题 f(10)，就需要先计算出子问题 f(9) 和 f(8)
> - 然后要计算 f(9)，又要先算出子问题 f(8) 和 f(7)，以此类推。
> - 一直到 f(2) 和 f(1），递归树才终止。
>
> 我们来看看这个递归数的时间复杂度吧。
>
> ```text
> 递归时间复杂度 = 解决一个子问题时间*子问题个数
> ```
>
> - 一个子问题时间 = f（n-1）+f（n-2），也就是一个加法的操作，所以复杂度是 O(1)；
> - 问题个数 = 递归树节点的总数，递归树的总节点 = 2^n-1，所以是复杂度O(2^n)。
>
> 因此，青蛙跳阶，递归解法的时间复杂度 = O(1) * O(2^n) = O(2^n)，就是指数级别的，爆炸增长的，如果n比较大的话，超时很正常的了。
>
> 回过头来，你仔细观察这颗递归树，你会发现存在大量重复计算，比如f（8）被计算了两次，f（7）被重复计算了3次...所以这个递归算法低效的原因，就是**存在大量的重复计算**！
>
> 既然存在大量重复计算，那么我们可以先把计算好的答案存下来，即造一个备忘录，等到下次需要的话，先去备忘录查一下，如果有，就直接取就好了，备忘录没有才开始计算，那就可以省去重新重复计算的耗时啦！这就是带备忘录的解法。

##### 记忆化搜索

> 一般使用一个数组或者一个哈希map充当这个**备忘录**。
>
> - 第一步，f（10）= f(9) + f(8)，f(9) 和f（8）都需要计算出来，然后再加到备忘录中，如下：
>
> ![img](https://picx.zhimg.com/v2-f31e17b883d1eb45a906a83760b5e7f3_1440w.jpg)
>
> - 第二步， f(9) = f（8）+ f（7），f（8）= f（7）+ f(6), 因为 f(8) 已经在备忘录中啦，所以可以省掉，f(7),f（6）都需要计算出来，加到备忘录中~
>
> ![img](https://pic1.zhimg.com/v2-5c553e02bb63d74f9f1f3b91b994f584_1440w.jpg)
>
> 第三步， f(8) = f（7）+ f(6),发现f(8)，f(7),f（6）全部都在备忘录上了，所以都可以剪掉。
>
> ![img](https://pic2.zhimg.com/v2-7675d5727f4e81db7fc897051ae2cecf_1440w.jpg)
>
> 所以呢，用了[备忘录递归算法](https://zhida.zhihu.com/search?content_id=169395567&content_type=Article&match_order=1&q=备忘录递归算法&zhida_source=entity)，递归树变成光秃秃的树干咯，如下：
>
> ![img](https://pic2.zhimg.com/v2-6c180511b9a2ef31f76c225b50f7cb9d_1440w.jpg)
>
> 带**备忘录**的递归算法，子问题个数=树节点数=n，解决一个子问题还是O(1),所以带**备忘录**的递归算法的时间复杂度是O(n)。

#### 解题套路

##### 什么样的问题可以用动规解决?

> 如果一个问题，可以把所有可能的答案穷举出来，并且穷举出来后，发现存在重叠子问题，就可以考虑使用动态规划。
>
> 比如：最长递增子序列，最小编辑距离，背包问题，凑零钱等等。。

### 实战训练

#### 背包问题专项

##### 01背包

[P2871 [USACO07DEC\] Charm Bracelet S - 洛谷](https://www.luogu.com.cn/problem/P2871)

![image-20260131172953401](/images/image-20260131172953401.png)

后面会进行对比，对于01背包，为啥叫01呢？就是在于每个物品都有取或者不取两种情况，分别对应二进制里的1和0，所以这类问题被称为01背包问题。

###### 分析

例题中已知条件有i个物品的重量vi，价值wi，以及背包的总容量m

我假设dp[i] [j]表示只能放前i个物品的情况下，容量为j的背包能达到的最大价值，考虑转移，如果已经算好了前i-1个物品的所有状态，那么对于第i个物品，有放入与不放入这两种状态，但不放入时，背包的总价值不变，但如果放入的话背包的剩余容量就会减小vi，但背包的总价值会增大wi，

###### 状态转移方程式

$$
f[i][j]=max(f[i-1][j],f[i-1][j-v[i]]+w[i])
$$

###### 改进

我们其实知道，多维数组在算法竞赛的领域上，是能不用就不用，能开一维就绝对不用二维，否则很容易MLE，可以考虑滚动数组来优化，由于对f[i]有影响的只有f[i-1]，故可以去掉一维，直接f[i]就OK了。

###### 优化的方程式

$$
f[j]=max(f[j],f[j-v[i]]+w[i])
$$



###### 代码

```c++
#include<iostream>
#include<cstring>
#include<algorithm>
using namespace std;
int v[20001],w[20001],dp[30001]; 
int main(){
	int n,m;
	std::cin>>n>>m;
	for(int i=0;i<n;i++) std::cin>>v[i]>>w[i];
	for(int i=0;i<n;i++){
		for(int j=m;j>=v[i];j--){
			dp[j]=max(dp[j],dp[j-v[i]]+w[i]);
		}
	}
	std::cout<<dp[m];
	return 0;
}
```

---

##### 完全背包

[P1616 疯狂的采药 - 洛谷](https://www.luogu.com.cn/problem/P1616?contestId=306042)

###### 分析

完全背包模型与01背包相似，与01背包的区别仅在于一个物品可以取无数次，而非只能取一次，所以说我们可以借鉴01背包的思路，进行状态定义。

我们假设（从二维开始，毕竟一切都得从复杂到简单过渡嘛）f[i] [j]同样表示只能选前i个物品时，容量为j的背包可以达到的最大价值

###### 过程

考虑一个朴素的方法，对于第i件物品，枚举其选了多少个来转移，这样做的时间复杂度为O(n^3)

###### 状态转移方程式

$$
f[i][j]=max_{k=0}^{+\infty}(f[i-1][j-k\times w[i]+v[i]\times k])
$$

###### 优化

我们可以将k省掉，因为转移时f[i] [j-wi]已经由f[i] [j-2*wi]更新过，那么它已经充分考虑了第i件物品所选次数后得到的最优结果

###### 新的方程式

$$
f[i][j]=max(f[i-1][j],f[i][j-v[i-1]]+w[i-1])
$$

注：因为完全背包即便把一个物品放入了，还可以接着放。。。

###### 代码一

```c++
/* 完全背包：动态规划 */
int unboundedKnapsackDP(vector<int> &wgt, vector<int> &val, int cap) {
    int n = wgt.size();
    // 初始化 dp 表
    vector<vector<int>> dp(n + 1, vector<int>(cap + 1, 0));
    // 状态转移
    for (int i = 1; i <= n; i++) {
        for (int c = 1; c <= cap; c++) {
            if (wgt[i - 1] > c) {
                // 若超过背包容量，则不选物品 i
                dp[i][c] = dp[i - 1][c];
            } else {
                // 不选和选物品 i 这两种方案的较大值
                dp[i][c] = max(dp[i - 1][c], dp[i][c - wgt[i - 1]] + val[i - 1]);
            }
        }
    }
    return dp[n][cap];
}
```

###### 空间优化

由于完全背包每个物品可以放入无限次，所以得从前往后推，而非倒推。

###### 图解

<img src="/images/image-20260131182912748.png" alt="image-20260131182912748" style="zoom:67%;" />

<img src="/images/image-20260131182933239.png" alt="image-20260131182933239" style="zoom:67%;" />

<img src="/images/image-20260131182952284.png" alt="image-20260131182952284" style="zoom:67%;" />

<img src="/images/image-20260131183006515.png" alt="image-20260131183006515" style="zoom:67%;" />

<img src="/images/image-20260131183025081.png" alt="image-20260131183025081" style="zoom:67%;" />

![image-20260131183041724](/images/image-20260131183041724.png)

###### 代码（例题）

```c++
#include<iostream>
#include<cstring>
#include<algorithm>
using namespace std;
const int N=1e7+2;
long long w[30001],dp[N],v[30001];
int main(){
	long long m,t;
	std::cin>>t>>m;
	for(int i=0;i<m;i++) std::cin>>v[i]>>w[i];
	for(int i=0;i<m;i++){
		for(int j=v[i];j<=t;j++){
			dp[j]=max(dp[j],dp[j-v[i]]+w[i]);
		}
	}
	std::cout<<dp[t];
	return 0;
}
```

---

##### 多重背包

###### 分析

多重背包是01背包的一种变式，与其不同之处在于每种物品有ki个，而非一个

朴素的想法：把每种物品选 ki 次等价转换为有 ki 个相同的物品，每个物品选一次，这样就转换为了一个01背包模型。。

###### 状态转移方程式

$$
f[i][j]=max_{k=0}^{k[i]}(f[i-1][j-k\times w[i]]+v[i]\times k)
$$

代码

```c++
for (int i = 1; i <= n; i++) {
  for (int weight = W; weight >= w[i]; weight--) {
    // 多遍历一层物品数量
    for (int k = 1; k * w[i] <= weight && k <= cnt[i]; k++) {
      dp[weight] = max(dp[weight], dp[weight - k * w[i]] + k * v[i]);
    }
  }
}
```

##### 二进制分组优化

二进制优化本质在于倍增思想，关于倍增，可以学习学习 [倍增.md](D:\C语言\算法笔记\倍增.md) 

这里直接给出优化的思路与想法

###### 核心

通过2的幂次方来实现倍增，然后将数字拆分进行计算，因为计算机中数据都是以二进制来存储的，同时通过2的整数次幂进行倍增，可以达成很快的效率来拆分（因为复杂度可以降到O(logn)）

举个例子：我们以 1 2 4 8 16 ..... 256 512 这样来累加，然后多余的直接分为一组，这样实现拆分

比起多重背包初始方法 — 将每一个枚举去装背包，然后计算价值，这样分开来明显更快，比如说对于7，朴素的做法要枚举7个，但7=1+2+4，只需要枚举三次，这就是优化！

###### 代码

```c++
//二进制优化
#include<bits/stdc++.h>
using namespace std;
const int MAXN=1e5+10;
int n,V;
int v[MAXN],w[MAXN];
int f[MAXN];
int main()
{
	cin>>n>>V;
	int cnt=0;//记录新的物体数 
	for(int i=1,a,b,s;i<=n;i++)
	{
		cin>>a>>b>>s;
		int k=1;
		while(k<=s)//将每个物品都按照二进制合成
		{
			v[++cnt]=k*a;
			w[cnt]=k*b;
			s-=k;
			k*=2;
		}
		if(s)
		{
			v[++cnt]=s*a;
			w[cnt]=s*b;
		}
	}
 
	for(int i=1;i<=cnt;i++)//01背包 
		for(int j=V;j>=v[i];j--)
			f[j]=max(f[j],f[j-v[i]]+w[i]);
	cout<<f[V];
	return 0;
}
```

##### 单调队列优化

关于单调队列，跳转至 [单调队列.md](D:\C语言\算法笔记\单调队列.md) 

###### 代码

```c++
#include <array>
#include <deque>
#include <iostream>

constexpr int MAXV = 4e4 + 10;
constexpr int MAXN = 1e2 + 10;

using namespace std;

int n, W, last = 0, now = 1;
array<int, MAXN> v, w, k;
array<array<int, MAXV>, 2> f;
deque<int> q;

int main() {
  ios::sync_with_stdio(false);
  cin >> n >> W;
  for (int i = 1; i <= n; i++) {
    cin >> v[i] >> w[i] >> k[i];
  }
  for (int i = 1; i <= n; i++) {
    for (int y = 0; y < w[i]; y++) {
      // 清空队列
      deque<int>().swap(q);
      for (int x = 0; x * w[i] + y <= W; x++) {
        // 弹出不在范围的元素
        while (!q.empty() && q.front() < x - k[i]) {
          q.pop_front();
        }
        // 保证队列单调
        while (!q.empty() && f[last][q.back() * w[i] + y] - q.back() * v[i] <
                                 f[last][x * w[i] + y] - x * v[i]) {
          q.pop_back();
        }
        q.push_back(x);
        f[now][x * w[i] + y] =
            f[last][q.front() * w[i] + y] - q.front() * v[i] + x * v[i];
      }
    }
    swap(last, now);
  }
  cout << f[last][W] << endl;
  return 0;
}
```



##### 例题

[P1776 宝物筛选 - 洛谷](https://www.luogu.com.cn/problem/P1776)

题目是很明显的多重背包，不优化肯定不行，优化的方法可任选其一去做。。

法一 ：二级制分组优化

###### 代码

```c++
#include<iostream>
#include<cstring>
#include<algorithm>
using namespace std;
int a,b,c,v[100001],w[100001],dp[200001];
int main(){
	int n,w1;
	int cnt=0,k=1;
	std::cin>>n>>w1;
	for(int i=0;i<n;i++) {
		k=1;
		std::cin>>a>>b>>c;
		while(k<=c){
			v[++cnt]=k*b;
			w[cnt]=k*a;
			c-=k;
			k*=2;
		}
		if(c){
			v[++cnt]=c*b;
			w[cnt]=c*a;
		}
	}
	for(int i=1;i<=cnt;i++){
		for(int j=w1;j>=v[i];j--){
			dp[j]=max(dp[j],dp[j-v[i]]+w[i]);
		}
	}
	std::cout<<dp[w1];
	return 0;
}
```

注意点：每下一组数据输入时，k要重新赋值，因为k是2的幂次方累加以达到拆分的效果，但是cnt不能清零，因为cnt不断记录总共的组数，在最后的01背包中要使用cnt，而不是n 。。。

---

#### 纸币问题专项

> 纸币问题出自某位作者，虽说小小的纸币，但却能散发出大大的光芒。。

##### 纸币问题一

[P2842 纸币问题 1 - 洛谷](https://www.luogu.com.cn/problem/P2842)

![image-20260201173456718](/images/image-20260201173456718.png)

###### 分析

大概理解就是，有n种纸币，每种都有对应的金额，注意无限张（即套用完全背包模板），然后得凑出w的金额，但是这里和背包问题不太一样，背包有容量和价值，但这里只有一个参数，而且求的是最小量（反过来就行了，把dp数组赋值很大的数就好了）

###### 代码

```c++
#include<bits/stdc++.h>
using namespace std;
int min(int a,int b){
	return a<b?a:b;
}
int main(){
	int n,w,a[2001];
	int dp[10001];
	memset(dp,127,sizeof(dp));
	scanf("%d%d",&n,&w);
	for(int i=0;i<n;i++) scanf("%d",&a[i]);
	dp[0]=0;
	for(int i=0;i<n;i++){
		for(int j=a[i];j<=w;j++){
			dp[j]=min(dp[j],dp[j-a[i]]+1);
		}
	}
	printf("%d",dp[w]);
	return 0;
}
```

###### 解释

也就相当于把纸币的面额当做物品的体积，然后正常一维推进就行了，只不过这里算的是最少纸币的张数，所以每次加一，最终推得答案。

---

##### 纸币问题二

[P2840 纸币问题 2 - 洛谷](https://www.luogu.com.cn/problem/P2840)

![image-20260201224047444](/images/image-20260201224047444.png)

###### 分析

其实这道题有点像纸币问题三的晋升版，建议先看看纸币问题三，再回来看这道题。。

这道题不同之处在于，虽说也是求多少种方式可以支付，但同样的纸币要考虑支付顺序，在这一步上处理有所不同，通过代码来讲讲吧！

###### 代码

```c++
#include<bits/stdc++.h>
using namespace std;
const int N=1e9+7;
int main(){
	int n,w,a[2001];
	int dp[10001];
	scanf("%d%d",&n,&w);
	memset(dp,0,sizeof(dp));
	dp[0]=1;
	for(int i=0;i<n;i++) scanf("%d",&a[i]);
	for(int i=1;i<=w;i++){
		for(int j=0;j<n;j++){
			if(i>=a[j]) dp[i]=(dp[i]+dp[i-a[j]])%N;
			else continue;
		}
	}
	printf("%d",dp[w]);
	return 0;
}
```

###### 解释

可以看到，这里的for循环位置发生了改变，一般的背包问题（以及变式）都是先枚举物品个数，然后计算价值，但这题不能这样，先枚举金额，算每个金额对应能选啥纸币组合（支付方式），这样的话，比如1+2，跟2+1就可以考虑为两种情况了。。

##### 纸币问题三

[P2834 纸币问题 3 - 洛谷](https://www.luogu.com.cn/problem/P2834)

![image-20260201224812035](/images/image-20260201224812035.png)

###### 分析

要求出支付给定金额的支付方式，同时注意到无限张（采用完全背包模板），这里可能跟纸币张数的计算不太一样，这里说是支付方式，所以我们需要采用累加的递推法。

###### 代码

```c++
#include<bits/stdc++.h>
using namespace std;
const int N=1e9+7;
int main(){
	int n,w,a[2001],dp[10001];
	scanf("%d%d",&n,&w);
	for(int i=0;i<n;i++) scanf("%d",&a[i]);
	memset(dp,0,sizeof(dp));
	dp[0]=1;
	for(int i=0;i<n;i++){
		for(int j=a[i];j<=w;j++){
			dp[j]+=(dp[j-a[i]])%N; 
			dp[j]%=N;
		}
	}
	printf("%d",dp[w]);
	return 0;
}
```

###### 挖掘

由于这个跟之前的不太一样，是累加递推，那我就演示一下过程吧。。

6 15

1 5 10 20 50 100

dp[0]=1

一.    dp[1]=0+1=1   dp[2]=0+1=1   dp[3]=0+1=1 .... dp[15]=0+1=1

二.    dp[5]=1+1=2   dp[6]=1+1=2   dp[7]=1+1=2 .... dp[15]=1+1=2

.......

想必已经能理解了吧，一直在往后推理，每张纸币可以凑出大于等于它的所有金额，然后对于j-a[i]指的是剩余部分的金额有几种支付方法，这里直接用之前记录的dp值就行了。。

---

#### 杂题

##### 例题一

[P1077 [NOIP 2012 普及组\] 摆花 - 洛谷](https://www.luogu.com.cn/problem/P1077?contestId=306042)

![image-20260201231616082](/images/image-20260201231616082.png)

Ps.这道题我当时还是太肤浅了，竟然没想出来。。。

###### 分析

这道题本质可以当做一道01背包去做，但是又比01背包高级，因为它有要求按编号摆放花盆，而且不超过ai盆，所以需要枚举1~ai盆，然后一个个推导。

###### 代码

```c++
#include<iostream>
#include<cstring>
#include<algorithm>
using namespace std;
int a[3001],dp[3001];
const int N=1e6+7;
int main(){
	int n,m;
	std::cin>>n>>m;
	for(int i=0;i<n;i++) std::cin>>a[i];
	dp[0]=1;
	for(int i=0;i<n;i++){
		for(int j=m;j>=0;j--){
			for(int k=1;k<=min(a[i],j);k++){
				dp[j]=(dp[j]+dp[j-k])%N;
				dp[j]%=N;
			}
		}
	}
	std::cout<<dp[m];
	return 0;
}
```

###### 解释

首先在枚举总花盆数的时候，采用倒推，因为它不是无限盆，可以随便摆，这里多了一个k循环，从1开始一直到最大盆数与目前容量的最小值，然后运用纸币问题三的思路，累加递推，直到退推出最后答案。。

---

##### 例题二

[P3842 [TJOI2007\] 线段 - 洛谷](https://www.luogu.com.cn/problem/P3842?contestId=306042)

![image-20260201233415643](/images/image-20260201233415643.png)

Ps.这题的思维量还是很庞大的。。。

###### 分析

这题大致的意思是，从（1,1）出发，然后给出每行那条线段的起点和终点，要求走完整条线段才能继续往上，我们从样例看看。

2 6

3 4

1 3

1 2

3 6

4 5

我们选择的路线是

```cpp
 (1, 1) (1, 6)
 (2, 6) (2, 3)
 (3, 3) (3, 1)
 (4, 1) (4, 2)
 (5, 2) (5, 6)
 (6, 6) (6, 4) (6, 6)
```

这题关键在于无法判断是从左边往右的还是从右边往左的，所以面对这个谜题，直接考虑最小值不就行了，这类题目无法判断的，那就两种都写，取更小的一个。

###### 思路

规定 dp[i] [0]表示第i行走到左端点的最小步数，dp[i] [1]表示第i行走到右端点的最小步数 b[i]表示线段长度

###### 状态转移方程式

$$
dp[i][0]=min(dp[i-1][0]+b[i]+abs(a[i-1][0],a[i][1]),dp[i-1][1]+b[i]+abs(a[i-1][1],a[i][1]))+1
$$

前半部分可以理解为上一行最终是到左端点的，然后上到第i行的右端点，这里要加上线段长度，表示最后到了左端点，后半部分可以理解为上一行最终到右端点，然后到第i行的右端点，然后加上线段长度最终到左端点。。

对于dp[i] [1]也是一个意思。。。

###### 代码

```c++
#include<bits/stdc++.h>
using namespace std;

const int maxn=2e4+5;
int n;
int a[maxn][2],dp[maxn][2],b[maxn];

int dis(int x,int y){
    return abs(x-y);
}

int main(){
    cin>>n;
    for(int i=1;i<=n;i++)
    {
        cin>>a[i][0]>>a[i][1];
        b[i]=a[i][1]-a[i][0];
    }
    dp[1][1]=dis(a[1][1],1);
    dp[1][0]=dis(a[1][1],1)+b[1];
    for(int i=2;i<=n;i++){
        dp[i][0]=min(dp[i-1][0]+b[i]+dis(a[i-1][0],a[i][1]),dp[i-1][1]+b[i]+dis(a[i-1][1],a[i][1]))+1;
        dp[i][1]=min(dp[i-1][0]+b[i]+dis(a[i-1][0],a[i][0]),dp[i-1][1]+b[i]+dis(a[i-1][1],a[i][0]))+1;
    }
    cout<<min(dp[n][0]+dis(n,a[n][0]),dp[n][1]+dis(n,a[n][1]));
}

```

---

