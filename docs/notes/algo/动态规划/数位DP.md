数位DP

数位DP本质上也是一种动态规划，只是在实现和对应题目上有所倾向，数位DP倾向于数学知识，与数学思维去解决问题，该题型的显著特点是---

问在[l,r]区间上，满足[条件]的数总共有几个？        l,r均属于很大的区间，1e9/1e12

很明显，这种题不能单纯地用暴力枚举，把区间所有的数拿出来一个个判断，显然是很笨拙的办法，应该采用动态规划的思路

以一道开胃题来作叙述：

[P2602 [ZJOI2010\] 数字计数 - 洛谷](https://www.luogu.com.cn/problem/P2602)

题目大意：给定两个正整数a,b，要求在[a,b]范围内，0-9都出现了多少次

​                                                1&lt;=a,b&lt;=1e12

看到区间求个数，与超级大的范围，就知道该题得用数位DP来求解

对于数位DP，有两种实现方法，一种是单纯用DP，找到其中的数学递推公式（状态转移方程），然后一步步去推导，即完成一种正向推导过程

第二种是夹杂深搜（dfs）的方法，在状态转移过程利用几个状态值来进行搜索与回溯，即实现一种从后往前倒推的过程

但二者的核心思想都是把区间[l,r]拆解，求该区间上的满足条件的数的个数，即转换为求

[0,r]上满足条件的数的个数  - [0,l-1] 上满足条件的数的个数，即得出答案

核心思路：只用一个数（末端值）去求所有在他前面的数且满足条件的个数，所以需要采用取个，十，百....位的方法，去操作判断。

拿87作为例子          即求0-87之间满足条件的个数

使用第一种思路，规定dpi表示满i位数每个数字出现的次数（都相等）

则 
$$
dp[i]=dp[i-1]*10+10^{i-1}
$$
解释： 对于一个满4位数   0000-9999  （因为对每个满i位数都从前导零开始算，就可以抵消）

dp[i-1] 理解为满三位数中例如9出现的次数，     即       ———  三位填好之后出现的次数，此时需要

多加一位，考虑填好三个数以后，如果在最后一位   ——9    那这个时候只要在第一位填0-9就可以了

以此类推，dp[i-1]*10自然可以理解下来了。另外一种情况是在第一位填上9，然后剩下i-1位，每一位都可以填0-9，这样就是  
$$
10^{i-1}
$$
理解好了dp数组的表示意义以及计算方法，下面开始进入核心思路的计算

对于87，按照数位DP的基本思想，差开每一位数，存在a数组

a[1]=7,a[2]=8           从后往前推       

代码：

```c++
for(int i=cnt;i>=1;i--){
		for(int j=0;j<=9;j++) ans[j]+=dp[i-1]*a[i];
		for(int j=0;j<a[i];j++) ans[j]+=mi[i-1];
		tmp-=mi[i-1]*a[i],ans[a[i]]+=tmp+1;
		ans[0]-=mi[i-1];
	}
```

第一位是8，乘上满i-1位数数字出现的次数，再加上10的i-1次方（注意不能高于该 位的数字），后一行是处理后一位数的情况，因为dp算的是满i位数的情况（也就是到9），但实际可能达不到9，因此要单独算。

mi[i-1]*a[i]=80,tmp=87,tmp-=80,tmp=7,ans[9]+=8    （0-7填一个）

同时去掉前导零的情况

上述即为核心思路，以及代码实现方法，完整代码：

```c++
#include<iostream>
#include<cstring>
#include<cmath>
typedef long long ll;
using namespace std;
ll mi[15],ans1[15],ans2[15],dp[15],a[20];
void dfs(ll n,ll *ans){
	ll tmp=n;
	int cnt=0;
	while(n){
		a[++cnt]=n%10;
		n/=10;
	}
	for(int i=cnt;i>=1;i--){
		for(int j=0;j<=9;j++) ans[j]+=dp[i-1]*a[i];
		for(int j=0;j<a[i];j++) ans[j]+=mi[i-1];
		tmp-=mi[i-1]*a[i],ans[a[i]]+=tmp+1;
		ans[0]-=mi[i-1];
	}
}
int main(){
	ll a,b;
	std::cin>>a>>b;
	mi[0]=1ll;
	for(int i=1;i<=13;i++){
		dp[i]=dp[i-1]*10+mi[i-1];
		mi[i]=mi[i-1]*10;
	}
	dfs(b,ans2);
	dfs(a-1,ans1);
	for(int i=0;i<=9;i++) std::cout<<ans2[i]-ans1[i]<<" ";
	return 0;
}
```

----------------------------------------------------------------------------------------------------------------------------------------

接下来讲述第二种实现方法-- dfs搜索

该方法其实套用一种模板，即状态判断，利用状态去实现搜索，达到一个从后往前反向推导的过程，拿这道题说，举一个789的例子，也就是0-789求满足条件的数

其实对于dfs数位DP模板，一个常用的状态变量limit，它表示该位最大取上一位的值，还是说可以任取0-9，怎么理解呢，作出下列例子----

3567      很明显，对于第一位毋庸置疑，只能取0-3吧，我们知道，当第一位填的数是0,1,2时，后一位是不是填0-9都行呀，也就是说，这是limit的第一种状态，设定为0，而当第一位填了3时，正好是最大数字，那这时第二位就不能瞎填了，只能填0-5之间的数字，综上所述，可以写出limit状态转移的操作代码   

```c++
          for(int i=0;i<=(limit?a[pos]:9);i++){
               dfs(pos+1, ,limit&(i==a[pos]), );
          }
```

这样就可以转换limit的值，从而在填数过程中满足基本规则。

接下去确定dp数组的含义以及参数，首先固然需要一个当前值pos，表示当前第几位，然后用cntd记录一下填了多少位了，如果pos=cntd时，即为递归结束之时（注意动态规划递归时，记得要记忆化搜索，即省去不必要的操作，初始化数组-1，当记录了值之后，即可返回）

具体代码如下---

```c++
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
ll A[22], cnt, digit, dp[22][22][2][2];
ll dfs(int pos, int cntd, bool limit, bool lead) // cntd表示目前为止已经找到多少个digit
{
    ll ans = 0;
    if (pos == cnt)
        return cntd;
    if (dp[pos][cntd][limit][lead] != -1)
        return dp[pos][cntd][limit][lead];
    for (int v = 0; v <= (limit ? A[pos] : 9); ++v)
        if (lead && v == 0)
            ans += dfs(pos + 1, cntd, limit && v == A[pos], true);
        else
            ans += dfs(pos + 1, cntd + (v == digit), limit && v == A[pos], false);
    dp[pos][cntd][limit][lead] = ans;
    return ans;
}
ll f(ll x)
{
    cnt = 0;
    memset(dp, -1, sizeof(dp));
    memset(A, 0, sizeof(A));
    while (x)
        A[cnt++] = x % 10, x /= 10;
    reverse(A, A + cnt);
    return dfs(0, 0, true, true);
}
int main()
{
    ios::sync_with_stdio(false);
    ll x, y;
    cin >> x >> y;
    for (int i = 0; i <= 9; ++i)
    {
        digit = i;
        ll l = f(x - 1), r = f(y);
        cout << r - l << " ";
    }
    return 0;
}
```

这里的lead是用来处理前导零的，表示当前为之前是否全部都是0，如果当前位也是0的话，那么他就是前导零

这么理解------对于 09--  这样的情况来说，0自然是不能算进去的吧，此操作就可以避开这种情况

**这样，第一道题就叙述完毕了。。。。**



现在开始第二题

[Problem - 2089](https://acm.hdu.edu.cn/showproblem.php?pid=2089)

题目概况：

![](/images/36.png)

还是一样，利用两种方法解答

第一种---纯DP

这题本意就是求出吉利数的个数，但如果正向求解的话，考虑的因素或许有点太多了，所以采取反向推导的想法，求不吉利数的个数，然后减去就可以了

不吉利数-- 数中含有4，或者含有连着的62，得知这个可以构建我们的dp数组了

设置：

dp[i] [0]存储满i位数中不含4,62的数字个数，即为吉利数

dp[i] [1]存储满i位数中以2开头的吉利数

dp[i] [2]存储满i位数中的不吉利数的个数

接下去开始递推

dp[i] [0]=dp[i-1] [0]*9-dp[i-1] [1]       `**满i位数中的吉利数可由i-1位数的吉利数前面加上除4以外的9个数字再减去前i-1位吉利数字前面加上6`

dp[i] [1]=dp[i-1] [0]    `满i位数以2开头的吉利数只能由i-1位吉利数字前面加上2来构成`

dp[i] [2]=dp[i-1] [2]*10+dp[i-1] [0]+dp[i-1] [1]     `满i位数的不吉利数可由i-1位中不吉利数加上0-9    和以2开头的吉利数前面加上6和吉利数前面加上4共同构成`

初始值dp[0] [0]=1

用一个具体的数作为例子  583626

需要一个bool量flag记录是否出现了非吉利数字，初始为0

$$ 从最高位判断 d[6]=5 ，即0-499999之间非吉利数字

首先，加上0-99999所有非吉利数字前面添加0-4任意一个数字  sum+=dp[5] [2]*d[6]

其次，5&gt;4，故还需加上0-99999中所有吉利数字前面加4的情况   sum+=dp[5] [0]

$$ 下一位，d[5]=8，判断500000-5799999之间的非吉利数字的个数，由于第一位是5，没啥用，简化成0-79999之间的非吉利数

首先，加上0-9999所有非吉利数字前面添加0-7任意一个数字   sum+=dp[4] [2]*d[5]

其次，8&gt;4，加上0-9999所有吉利数字加上4的情况   sum+=dp[4] [0]

还有，8&gt;6，所以还要加上0-9999所有以2开头的吉利数前面填上6的情况  sum+=dp[4] [1]

$$ 下一位，d[4]=3，判断5800000-582999之间非吉利数字，前面没6，因此简化为求0-2999之间的

首先，加上0-999所有非吉利数字前面填上0-2任意一个数字    sum+=dp[3] [2]*d[4]

但是这里，2&lt;4   2&lt;6  因此后两种情况无需考虑

$$ 下一位，d[3]=6，判断583000-583599之间非吉利数字个数，同样，转化为0-599之间

首先，加上0-99之间非吉利数字前面填上0-5任意一个数字    sum+=dp[2] [2]*d[3]

其次，5&gt;4，可以加上0-99所有吉利数字前面填4的情况   sum+=dp[2] [0]

$$ 下一位，d[2]=2，判断583600-583619之间非吉利数字个数，即0-19之间

首先，加上0-9中非吉利数字前面填上0-1任意一个数字  sum+=dp[1] [2]*d[2]    

由于2&lt;4，因此没有其他情况

但是，需要注意的是，这里判断的数字出现了62，我们要把flag标识为true。

最后，判断第1位digit[1] = 7, 判断583620 ~ 583626但是这里flag为true了，表示前面的数字里面已经包含了非吉利数字，所以后面需要把所有的数字情况都加入到非吉利里面。(正是因为每次判断的数字末尾都比该位的数字少1，所以最开始要记录n + 1 的值)

sum += d[1] * dp[0] [2] + d[1] * dp[0] [0]

这就是全过程，整理成代码--

```c++
int solve(int x){
	int cnt=0,tmp=x,ans=0;
	while(tmp){
		d[++cnt]=tmp%10;
		tmp/=10;
	}
	d[cnt+1]=0;
	bool flag=0;
	for(int i=cnt;i>=1;i--){
		ans+=d[i]*dp[i-1][2];
		if(flag) ans+=d[i]*dp[i-1][0];
		else{
			if(d[i]>4) ans+=dp[i-1][0];
			if(d[i]>6) ans+=dp[i-1][1];
			if(d[i+1]==6&&d[i]>2) ans+=dp[i][1];
		}
		if(d[i]==4||(d[i]==2&&d[i+1]==6)) flag=1;
	}
	return x-ans;
}
```

整体代码如下：

```c++
#include<iostream>
#include<cstdio>
#include<cstring>
using namespace std;
int dp[10][5],d[12];
void init(){
	memset(dp,0,sizeof(dp));
	dp[0][0]=1;
	for(int i=1;i<=8;i++){
		dp[i][0]=dp[i-1][0]*9-dp[i-1][1];
		dp[i][1]=dp[i-1][0];
		dp[i][2]=dp[i-1][0]+dp[i-1][2]*10+dp[i-1][1];
	}
}
int solve(int x){
	int cnt=0,tmp=x,ans=0;
	while(tmp){
		d[++cnt]=tmp%10;
		tmp/=10;
	}
	d[cnt+1]=0;
	bool flag=0;
	for(int i=cnt;i>=1;i--){
		ans+=d[i]*dp[i-1][2];
		if(flag) ans+=d[i]*dp[i-1][0];
		else{
			if(d[i]>4) ans+=dp[i-1][0];
			if(d[i]>6) ans+=dp[i-1][1];
			if(d[i+1]==6&&d[i]>2) ans+=dp[i][1];
		}
		if(d[i]==4||(d[i]==2&&d[i+1]==6)) flag=1;
	}
	return x-ans;
}
int main(){
	int n,m;
	init();
	while(~scanf("%d%d",&n,&m)){
		if(n==0&&m==0) break;
		std::cout<<solve(m+1)-solve(n);
		std::cout<<'\n';
	}
	return 0;
}
```

----------------------------------------------------------------------------------------------------------------------------------------



第二种方法--dfs搜索

其实要想转化到dfs的做法，只需加入状态判断的参数，然后进行深搜就可以了

这里使用的limit还是和上题一致（其实所有数位DP题的都一样）本质上用来判断是否能填数，即套用模板就可以解决了

直接给出代码---

```c++
#include <algorithm>
#include <cstring>
#include <iostream>
using namespace std;
int A[8], cnt, dp[8][12][2];
int dfs(int pos, int last, bool limit)
{
    int ans = 0;
    if (pos == cnt)
        return 1; // 搜索终点
    if (dp[pos][last][limit] != -1)
        return dp[pos][last][limit];
    for (int v = 0; v <= (limit ? A[pos] : 9); ++v) // 根据是否limit决定循环上界
    {
        if (last == 6 && v == 2 || v == 4) // 舍弃不合法解
            continue;
        ans += dfs(pos + 1, v, limit && v == A[pos]);
    }
    dp[pos][last][limit] = ans;
    return ans;
}
int f(int x)
{
    cnt = 0;
    memset(A, 0, sizeof(A));
    memset(dp, -1, sizeof(dp)); // 初始化dp数组为-1
    while (x)
        A[cnt++] = x % 10, x /= 10;
    reverse(A, A + cnt);
    return dfs(0, 11, true);    // 用last为11表示不存在上一位
}
int main()
{
    ios::sync_with_stdio(false);
    int x, y;
    while (cin >> x >> y, x || y)
    {
        int l = f(x - 1), r = f(y);
        cout << r - l << endl;
    }
    return 0;
}
```

不翻转还是更好的，这使得我们不能复用dp数组，在多测的情形下就会增大复杂度。（省得不太好理解）。。。。

```c++
#include <stdio.h>
#include <string.h>
#include <algorithm>

using namespace std;

int dp[8][2],digit[8];

int dfs(int len,bool state,bool fp)
{
    if(!len)
        return 1;
    if(!fp && dp[len][state] != -1)
        return dp[len][state];
    int ret = 0 , fpmax = fp ? digit[len] : 9;
    for(int i=0;i<=fpmax;i++)
    {
        if(i == 4 || state && i == 2)
            continue;
        ret += dfs(len-1,i == 6,fp && i == fpmax);
    }
    if(!fp)
        dp[len][state] = ret;
    return ret;
}

int f(int n)
{
    int len = 0;
    while(n)
    {
        digit[++len] = n % 10;
        n /= 10;
    }
    return dfs(len,false,true);
}

int main()
{
    int a,b;
    memset(dp,-1,sizeof(dp));
    while(scanf("%d%d",&a,&b),a||b)
    {
        printf("%d\n",f(b)-f(a-1));
    }
    return 0;
}
```

