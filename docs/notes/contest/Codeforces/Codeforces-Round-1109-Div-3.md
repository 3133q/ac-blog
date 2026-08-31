# Codeforces Round 1109 (Div. 3)

## C

### 1.题目描述

![image-20260716123204416](/images/image-20260716123204416.png)

### 2.分析

该题目的大致意思就是，给出一个排列，并给出x,y，每步操作中，可以选择i,j同时满足（|i-j|=x 或者 |i-j|=y），那就可以将pi与pj交换，问是否能通过任意次操作使得最终数组排好序

其实仔细想想就能知道，要想最终数组排好序，又因为这是一个排列，也就是1,2,3...这些数字都会出现，且不会有别的，那不就很简单了，只需要判断目前这个数能不能换到他应该在的位置就行了，如果都可以的话，就输出YES，否则NO

接着分析操作，因为每次可以找一个|i-j|=x 或者 |i-j|=y，也就是可以拼接这两个基准值，因为可以先x后y然后类推，所以，可以总结为一个数字他可以到达的位置满足ax+by，所以只要判断abs(p[i]-i)是否满足ax+by的形式就行了，不过，这里需要一点手法，定理！

**裴蜀定理**

> 对于任意两个整数x和y，只要你对他们进行任意次数的加减操作即(ax+by)，你能凑出来的最小正整数，恰好就是他们的最大公约数gcd(x,y)，而且，你能凑出来的所有距离，必定是gcd(x,y)的倍数

有了这个定理这题直接秒了。。

### 代码

```c++
#include<bits/stdc++.h>
#define int long long
using namespace std;
int n,x,y;
void solve(){
	std::cin>>n>>x>>y;
	vector<int>p(n+1);
	for(int i=1;i<=n;i++) std::cin>>p[i];
	int c=__gcd(x,y);
	for(int i=1;i<=n;i++){
		int s=abs(p[i]-i);
		if(s==0) continue;
		if(s%c!=0){
			std::cout<<"NO"<<'\n';
			return ;
		}
	}
	std::cout<<"YES"<<'\n';
	return ;
}
signed main(){
	int t;
	std::cin>>t;
	for(int i=0;i<t;i++) solve();
	return 0;
}
```

---

## D

### 1.题目描述

![image-20260716124804430](/images/image-20260716124804430.png)

### 2.分析

意思就是，给出一个原始数组a，和一个数组b，现在可以进行一个操作，就是选任意个b数组中的数（也可以为0），选中的数比如是c，那就将a数组中前c个元素符号翻转，变为新的数组，问经过任意次（可能为0）操作之后最终能达到的数组元素总和最大是多少

可以先试试看，对于b1，b2，假设b1&lt;b2，进行操作，先是b1翻转符号一次，然后b2再翻转，会发现1~b1那部分被翻转了两次，即没有变动，也就是说，对于bi~bj，实际上动的只有中间那部分（bi+1~bj），即分块去计算，对于每块，要想让最终总和达到最大，如果这一块和为正数，那直接加就行，不需要翻，如果是负数，那就翻转一下把他们变成正数，这样就能使最终和达到最大

### 代码

```c++
#include<bits/stdc++.h>
#define int long long
using namespace std;
void solve(){
	int n,k;
	std::cin>>n>>k;
	vector<int>a(n+1,0);
	vector<int>aa(n+1,0);
	vector<int>b(k+1,0);
	for(int i=1;i<=n;i++) {
		std::cin>>a[i];
		aa[i]=aa[i-1]+a[i];
	}
	for(int i=1;i<=k;i++) std::cin>>b[i];
	sort(b.begin(),b.end());
	b.erase(unique(b.begin(),b.end()),b.end());
	b[0]=0;
	int total=0;
	for(int i=1;i<=k;i++){
		int x=b[i-1]+1,y=b[i];
		int sum=aa[y]-aa[x-1];
		total+=abs(sum);
	}
	if(b[k]+1<=n){
		for(int i=b[k]+1;i<=n;i++) total+=a[i];
	}
	std::cout<<total<<'\n';
	return ;
}
signed main(){
	int t;
	std::cin>>t;
	for(int i=0;i<t;i++) solve();
	return 0;
}
```

> 对于unique的使用，作用在于去重，它返回的是一个迭代器，相当于把去重好的数字放在前面，其余的堆在最后，所以说只需要erase一下末尾就行了
