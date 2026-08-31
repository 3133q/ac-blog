# 前缀和思想

[Problem - B - Codeforces](https://codeforces.com/contest/2242/problem/B)

> 来自Codeforces的一道题，划分数组问题

## 题目描述

![image-20260707092617676](/images/image-20260707092617676.png)

## 分析

本质上就是问一个数组（只由1,2,3,组成）是否能分为3部分，第一部分大于1的数字个数不能超过第一部分数组长度的一半，类推，第二部分大于2的数字个数不能超过第二部分的数组总长度的一半，第三部分也是一样。。。

其实一开始很容易去直接动态更新1,2,3的数量，然后分开来比较，但这样一是很难处理，因为你不知道第一部分该到哪里结束，第二部分该从哪里开始，是否能开始，所以需要联想到前缀和的优化思路

对于第一部分 num1&gt;=num2+num3

对于第二部分 num1+num2&gt;=num3

第三部分只要非空即可

那不妨将第一部分1设为加1,将2,3设为减1；

第二部分1和2设为加1,将3设为减1

结果就是，只要p1[i]&gt;=0，即当前i满足第一部分的构造，然后我们就可以去看第二部分是否存在j，使得它满足第二部分，这里就可以直接整一个maxx数组，去存储从当前位置往后最大的p2[i]，然后去扫一轮即可，前缀和直接算出第二部分就行了。

## 代码

```c++
#include<iostream>
#include<vector>
#include<algorithm>
#define int long long
using namespace std;
const int N=2e5+10;
int a[N],pre[N],pre1[N];
void solve() {
    int n;
    std::cin>>n;
    for(int i=1;i<=n;i++) std::cin>>a[i];
    for(int i=1;i<=n;i++){
    	if(a[i]==1) {
    		pre[i]=pre[i-1]+1;
    		pre1[i]=pre1[i-1]+1;
		}
    	if(a[i]==2){
    		pre[i]=pre[i-1]-1;
    		pre1[i]=pre1[i-1]+1;
		}
		if(a[i]==3){
			pre[i]=pre[i-1]-1;
			pre1[i]=pre1[i-1]-1;
		}
	}
	vector<int>maxx(n+1,-1e18);
	maxx[n-1]=pre1[n-1];
	for(int i=n-2;i>=1;i--){
		maxx[i]=max(maxx[i+1],pre1[i]);
	}
	for(int i=1;i<=n-2;i++){
		if(pre[i]<0) continue;
		int j=i+1;
		if(maxx[j]>=pre1[i]){
			std::cout<<"YES"<<'\n';
			return ;
		}
	}
	std::cout<<"NO"<<'\n';
	return ;
}
signed main() {
    int t;
    std::cin>>t;
	for(int i=0;i<t;i++) solve(); 
    return 0;
}
```

