# 二分

>  这里将会对二分算法进行深入的讲解（DeepSeek ），欢迎进入二分的殿堂！

## 什么是二分

介绍：首先说说二分是啥吧，顾名思义，二分，就是把一个集合一分为二，变成左半部分和右半部分，那分成这样目的何在呢？当然是为了题目呀，如果是一长串数字组成的数组，你要在里边找到一个数第一次出现的位置，或者说找到第一个大于等于或者小于等于某个数的数字，你倘若直接枚举，1~末尾，傻子都知道会超时吧hhhh，这里便开始了二分的应用。

将一个数组一分为二（前提这个数组满足单调性），然后从中间值开始判断，如果中间值满足，然后根据单调性（这个依题目而定）明确应该在左半部分找还是右半部分，这样省去一个个找这样繁杂的步骤，先说一下，二分的时间复杂度为O(logn)。干说可能没法理解，从一个例子出发吧。

## 二分查找模板

### 模板一：第一个大于等于 x 的数

先是简单点的二分查找：比如说我给了一个数组， 3 5 5 7 8 9 9，然后我给出一个数6，我要知道第一个大于等于6的数的位置，如果纯暴力的话，出题人肯定不会让你好过的。。这里采用二分，先把模板拿出来吧

```cpp
int l=0,r=n,x;
while(l<r){
    int mid=l+r>>1;
    if(a[mid]>=x) r=mid;
    else l=mid+1;
}
std::cout<<l;
```

从这个代码来讲讲，首先定义开始和末尾，l，r，然后循环过程不断进行二分，模拟一下

3 5 5 7 8 9 9

一.    l=0   r=7   mid=3   a[3]=7>=6   r=3

二.    l=0   r=3   mid=1   a[1]=5<6   l=2

三.    l=2   r=3   mid=2   a[2]=5<6   l=3

四.    l=r=3  退出   输出3     即为第一个大于等于6的数的位置。。。

这个过程好理解吧，如果mid对应的位置的数太大了，那我就往前缩，其实二分查找你要想知道我在求啥的话，就看第一个if，这个决定着我要求啥 ，比如这里，就是求第一个大于等于某个数的数，下面换一种。

### 模板二：第一个小于等于 x 的数

```cpp
int l=0,r=n,x;
while(l<r){
    int mid=l+r+1>>1;
    if(a[mid]<=x) l=mid;
    else r=mid-1;
}
std::cout<<l;
```

我们也来模拟一遍

3 5 5 7 8 9 9

一.    l=0   r=7   mid=4   a[4]=8>6   r=3

二.    l=0   r=3   mid=2   a[2]=5<=6   l=2

三.    l=2   r=3   mid=3   a[3]=7>6   r=2

四.    l=r=2    退出   输出2     即为第一个小于等于6的数的位置。。。

看到这个模型你可能会有疑问，为啥mid计算时要加上1？      其实是因为要避免死循环

如果我不加1     遇到   l=2   r=3   mid=2   你想想，由于我是往小了找，第一个小于等于的嘛，所以我很可能就会不断满足情况，一直   l=2，这样循环往复，发现输出不了。。。上面这个例子就能说明，a[2]<=6✅️

## 二分查找例题

好了 二分查找的两个基础模型你已经掌握了，下面看到例题。

### P2249【深基13.例1】查找

[P2249 【深基13.例1】查找 - 洛谷](https://www.luogu.com.cn/problem/P2249)

![image-20260126230527342](/images/image-20260126230527342.png)

题目很简单，就是编号，要是没找着就输出-1

没啥好说的，就是套用模板一，找出第一个大于等于某个数的数。

代码：

```cpp
#include<bits/stdc++.h>
using namespace std;
int n,m,a[1000001],x;
int main(){
	std::cin>>n>>m;
	for(int i=1;i<=n;i++) std::cin>>a[i];
	for(int i=1;i<=m;i++){
		std::cin>>x; 
		int l=1,r=n;
		while(l<r){
			int mid=l+r>>1;
			if(x<=a[mid]) r=mid;
			else l=mid+1;
		}
		if(a[l]==x) std::cout<<l<<" ";
		else std::cout<<-1<<" ";
	}
	return 0;
}
```

### P1102 A-B 数对

下面来看到升级点的二分查找

[P1102 A-B 数对 - 洛谷](https://www.luogu.com.cn/problem/P1102)

![image-20260126230755836](/images/image-20260126230755836.png)

这个题目描述也很简洁（其实在OI里，越简洁，越无语），也就是在一个数组里找A-B=C的数对数嘛，但这里要注意，二分的前提是单调，这里得先排个序。

然后正式进入正题，我们可以从第一个开始，将初始设在后一位，然后对他后面的部分进行查找，看是否有满足的，同时，因为有可能有重复数字，如果找着了差值正好满足的数，还得多一步找第一个小于等于这个数的数的位置，为啥是小于等于呢？你且想想，如果有三个5，5 5 5，套用模板二时，当满足a[mid]<=x时，他会选择往后跳，l=mid，这样就可以定位到最后一个5啦。然后区间相减算出个数，累加即可。

看看代码理解理解：

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
	long long n,c,a[200010],s,mid,t=0;
	scanf("%lld%lld",&n,&c);
	for(int i=1;i<=n;i++) scanf("%lld",&a[i]);
	sort(a+1,a+1+n);
	for(int i=1;i<n;i++){
		int l=i+1,r=n;
		while(l<r){
			int mid=l+r>>1;
			if(a[mid]-a[i]>=c) r=mid;
			else l=mid+1;
		}
		if(a[l]-a[i]==c) s=l;
		else continue;
		l=s-1,r=n;
		while(l<r){
			int mid=l+r+1>>1;
			if(a[mid]<=a[s]) l=mid;
			else r=mid-1;
		}
		t+=l-s+1;
	}
	printf("%lld",t);
	return 0;
}
```

首先，开始是找第一个差值大于等于c的元素位置，为啥是大于等于呢？这里值得好好想想，因为我要定位第一个让差值大于或等于这个给定c的元素位置，如果你定位的小于等于的，你可以这么理解，模板二处理第一个小于等于某个数的元素位置，也就是在向右走，往后边搜，拿个例子理解吧

3 5 5 7 7 9     如果我要找第一个小于等于5的元素位置

一.    l=0   r=6   mid=3   a[3]>5   r=2

二.    l=0   r=2   mid=1   a[1]<=5   l=1

三.    l=1   r=2   mid=2   a[2]<=5   l=2

四.    l=r=2    退出    输出2

**对比：**

3 5 5 7 7 9     如果我要找第一个大于等于5的元素位置

一.    l=0   r=6   mid=3   a[3]>=5   r=3

二.    l=0   r=3   mid=1   a[1]>=5   r=1

三.    l=0   r=1   mid=0   a[0]<5   l=1

四.    l=r=1    退出    输出1

通过上述例子想必理解了吧，第一个大于等于，就会往前找，也就是第一个位置（如果重复元素的话），但如果是第一个小于等于，就会往后找，也就是最后一个位置（重复元素情况）

回到该题，所以说先定位到第一个满足条件的数上面，然后执行第二段，找到区间，求出满足条件的元素数。

### P1678 烦恼的高考志愿

最后，以一道二分查找题首尾查找部分的讲述。

[P1678 烦恼的高考志愿 - 洛谷](https://www.luogu.com.cn/problem/P1678)

![image-20260127151444557](/images/image-20260127151444557.png)

这题其实思路非常简单，但不知为何我当时竟然没做出来😓，因为我想着要求每一个人的最小满意度，那我从第一个人起二分去算，看他是否小于我的最小值，然后进行更新，但这样我陷入了苦恼，咋知道第一次得往左走还是往右走呢？

其实就是思路有问题，根本就无需这样做，用二分查找去定位就行了，定位一个第一个大于等于或者小于等于它的数，然后下一步看看是左侧/右侧小，还是他自己差值小，然后就行了，所以说，二分查找本质就是找第一个大于等于或者小于等于某个数的元素位置（也可以理解为趋近于这个数），然后比差值就好了。。

给出代码：

```cpp
#include<bits/stdc++.h>
#define ll long long
using namespace std;
ll n,m,a[1000001],x,s=0;
int main(){
	std::cin>>m>>n;
	for(int i=0;i<m;i++) std::cin>>a[i];
	sort(a,a+m);
	for(int i=0;i<n;i++){
		std::cin>>x;
        if(x<=a[0]){
            s+=abs(x-a[0]);
            continue;
        }
        if(x>=a[m-1]){
            s+=abs(x-a[m-1]);
            continue;
        }
		int l=0,r=m;
		while(l<r){
			int mid=l+r>>1;
			if(a[mid]>=x) r=mid;
			else l=mid+1;
		}
		if(l==0){
            s+=abs(a[l]-x);
            continue;
        }
		else{
			s+=min(abs(a[l]-x),abs(a[l-1]-x));
		}
	}
	std::cout<<s;
	return 0;
}
```

注意了：做任何题都要考虑**极端情况**，比如数组越界，或者特殊情形，就比如这题如果一开始就在最左侧或者最右侧，那我无需往下做呀，直接计算然后返回就行了。 

## 二分答案

看完这两道例题，想必对二分查找已经有了深刻的认知，下面进入下一个章程----二分答案。

其实二分答案跟二分查找没有本质上的区别，只不过二分查找是在数组中通过不断二分定位想要找的位置，最后达成效果，但是二分答案在判断条件上有所不同，通常用check()来写判断，由判断的真假值来决定是往后靠还是往前靠，下面我们从例题讲起。

### P1873 EKO / 砍树

[P1873 [COCI 2011/2012 #5\] EKO / 砍树 - 洛谷](https://www.luogu.com.cn/problem/P1873)

![image-20260127141254282](/images/image-20260127141254282.png)

题目很好理解，就是我要考虑一个锯片机高度，让这个高度去锯木头，所有锯下来的高度累计和至少为M米，也就是大于等于，但这题难点（新颖点）在于：**如果再升高一米，他将得不到M米木材**

深入解析一下这句话，因为我二分去试的是可能的锯片高度，保证锯下来的长度>=M，但如果升高一米，他就会<M米，是这个意思吧，所以我们就可以知道了，边界条件是一米，在写l，r，的while条件时就不能只写while(l<r)了，而是while(l+1<r)，其实可以这么理解，这个条件最后退出循环的时候，l与r是差一米的，也就代表了l此时合法（并且属于边界），r此时不合法（也处于边界），这也就正切合题意，同时注意了，二分答案和二分查找不同之处一个在l与r的取值，还有在于l与r的收缩范围，从代码来分析吧。

```cpp
#include<bits/stdc++.h>
using namespace std;
int a[1000001];
long long n,m;
int check(int x){
	long long s=0;
	for(int i=0;i<n;i++){
		if(a[i]>x) s+=(long long)(a[i]-x);
	}
	return s>=m;
}
int main(){
	std::cin>>n>>m;
	for(int i=0;i<n;i++) std::cin>>a[i];
	sort(a,a+n);
    int ll=*max_element(a,a+n);
	int l=1,r=ll;
	while(l+1<r){
		int mid=(l+r+1)/2;
		if(check(mid)) l=mid;
		else r=mid;
	}
	std::cout<<l;
	return 0;
}
```

从代码上看，l，r的初始取值应该很清楚吧，其次就是对于check部分，照常把锯下来的木头长度算出来，然后返回s>=m，代表如果为真，就是木头长度大于等于标准值，需要再高些，l=mid没有问题，但反之，使用了r=mid，而非r=mid-1，这里就涉及二分答案的巧妙之处了。

从样例分析吧，模拟一遍

20 15 10 17

一.    l=1   r=20   mid=11   s=9+4+6=19>=7   l=11

二.    l=11   r=20   mid=16   s=4+1=5<7   r=16

三.    l=11   r=16   mid=14   s=6+1+3=10>=7   l=14

四.    l=14   r=16   mid=15   s=5+2=7=7   l=15

五.    l+1=16=r    退出    输出15    即为正确答案（其实也恰好为所要求的长度）

这里我可以验证一下，如果加一米16，那么长度为4+1=5<7    就无法得到7米了。。。

下面如果我改为r=mid-1，让我们看看结果如何

一.    l=1   r=20   mid=11   s=9+4+6=19>=7   l=11

二.    l=11   r=20   mid=16   s=4+1=5<7   r=15

三.    l=11   r=15   mid=13   s=7+2+4=13>=7   l=13

四.    l=13   r=15   mid=14   s=6+1+3=10>=7   l=14

五.    l+1=15=r    退出    输出14     发现了吧，这就错了

虽说长度为14时，锯出来的长度为10的确大于等于7，但是15的时候正好是7呀，他为啥没考虑到❓

是因为第三步的时候就已经出了问题，因为你用的是r=mid-1，就标志着你把mid=16这个值直接舍弃了，然后后面即便是一直往前找也找不到15了，通过这个演示肯定能理解了吧，mid可能就会是我们的答案（r或者l的值），所以说，这里的l和r在跳跃时，不能有加一或减一，否则可能跳过正确答案。

### P1024 一元三次方程求解

第一道题解决了，下面看第二道

[P1024 [NOIP 2001 提高组\] 一元三次方程求解 - 洛谷](https://www.luogu.com.cn/problem/P1024)

![image-20260127152711010](/images/image-20260127152711010.png)

这道题的题目很好理解，就是求一元三次方程的根，根据题目意思范围在-100~100，然后差值的绝对值>=1，有这两个条件，就可以写代码了，注意，编程中用1e-6来代替0

```cpp
#include<bits/stdc++.h>
using namespace std;
const double eps=1e-6;
double a,b,c,d;
double calc(double x){
	double p=a*pow(x,3)+b*pow(x,2)+c*x+d;
	return p;
}
int main(){
	scanf("%lf%lf%lf%lf",&a,&b,&c,&d);
	int s=0;
	for(int i=-100;i<=100;i++){
		double l=i;
		double r=i+1;
		if(calc(l)==0){
			printf("%.2lf ",l);
			s++;
		}
		else if(calc(l)*calc(r)<0){
			while(abs(l-r)>eps){
				double mid=(l+r)/2;
				if(calc(mid)*calc(r)<=0) l=mid;
				else if(calc(mid)*calc(r)>0) r=mid;
			}
			printf("%.2lf ",r);
			s++;
		}
		if(s==3) break;
	}
	return 0;
}
```

这题跟上一题一样，都要考虑mid就是答案的情况。。。

### P2678 跳石头

接下来，进入二分答案相对难的一道题

[P2678 [NOIP 2015 提高组\] 跳石头 - 洛谷](https://www.luogu.com.cn/problem/P2678)

很经典的二分答案。

![image-20260127153548483](/images/image-20260127153548483.png)

看完题目，很经典的二分答案题，就是试答案，要求最短跳跃距离的最大值，那我们从已知的最大长度起手，标定l与r，然后开始二分，check函数中我们去找，如果有两块石头间距超过了最短距离，那就把它移走，从而计数器加一，最后看看总共要搬走几块石头，如果搬走的石头超过了M，说明尝试的最短距离太大了，所以就得往前缩，否则就往后扩，但这道题要求的是最大值，也就是得不断往右试探，利用模板二

同时，这里在判断函数中用到了一个巧思，可以看看 [跳石头--洛谷.md](D:\C语言\算法笔记\巧妙思路\跳石头--洛谷.md) 

下面直接带来代码：

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=1e8+2;
long long l1,n,m,a[N];
long long check(int x){
	int t=0,last=0;
	for(int i=0;i<=n;i++){
		if(a[i]-last<x) t++;
		else last=a[i];
	}
	return t<=m;
}
int main(){
    long long result;
	std::cin>>l1>>n>>m;
	for(int i=0;i<n;i++) std::cin>>a[i];
    a[n]=l1;
	int l=0,r=l1;
	while(l<r){
		long long mid=l+r+1>>1;
		if(check(mid)) l=mid;
		else r=mid-1;
	}
	std::cout<<l;
	return 0;
}
```

这里我为了省事，直接套用的模板，因为这里不像砍树那题一样，砍树是说了只要再多一米，就是不合法的情况，但这题不是，如果跳跃距离多了一，未必搬走的石头数会增加或减少，所以单纯套用模板就行。还有一点，一定记得把末尾添上，不然AC不了

但有的大佬会这么写，感觉效果差不多。。。

```cpp
# include <iostream>
using namespace std;
int a[50004],l,n,m;
bool check(int d){ // 判断是否合法，计算要移走的石头个数
	int cnt = 0,pos = 0;
	for (int i = 0;i < n;i++){
		if (a[i] - pos < d) cnt++;
		else pos = a[i];
	}if (l - pos < d) cnt++;
    return cnt <= m; // 判断要移走的石头个数
}int main(){
	cin >> l >> n >> m;
    for (int i = 0;i < n;i++) cin >> a[i];
	int left = 1,right = l,ans = -1; // 二分
	while (left <= right){
		int mid = (left + right) >> 1;
		if (check(mid)) left = mid + 1,ans = mid;
		else right = mid - 1;
	}cout << ans;
	return 0;
}

```

![img](https://dl4.weshineapp.com/gif/20210908/3674ca9e87fa4fca3ec6d3d6cc90f444.gif?f=micro_)

就这样 结束啦。。。。。
