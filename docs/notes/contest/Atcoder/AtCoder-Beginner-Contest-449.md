# AtCoder Beginner Contest 449

> 补题开始ing

## C

### 题目概述

![image-20260424155638225](/images/image-20260424155638225.png)

### 分析

大致意思就是说有一串字符串，要我们去找总共存在几对组合，满足si=sj，并且j-i在L与R之间

其实这道题考的思路很经典，类似题可以去看 巧妙思路--往前匹配法 ，是一样的，就是说你要我找出共有几对，而且长度有限制，那我就暴力dp，从大于等于l开始，每轮对于i，直接看看s[i-l]是否和s[i]一致，要是一致的话，那么加加，要是出现了i大于等于r的情况就得考虑是否会出界，所以需要将s[i-r]减减，表示的是该位置不可取，需要向前挪，才可以控制范围在[l,r]

### 代码

```c++
#include<iostream>
#include<cstdio>
#include<cstring>
#include<algorithm>
#include<vector>
#include<cmath>
#include<map>
#include<climits>
using namespace std;
using ll=long long;
ll dp[1001];
int main(){
	//map<pair<char,int>,int>mp;
	ll n,l,r,ans=0;
	std::cin>>n>>l>>r;
	r++;
	string s;
	std::cin>>s;
	for(int i=0;i<n;i++){
		if(i>=l) dp[s[i-l]-'a']++;
		if(i>=r) dp[s[i-r]-'a']--;
		ans+=dp[s[i]-'a'];
	}
	std::cout<<ans;
	return 0;
}
```

---

## D

### 题目概述

![image-20260424160758868](/images/image-20260424160758868.png)

![image-20260424160809939](/images/image-20260424160809939.png)

其实硬说可以概述为单纯模拟一下，但得对题目有比较深刻的理解和思路

具体可以看看代码

### 代码

```c++
#include<iostream>
#include<cstdio>
#include<cstring>
#include<algorithm>
#include<vector>
#include<cmath>
#include<map>
#include<climits>
using namespace std;
using ll=long long;
const int N=1e6+2;
int main(){
	int l,r,d,u,t=1;
	ll ans=0;
	std::cin>>l>>r>>d>>u;
	for(int x=l;x<=r;x++){
		if(x%2==0){
			int x1=max(d,-abs(x)+1);
			int x2=min(u,abs(x)-1);
			ans+=max(0,x2-x1+1);
		}
	}	
	for(int y=d;y<=u;y++){
		if(y%2==0){
			int y1=max(l,-abs(y));
			int y2=min(r,abs(y));
			ans+=max(0,y2-y1+1);
		}
	}
	std::cout<<ans;
	return 0;
}
```

